import { blogPosts } from '@/data/blogPosts';
import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
    title: 'Shopping Guides & Tips | CouponVault Blog',
    description: 'Expert shopping guides, saving hacks, and retail secrets from the CouponVault Editorial Team.',
};

export default function BlogIndex() {
    return (
        <main className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-6xl mx-auto px-4">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-appleText mb-4" style={{ fontFamily: 'Outfit' }}>
                        Shopping Guides & Secrets
                    </h1>
                    <p className="text-lg text-appleMuted max-w-2xl mx-auto">
                        Expert advice, money-saving hacks, and inside strategies from the CouponVault Editorial Team.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogPosts.map((post) => (
                        <Link 
                            key={post.id} 
                            href={`/blog/${post.slug}`}
                            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-appleBorder group flex flex-col"
                        >
                            <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                                {/* Use a standard img tag here to avoid needing domain config in next.config.js for unsplash */}
                                <img 
                                    src={post.image} 
                                    alt={post.title}
                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                <div className="flex items-center text-xs text-appleMuted mb-3 space-x-2">
                                    <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    <span>•</span>
                                    <span>{post.readTime}</span>
                                </div>
                                <h2 className="text-xl font-bold text-appleText mb-3 leading-snug group-hover:text-appleBlue transition-colors">
                                    {post.title}
                                </h2>
                                <p className="text-appleMuted text-sm mb-4 line-clamp-3">
                                    {post.excerpt}
                                </p>
                                <div className="mt-auto flex items-center">
                                    <div className="w-6 h-6 rounded-full bg-appleBlue/10 flex items-center justify-center mr-2">
                                        <span className="text-appleBlue text-xs font-bold">{post.author.charAt(0)}</span>
                                    </div>
                                    <span className="text-sm font-medium text-appleText">{post.author}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}
