"use client";
import { useState, useEffect, useRef } from 'react';
import { FiLink, FiPlus, FiUpload, FiRefreshCw, FiTrash2, FiExternalLink, FiCheckCircle, FiXCircle, FiClock, FiArrowUp, FiArrowDown, FiTag } from 'react-icons/fi';

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState<'coupons' | 'backlinks'>('backlinks');
    
    return (
        <div className="min-h-screen bg-appleBg pt-24 pb-12 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
                {/* Tab Switcher */}
                <div className="flex items-center gap-3 mb-8">
                    <button
                        onClick={() => setActiveTab('backlinks')}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${activeTab === 'backlinks' ? 'bg-appleBlue text-white shadow-lg shadow-blue-500/25' : 'bg-appleCard text-appleMuted border border-appleBorder hover:text-appleText'}`}
                    >
                        <FiLink size={16} /> Backlinks Tracker
                    </button>
                    <button
                        onClick={() => setActiveTab('coupons')}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${activeTab === 'coupons' ? 'bg-appleBlue text-white shadow-lg shadow-blue-500/25' : 'bg-appleCard text-appleMuted border border-appleBorder hover:text-appleText'}`}
                    >
                        <FiTag size={16} /> Add Coupon
                    </button>
                </div>

                {activeTab === 'backlinks' ? <BacklinksTracker /> : <CouponAdder />}
            </div>
        </div>
    );
}

// ========== BACKLINKS TRACKER ==========
function BacklinksTracker() {
    const [backlinks, setBacklinks] = useState<any[]>([]);
    const [stats, setStats] = useState({ total: 0, active: 0, lost: 0, pending: 0, dofollow: 0, nofollow: 0 });
    const [loading, setLoading] = useState(true);
    const [checking, setChecking] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [message, setMessage] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterType, setFilterType] = useState('all');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [newLink, setNewLink] = useState({ url: '', anchorText: '', targetUrl: 'https://couponvault.in', type: 'unknown', domainAuthority: '', notes: '' });

    const fetchBacklinks = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (filterStatus !== 'all') params.set('status', filterStatus);
            if (filterType !== 'all') params.set('type', filterType);
            
            const res = await fetch(`/api/admin/backlinks?${params.toString()}`);
            const data = await res.json();
            if (data.success) {
                setBacklinks(data.backlinks);
                setStats(data.stats);
            }
        } catch (err) {
            console.error('Failed to fetch backlinks');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBacklinks(); }, [filterStatus, filterType]);

    const handleAddLink = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        try {
            const res = await fetch('/api/admin/backlinks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...newLink,
                    domainAuthority: parseInt(newLink.domainAuthority) || 0,
                }),
            });
            const data = await res.json();
            if (res.ok) {
                setMessage('✅ Backlink added!');
                setNewLink({ url: '', anchorText: '', targetUrl: 'https://couponvault.in', type: 'unknown', domainAuthority: '', notes: '' });
                setShowAddForm(false);
                fetchBacklinks();
            } else {
                setMessage('❌ ' + data.error);
            }
        } catch (err: any) {
            setMessage('❌ ' + err.message);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this backlink?')) return;
        try {
            await fetch(`/api/admin/backlinks?id=${id}`, { method: 'DELETE' });
            fetchBacklinks();
        } catch (err) {
            console.error('Failed to delete');
        }
    };

    const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        setMessage('');
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await fetch('/api/admin/backlinks/upload', { method: 'POST', body: formData });
            const data = await res.json();
            if (data.success) {
                setMessage(`✅ CSV uploaded! ${data.stats.inserted} inserted, ${data.stats.skipped} skipped`);
                fetchBacklinks();
            } else {
                setMessage('❌ ' + data.error);
            }
        } catch (err: any) {
            setMessage('❌ ' + err.message);
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleCheckAll = async () => {
        setChecking(true);
        setMessage('');
        try {
            const res = await fetch('/api/admin/backlinks/check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({}),
            });
            const data = await res.json();
            if (data.success) {
                setMessage(`✅ Check done! ${data.stats.active} active, ${data.stats.lost} lost, ${data.stats.errors} errors`);
                fetchBacklinks();
            } else {
                setMessage('❌ ' + data.error);
            }
        } catch (err: any) {
            setMessage('❌ ' + err.message);
        } finally {
            setChecking(false);
        }
    };

    const handleCheckSingle = async (id: string) => {
        try {
            const res = await fetch('/api/admin/backlinks/check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            const data = await res.json();
            if (data.success) fetchBacklinks();
        } catch (err) {
            console.error('Check failed');
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active': return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold"><FiCheckCircle size={12}/> Active</span>;
            case 'lost': return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold"><FiXCircle size={12}/> Lost</span>;
            default: return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold"><FiClock size={12}/> Pending</span>;
        }
    };

    const getTypeBadge = (type: string) => {
        switch (type) {
            case 'dofollow': return <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">DoFollow</span>;
            case 'nofollow': return <span className="px-2.5 py-1 rounded-full bg-gray-200 text-gray-600 text-xs font-semibold">NoFollow</span>;
            default: return <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold">Unknown</span>;
        }
    };

    const getDomain = (url: string) => {
        try { return new URL(url).hostname; } catch { return url; }
    };

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <StatCard label="Total" value={stats.total} color="bg-gradient-to-br from-blue-500 to-blue-600" />
                <StatCard label="Active" value={stats.active} color="bg-gradient-to-br from-green-500 to-green-600" />
                <StatCard label="Lost" value={stats.lost} color="bg-gradient-to-br from-red-500 to-red-600" />
                <StatCard label="Pending" value={stats.pending} color="bg-gradient-to-br from-yellow-500 to-yellow-600" />
                <StatCard label="DoFollow" value={stats.dofollow} color="bg-gradient-to-br from-indigo-500 to-indigo-600" />
                <StatCard label="NoFollow" value={stats.nofollow} color="bg-gradient-to-br from-gray-500 to-gray-600" />
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center gap-3">
                <button onClick={() => setShowAddForm(!showAddForm)} className="flex items-center gap-2 px-4 py-2.5 bg-appleBlue text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20">
                    <FiPlus size={16}/> Add Link
                </button>
                <label className={`flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 transition-all cursor-pointer shadow-lg shadow-purple-500/20 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                    <FiUpload size={16}/> {uploading ? 'Uploading...' : 'Upload CSV'}
                    <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleCSVUpload} disabled={uploading} />
                </label>
                <button onClick={handleCheckAll} disabled={checking} className={`flex items-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 ${checking ? 'opacity-50 pointer-events-none' : ''}`}>
                    <FiRefreshCw size={16} className={checking ? 'animate-spin' : ''}/> {checking ? 'Checking...' : 'Check All Links'}
                </button>

                {/* Filters */}
                <div className="ml-auto flex items-center gap-2">
                    <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2 bg-appleCard border border-appleBorder rounded-xl text-sm text-appleText outline-none">
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="lost">Lost</option>
                        <option value="pending">Pending</option>
                    </select>
                    <select value={filterType} onChange={e => setFilterType(e.target.value)} className="px-3 py-2 bg-appleCard border border-appleBorder rounded-xl text-sm text-appleText outline-none">
                        <option value="all">All Types</option>
                        <option value="dofollow">DoFollow</option>
                        <option value="nofollow">NoFollow</option>
                    </select>
                </div>
            </div>

            {/* Message */}
            {message && (
                <div className={`p-4 rounded-xl text-sm font-medium ${message.includes('❌') ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-600 border border-green-200'}`}>
                    {message}
                </div>
            )}

            {/* Add Link Form */}
            {showAddForm && (
                <form onSubmit={handleAddLink} className="bg-appleCard p-6 rounded-2xl border border-appleBorder space-y-4 shadow-apple">
                    <h3 className="text-lg font-bold text-appleText">Add New Backlink</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input required type="url" placeholder="https://example.com/your-link-page" className="w-full p-3 rounded-xl bg-appleBg border border-appleBorder text-appleText outline-none focus:border-appleBlue text-sm" value={newLink.url} onChange={e => setNewLink({...newLink, url: e.target.value})} />
                        <input type="text" placeholder="Anchor Text (e.g. CouponVault)" className="w-full p-3 rounded-xl bg-appleBg border border-appleBorder text-appleText outline-none focus:border-appleBlue text-sm" value={newLink.anchorText} onChange={e => setNewLink({...newLink, anchorText: e.target.value})} />
                        <input type="text" placeholder="Target URL (your page)" className="w-full p-3 rounded-xl bg-appleBg border border-appleBorder text-appleText outline-none focus:border-appleBlue text-sm" value={newLink.targetUrl} onChange={e => setNewLink({...newLink, targetUrl: e.target.value})} />
                        <select className="w-full p-3 rounded-xl bg-appleBg border border-appleBorder text-appleText outline-none focus:border-appleBlue text-sm" value={newLink.type} onChange={e => setNewLink({...newLink, type: e.target.value})}>
                            <option value="unknown">Type: Unknown</option>
                            <option value="dofollow">DoFollow</option>
                            <option value="nofollow">NoFollow</option>
                        </select>
                        <input type="number" min="0" max="100" placeholder="Domain Authority (0-100)" className="w-full p-3 rounded-xl bg-appleBg border border-appleBorder text-appleText outline-none focus:border-appleBlue text-sm" value={newLink.domainAuthority} onChange={e => setNewLink({...newLink, domainAuthority: e.target.value})} />
                        <input type="text" placeholder="Notes (optional)" className="w-full p-3 rounded-xl bg-appleBg border border-appleBorder text-appleText outline-none focus:border-appleBlue text-sm" value={newLink.notes} onChange={e => setNewLink({...newLink, notes: e.target.value})} />
                    </div>
                    <div className="flex gap-3">
                        <button type="submit" className="px-6 py-2.5 bg-appleBlue text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition-all">Save Backlink</button>
                        <button type="button" onClick={() => setShowAddForm(false)} className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-300 transition-all">Cancel</button>
                    </div>
                </form>
            )}

            {/* Backlinks Table */}
            <div className="bg-appleCard rounded-2xl border border-appleBorder shadow-apple overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-appleBorder bg-appleBg/50">
                                <th className="text-left px-4 py-3 font-semibold text-appleMuted">Source URL</th>
                                <th className="text-left px-4 py-3 font-semibold text-appleMuted hidden md:table-cell">Anchor</th>
                                <th className="text-center px-4 py-3 font-semibold text-appleMuted">Type</th>
                                <th className="text-center px-4 py-3 font-semibold text-appleMuted">Status</th>
                                <th className="text-center px-4 py-3 font-semibold text-appleMuted hidden sm:table-cell">DA</th>
                                <th className="text-center px-4 py-3 font-semibold text-appleMuted hidden lg:table-cell">Last Checked</th>
                                <th className="text-center px-4 py-3 font-semibold text-appleMuted">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={7} className="text-center py-12 text-appleMuted">Loading backlinks...</td></tr>
                            ) : backlinks.length === 0 ? (
                                <tr><td colSpan={7} className="text-center py-12 text-appleMuted">No backlinks found. Add one or upload a CSV!</td></tr>
                            ) : (
                                backlinks.map((link: any) => (
                                    <tr key={link._id} className="border-b border-appleBorder/50 hover:bg-appleBg/30 transition-colors">
                                        <td className="px-4 py-3">
                                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-appleBlue hover:underline flex items-center gap-1 max-w-[250px] truncate">
                                                {getDomain(link.url)} <FiExternalLink size={12}/>
                                            </a>
                                            {link.notes && <p className="text-xs text-appleMuted mt-0.5 truncate max-w-[250px]">{link.notes}</p>}
                                        </td>
                                        <td className="px-4 py-3 text-appleText hidden md:table-cell">
                                            <span className="truncate max-w-[150px] block">{link.anchorText || '—'}</span>
                                        </td>
                                        <td className="px-4 py-3 text-center">{getTypeBadge(link.type)}</td>
                                        <td className="px-4 py-3 text-center">{getStatusBadge(link.status)}</td>
                                        <td className="px-4 py-3 text-center hidden sm:table-cell">
                                            <span className={`font-bold ${link.domainAuthority >= 50 ? 'text-green-600' : link.domainAuthority >= 20 ? 'text-yellow-600' : 'text-gray-500'}`}>
                                                {link.domainAuthority || '—'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center text-xs text-appleMuted hidden lg:table-cell">
                                            {link.lastCheckedAt ? new Date(link.lastCheckedAt).toLocaleDateString() : 'Never'}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                <button onClick={() => handleCheckSingle(link._id)} title="Check this link" className="p-1.5 rounded-lg hover:bg-blue-100 text-appleBlue transition-colors">
                                                    <FiRefreshCw size={14}/>
                                                </button>
                                                <button onClick={() => handleDelete(link._id)} title="Delete" className="p-1.5 rounded-lg hover:bg-red-100 text-red-500 transition-colors">
                                                    <FiTrash2 size={14}/>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {!loading && backlinks.length > 0 && (
                    <div className="px-4 py-3 border-t border-appleBorder bg-appleBg/30 text-xs text-appleMuted">
                        Showing {backlinks.length} of {stats.total} backlinks
                    </div>
                )}
            </div>
        </div>
    );
}

// ========== STAT CARD ==========
function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
    return (
        <div className={`${color} rounded-2xl p-4 text-white shadow-lg`}>
            <p className="text-white/70 text-xs font-medium">{label}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
    );
}

// ========== COUPON ADDER (Original Admin) ==========
function CouponAdder() {
    const [platforms, setPlatforms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [formData, setFormData] = useState({
        platform: '',
        code: '',
        discountType: 'percentage',
        discountValue: '',
        description: '',
        minPurchase: '0'
    });

    useEffect(() => {
        fetch('/api/platforms')
            .then(res => res.json())
            .then(data => setPlatforms(data.data || []));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const res = await fetch('/api/admin/add-coupon', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            
            if (res.ok) {
                setMessage('✅ Coupon added successfully!');
                setFormData({ ...formData, code: '', description: '', discountValue: '' });
            } else {
                setMessage('❌ Error: ' + data.error);
            }
        } catch (err: any) {
            setMessage('❌ Error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-appleCard p-8 rounded-2xl shadow-apple border border-appleBorder">
            <h1 className="text-2xl font-bold text-appleText mb-6">Add Manual Coupon</h1>
            <p className="text-appleMuted mb-8 text-sm">Use this tool to add 100% verified codes manually.</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-appleText mb-2">Platform</label>
                    <select 
                        required
                        className="w-full p-3 rounded-xl bg-appleBg border border-appleBorder text-appleText outline-none focus:border-appleBlue transition-colors"
                        value={formData.platform}
                        onChange={(e) => setFormData({...formData, platform: e.target.value})}
                    >
                        <option value="">Select Platform...</option>
                        {platforms.map((p: any) => (
                            <option key={p._id} value={p._id}>{p.name}</option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-appleText mb-2">Promo Code</label>
                        <input 
                            required
                            type="text"
                            placeholder="e.g. SAVE20"
                            className="w-full p-3 rounded-xl bg-appleBg border border-appleBorder text-appleText outline-none focus:border-appleBlue transition-colors"
                            value={formData.code}
                            onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-appleText mb-2">Min Purchase ($)</label>
                        <input 
                            required
                            type="number"
                            className="w-full p-3 rounded-xl bg-appleBg border border-appleBorder text-appleText outline-none focus:border-appleBlue transition-colors"
                            value={formData.minPurchase}
                            onChange={(e) => setFormData({...formData, minPurchase: e.target.value})}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-appleText mb-2">Discount Type</label>
                        <select 
                            className="w-full p-3 rounded-xl bg-appleBg border border-appleBorder text-appleText outline-none focus:border-appleBlue transition-colors"
                            value={formData.discountType}
                            onChange={(e) => setFormData({...formData, discountType: e.target.value})}
                        >
                            <option value="percentage">Percentage (%)</option>
                            <option value="fixed">Fixed Amount ($)</option>
                            <option value="freeShipping">Free Shipping</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-appleText mb-2">Discount Value</label>
                        <input 
                            required={formData.discountType !== 'freeShipping'}
                            type="number"
                            placeholder="e.g. 20"
                            disabled={formData.discountType === 'freeShipping'}
                            className="w-full p-3 rounded-xl bg-appleBg border border-appleBorder text-appleText outline-none focus:border-appleBlue transition-colors disabled:opacity-50"
                            value={formData.discountValue}
                            onChange={(e) => setFormData({...formData, discountValue: e.target.value})}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-appleText mb-2">Description / Title</label>
                    <input 
                        required
                        type="text"
                        placeholder="e.g. 20% off all electronics"
                        className="w-full p-3 rounded-xl bg-appleBg border border-appleBorder text-appleText outline-none focus:border-appleBlue transition-colors"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-3 px-4 bg-appleBlue text-white font-medium rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                    {loading ? 'Adding...' : 'Add Coupon to Vault'}
                </button>
                
                {message && (
                    <div className={`p-4 rounded-xl text-center ${message.includes('❌') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                        {message}
                    </div>
                )}
            </form>
        </div>
    );
}
