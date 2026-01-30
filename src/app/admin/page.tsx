'use client';

import { useState, useEffect } from 'react';
import { FiPackage, FiGift, FiUsers, FiTrendingUp, FiAlertCircle, FiActivity, FiMessageSquare } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [generateLoading, setGenerateLoading] = useState(false);
    const [selectedPlatform, setSelectedPlatform] = useState('');
    const [couponCount, setCouponCount] = useState(50);
    const [activeTab, setActiveTab] = useState<'dashboard' | 'platforms'>('dashboard');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingPlatform, setEditingPlatform] = useState<any>(null);
    const [platformForm, setPlatformForm] = useState({
        name: '',
        slug: '',
        category: 'Fashion',
        description: '',
        backgroundColor: '#f3f4f6',
        isActive: true
    });

    useEffect(() => {
        fetchStats();
    }, []);

    useEffect(() => {
        if (editingPlatform) {
            setPlatformForm({
                name: editingPlatform.name,
                slug: editingPlatform.slug,
                category: editingPlatform.category,
                description: editingPlatform.description || '',
                backgroundColor: editingPlatform.backgroundColor || '#f3f4f6',
                isActive: editingPlatform.isActive
            });
        } else {
            setPlatformForm({
                name: '',
                slug: '',
                category: 'Fashion',
                description: '',
                backgroundColor: '#f3f4f6',
                isActive: true
            });
        }
    }, [editingPlatform, showAddModal]);

    const fetchStats = async () => {
        try {
            const response = await fetch('/api/admin/stats');

            if (response.status === 401) {
                toast.error('Unauthorized! Please login as admin.');
                window.location.href = '/login';
                return;
            }

            const data = await response.json();

            if (data.success) {
                setStats(data);
            } else {
                toast.error(data.error || 'Failed to load statistics');
            }
        } catch (error) {
            toast.error('Error connecting to Server');
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateCoupons = async () => {
        if (!selectedPlatform) {
            toast.error('Please select a platform');
            return;
        }

        try {
            setGenerateLoading(true);
            const response = await fetch('/api/admin/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    platformId: selectedPlatform,
                    count: couponCount
                })
            });

            const data = await response.json();

            if (data.success) {
                toast.success(data.message);
                fetchStats();
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            toast.error('Error generating coupons');
        } finally {
            setGenerateLoading(false);
        }
    };

    const handleSavePlatform = async () => {
        try {
            const method = editingPlatform ? 'PUT' : 'POST';
            const body = editingPlatform
                ? { ...platformForm, id: editingPlatform._id }
                : platformForm;

            const response = await fetch('/api/admin/platforms', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const data = await response.json();
            if (data.success) {
                toast.success(`Platform ${editingPlatform ? 'updated' : 'added'}!`);
                setShowAddModal(false);
                fetchStats();
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            toast.error('Failed to save platform');
        }
    };

    const handleDeletePlatform = async (id: string) => {
        if (!confirm('Are you sure? This will delete the platform but NOT the coupons (they will remain orphaned).')) return;

        try {
            const response = await fetch(`/api/admin/platforms?id=${id}`, {
                method: 'DELETE'
            });

            const data = await response.json();
            if (data.success) {
                toast.success('Platform deleted');
                fetchStats();
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            toast.error('Failed to delete platform');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="spinner w-12 h-12"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-950 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold font-display mb-2">
                        Admin <span className="gradient-text">Dashboard</span>
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Manage your coupon vault and monitor system performance
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex space-x-4 mb-8 border-b border-gray-200 dark:border-gray-800">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`pb-4 px-2 font-semibold transition-all ${activeTab === 'dashboard' ? 'text-primary-500 border-b-2 border-primary-500' : 'text-gray-500'}`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('platforms')}
                        className={`pb-4 px-2 font-semibold transition-all ${activeTab === 'platforms' ? 'text-primary-500 border-b-2 border-primary-500' : 'text-gray-500'}`}
                    >
                        Manage Platforms
                    </button>
                </div>

                {activeTab === 'dashboard' ? (
                    <>
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {[
                                {
                                    icon: FiPackage,
                                    label: 'Total Platforms',
                                    value: stats?.stats.platforms.total || 0,
                                    active: stats?.stats.platforms.active || 0,
                                    color: 'from-blue-500 to-cyan-500'
                                },
                                {
                                    icon: FiGift,
                                    label: 'Total Coupons',
                                    value: stats?.stats.coupons.total || 0,
                                    active: stats?.stats.coupons.active || 0,
                                    color: 'from-purple-500 to-pink-500'
                                },
                                {
                                    icon: FiTrendingUp,
                                    label: 'Claimed Coupons',
                                    value: stats?.stats.coupons.claimed || 0,
                                    color: 'from-green-500 to-emerald-500'
                                },
                                {
                                    icon: FiAlertCircle,
                                    label: 'Expired Coupons',
                                    value: stats?.stats.coupons.expired || 0,
                                    color: 'from-red-500 to-orange-500'
                                },
                            ].map((stat, index) => {
                                const Icon = stat.icon;
                                return (
                                    <div key={index} className="glass-card p-6 rounded-xl">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                                                <Icon className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                        <div className="text-3xl font-bold mb-1">{stat.value}</div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                                        {stat.active !== undefined && (
                                            <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                                                {stat.active} active
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Generate Coupons Section */}
                        <div className="glass-card p-6 rounded-xl mb-8">
                            <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
                                <FiGift className="w-6 h-6" />
                                <span>Bulk Generate Coupons</span>
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Select Platform</label>
                                    <select
                                        value={selectedPlatform}
                                        onChange={(e) => setSelectedPlatform(e.target.value)}
                                        className="w-full px-4 py-2 glass-card rounded-lg border border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-primary-500 outline-none"
                                    >
                                        <option value="">Choose a platform...</option>
                                        {stats?.allPlatforms?.map((platform: any) => (
                                            <option key={platform._id} value={platform._id}>
                                                {platform.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Number of Coupons</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="1000"
                                        value={couponCount}
                                        onChange={(e) => setCouponCount(parseInt(e.target.value))}
                                        className="w-full px-4 py-2 glass-card rounded-lg border border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-primary-500 outline-none"
                                    />
                                </div>

                                <div className="flex items-end">
                                    <button
                                        onClick={handleGenerateCoupons}
                                        disabled={generateLoading || !selectedPlatform}
                                        className="w-full px-6 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-lg hover:shadow-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {generateLoading ? 'Generating...' : 'Generate Now'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity & Messages Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Recent Activity */}
                            <div className="glass-card p-6 rounded-xl">
                                <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
                                    <FiActivity className="w-6 h-6" />
                                    <span>Recent Activity</span>
                                </h2>
                                <div className="space-y-3">
                                    {stats?.recentActivity?.slice(0, 5).map((activity: any) => (
                                        <div key={activity._id} className="flex items-start space-x-3 p-3 bg-gray-50/50 dark:bg-dark-800/50 rounded-lg">
                                            <div className="flex-1">
                                                <div className="font-medium capitalize text-sm">
                                                    {activity.type.replace(/_/g, ' ')}
                                                </div>
                                                <div className="text-[10px] text-gray-500 dark:text-gray-400">
                                                    {new Date(activity.createdAt).toLocaleString()}
                                                </div>
                                            </div>
                                            <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${activity.severity === 'high' ? 'bg-red-100 text-red-700' :
                                                activity.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-green-100 text-green-700'
                                                }`}>
                                                {activity.severity}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* User Messages */}
                            <div className="glass-card p-6 rounded-xl">
                                <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
                                    <FiMessageSquare className="w-6 h-6 text-primary-500" />
                                    <span>Recent Inquiries</span>
                                </h2>
                                <div className="space-y-4">
                                    {stats?.recentMessages?.length > 0 ? (
                                        stats.recentMessages.slice(0, 3).map((msg: any) => (
                                            <div key={msg._id} className="p-4 bg-gray-50 dark:bg-dark-800 rounded-lg border-l-4 border-primary-500">
                                                <div className="flex justify-between items-start mb-1">
                                                    <div className="font-bold text-sm">{msg.name}</div>
                                                    <div className="text-[10px] text-gray-400 uppercase">
                                                        {new Date(msg.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                                <p className="text-xs text-gray-600 dark:text-gray-300 italic line-clamp-2">
                                                    "{msg.message}"
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-gray-500 text-sm italic">
                                            No messages yet.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="glass-card p-8 rounded-xl">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold">Platform Management</h2>
                            <button
                                onClick={() => {
                                    setEditingPlatform(null);
                                    setShowAddModal(true);
                                }}
                                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2"
                            >
                                <FiPackage /> Add Platform
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {stats?.allPlatforms?.map((platform: any) => (
                                <div key={platform._id} className="p-4 border border-gray-200 dark:border-gray-800 rounded-xl hover:shadow-md transition-shadow relative group">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl" style={{ backgroundColor: platform.backgroundColor || '#eee' }}>
                                            {platform.logo ? <img src={platform.logo} alt="" className="w-8 h-8 object-contain" /> : platform.name[0]}
                                        </div>
                                        <div>
                                            <div className="font-bold">{platform.name}</div>
                                            <div className="text-xs text-gray-500">{platform.category}</div>
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => {
                                                setEditingPlatform(platform);
                                                setShowAddModal(true);
                                            }}
                                            className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeletePlatform(platform._id)}
                                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Platform Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-dark-900 rounded-2xl w-full max-w-md p-6 shadow-2xl border border-gray-200 dark:border-gray-800">
                        <h3 className="text-xl font-bold mb-4">
                            {editingPlatform ? 'Edit Platform' : 'Add New Platform'}
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Brand Name</label>
                                <input
                                    type="text"
                                    value={platformForm.name}
                                    onChange={(e) => setPlatformForm({ ...platformForm, name: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                                    placeholder="e.g. Amazon"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">URL Slug</label>
                                <input
                                    type="text"
                                    value={platformForm.slug}
                                    onChange={(e) => setPlatformForm({ ...platformForm, slug: e.target.value.toLowerCase().replace(/ /g, '-') })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                                    placeholder="e.g. amazon-india"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Category</label>
                                <select
                                    value={platformForm.category}
                                    onChange={(e) => setPlatformForm({ ...platformForm, category: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-dark-800 outline-none focus:ring-2 focus:ring-primary-500"
                                >
                                    <option value="fashion">Fashion</option>
                                    <option value="ecommerce">Ecommerce</option>
                                    <option value="food">Food</option>
                                    <option value="streaming">Streaming</option>
                                    <option value="travel">Travel</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Brand Color (Hex)</label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        value={platformForm.backgroundColor}
                                        onChange={(e) => setPlatformForm({ ...platformForm, backgroundColor: e.target.value })}
                                        className="h-10 w-10 rounded cursor-pointer border-none"
                                    />
                                    <input
                                        type="text"
                                        value={platformForm.backgroundColor}
                                        onChange={(e) => setPlatformForm({ ...platformForm, backgroundColor: e.target.value })}
                                        className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSavePlatform}
                                className="flex-1 px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:shadow-glow transition-all duration-300"
                            >
                                {editingPlatform ? 'Update' : 'Create'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
