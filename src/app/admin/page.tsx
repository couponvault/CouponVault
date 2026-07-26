"use client";
import { useState, useEffect } from 'react';

export default function AdminPage() {
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
        <div className="min-h-screen bg-appleBg pt-24 pb-12 px-6">
            <div className="max-w-2xl mx-auto bg-appleCard p-8 rounded-2xl shadow-apple">
                <h1 className="text-2xl font-bold text-appleText mb-6">Admin: Add Manual Coupon</h1>
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
        </div>
    );
}
