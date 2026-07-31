import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Backlink from '@/models/Backlink';
import { verifyAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// POST /api/admin/backlinks/upload — Upload CSV and bulk-insert backlinks
export async function POST(request: NextRequest) {
    try {
        const isAdmin = await verifyAdmin(request);
        if (!isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const text = await file.text();
        const lines = text.split('\n').map(line => line.trim()).filter(Boolean);

        if (lines.length < 2) {
            return NextResponse.json({ error: 'CSV file is empty or has no data rows' }, { status: 400 });
        }

        // Parse header to detect column positions
        const header = lines[0].toLowerCase();
        const headerCols = header.split(',').map(h => h.trim().replace(/"/g, ''));

        // Find column indexes (flexible detection)
        const urlIdx = headerCols.findIndex(h => h.includes('url') || h.includes('link') || h.includes('source'));
        const anchorIdx = headerCols.findIndex(h => h.includes('anchor') || h.includes('text'));
        const targetIdx = headerCols.findIndex(h => h.includes('target') || h.includes('destination'));
        const typeIdx = headerCols.findIndex(h => h.includes('type') || h.includes('follow'));
        const daIdx = headerCols.findIndex(h => h.includes('da') || h.includes('authority') || h.includes('domain'));
        const notesIdx = headerCols.findIndex(h => h.includes('note') || h.includes('comment'));

        if (urlIdx === -1) {
            return NextResponse.json({ 
                error: 'CSV must have a column with "url" or "link" in the header' 
            }, { status: 400 });
        }

        let insertedCount = 0;
        let skippedCount = 0;
        let errorCount = 0;

        for (let i = 1; i < lines.length; i++) {
            try {
                // Smart CSV parsing (handles quoted fields with commas)
                const cols = parseCSVLine(lines[i]);

                const url = (cols[urlIdx] || '').trim();
                if (!url) {
                    skippedCount++;
                    continue;
                }

                // Validate URL
                try {
                    new URL(url.startsWith('http') ? url : `https://${url}`);
                } catch {
                    skippedCount++;
                    continue;
                }

                const fullUrl = url.startsWith('http') ? url : `https://${url}`;

                // Check duplicate
                const existing = await Backlink.findOne({ url: fullUrl });
                if (existing) {
                    skippedCount++;
                    continue;
                }

                // Parse type
                let type: 'dofollow' | 'nofollow' | 'unknown' = 'unknown';
                if (typeIdx !== -1) {
                    const typeVal = (cols[typeIdx] || '').toLowerCase();
                    if (typeVal.includes('dofollow') || typeVal.includes('do-follow') || typeVal === 'do') {
                        type = 'dofollow';
                    } else if (typeVal.includes('nofollow') || typeVal.includes('no-follow') || typeVal === 'no') {
                        type = 'nofollow';
                    }
                }

                // Parse DA
                let da = 0;
                if (daIdx !== -1) {
                    da = parseInt(cols[daIdx] || '0') || 0;
                    if (da > 100) da = 100;
                    if (da < 0) da = 0;
                }

                await Backlink.create({
                    url: fullUrl,
                    anchorText: anchorIdx !== -1 ? (cols[anchorIdx] || '').trim() : '',
                    targetUrl: targetIdx !== -1 ? (cols[targetIdx] || 'https://couponvault.in').trim() : 'https://couponvault.in',
                    type,
                    status: 'pending',
                    source: 'csv',
                    domainAuthority: da,
                    notes: notesIdx !== -1 ? (cols[notesIdx] || '').trim() : '',
                });

                insertedCount++;
            } catch (err) {
                errorCount++;
            }
        }

        return NextResponse.json({
            success: true,
            message: `CSV processed successfully`,
            stats: {
                totalRows: lines.length - 1,
                inserted: insertedCount,
                skipped: skippedCount,
                errors: errorCount,
            },
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Helper: Parse a single CSV line, respecting quoted fields
function parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current.trim());
    return result;
}
