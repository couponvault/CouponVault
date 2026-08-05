import { MetadataRoute } from 'next';
import connectDB from '@/lib/mongodb';
import Platform from '@/models/Platform';
import { blogPosts } from '@/data/blogPosts';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://couponvault.in';

    try {
        await connectDB();
        const platforms = await Platform.find({ isActive: true })
            .select('slug updatedAt')
            .maxTimeMS(5000);

        const platformUrls = platforms.map((p) => ({
            url: `${baseUrl}/platforms/${p.slug}`,
            lastModified: p.updatedAt,
            changeFrequency: 'daily' as const,
            priority: 0.8,
        }));

        const blogUrls = blogPosts.map((post) => ({
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: new Date(post.date),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        }));

        return [
            {
                url: baseUrl,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 1,
            },
            {
                url: `${baseUrl}/platforms`,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 0.9,
            },
            {
                url: `${baseUrl}/random`,
                lastModified: new Date(),
                changeFrequency: 'always',
                priority: 0.9,
            },
            {
                url: `${baseUrl}/about`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.5,
            },
            {
                url: `${baseUrl}/blog`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.8,
            },
            {
                url: `${baseUrl}/categories`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.8,
            },
            {
                url: `${baseUrl}/contact`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.5,
            },
            ...platformUrls,
            ...blogUrls,
        ];
    } catch (error) {
        console.error('Sitemap generation error:', error);
        return [
            {
                url: baseUrl,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 1,
            },
        ];
    }
}
