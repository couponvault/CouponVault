import { blogPosts } from '@/data/blogPosts';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

export const metadata = {
    title: 'Shopping Guides & Tips | CouponVault Blog',
    description: 'Expert shopping guides, saving hacks, and retail secrets from the CouponVault Editorial Team.',
};

export default function BlogIndex() {
    return (
        <main className="min-h-screen bg-appleBg py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link 
                    href="/"
                    className="inline-flex items-center text-appleMuted hover:text-appleBlue mb-8 transition-colors font-medium"
                >
                    <FiArrowLeft className="mr-2 w-5 h-5" />
                    Back to Home
                </Link>

                <div className="mb-16 text-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-appleText mb-6 font-display tracking-tight">
                        Shopping Guides & <span className="gradient-text">Secrets</span>
                    </h1>
                    <p className="text-lg md:text-xl text-appleMuted max-w-2xl mx-auto leading-relaxed">
                        Expert advice, money-saving hacks, and inside strategies from the CouponVault Editorial Team.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                    {blogPosts.map((post) => (
                        <Link 
                            key={post.id} 
                            href={`/blog/${post.slug}`}
                            className="group flex flex-col bg-white rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-premium-hover transition-all duration-300 border border-appleBorder/60 hover:-translate-y-2 isolate"
                        >
                            <div className="relative h-56 w-full overflow-hidden bg-appleCard shrink-0">
                                <img 
                                    src={post.image} 
                                    alt={post.title}
                                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 ease-in-out"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                            <div className="p-6 md:p-8 flex flex-col flex-grow">
                                <div className="flex items-center text-xs font-bold uppercase tracking-wider text-appleBlue mb-4 space-x-2">
                                    <span suppressHydrationWarning>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    <span>•</span>
                                    <span>{post.readTime}</span>
                                </div>
                                <h2 className="text-xl md:text-2xl font-extrabold text-appleText mb-3 leading-snug group-hover:text-appleBlue transition-colors line-clamp-2">
                                    {post.title}
                                </h2>
                                <p className="text-appleMuted text-base mb-6 line-clamp-3 leading-relaxed">
                                    {post.excerpt}
                                </p>
                                <div className="mt-auto flex items-center pt-5 border-t border-appleBorder/50">
                                    <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mr-3 shrink-0">
                                        <span className="text-appleBlue text-xs font-extrabold">{post.author.charAt(0)}</span>
                                    </div>
                                    <span className="text-sm font-semibold text-appleText">{post.author}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}
