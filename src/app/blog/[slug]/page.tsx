import { blogPosts } from '@/data/blogPosts';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft, FiClock, FiUser, FiCalendar } from 'react-icons/fi';

export function generateStaticParams() {
    return blogPosts.map((post) => ({
        slug: post.slug,
    }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
    const post = blogPosts.find((p) => p.slug === params.slug);
    if (!post) return { title: 'Post Not Found' };
    
    return {
        title: `${post.title} | CouponVault Blog`,
        description: post.excerpt,
    };
}

export default function BlogPost({ params }: { params: { slug: string } }) {
    const post = blogPosts.find((p) => p.slug === params.slug);

    if (!post) {
        notFound();
    }

    // Generate JSON-LD for the article
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: post.excerpt,
        image: post.image,
        author: {
            '@type': 'Person',
            name: post.author,
        },
        publisher: {
            '@type': 'Organization',
            name: 'CouponVault',
            logo: {
                '@type': 'ImageObject',
                url: 'https://couponvault.in/logo.png' 
            }
        },
        datePublished: post.date,
        dateModified: post.date,
    };

    return (
        <main className="min-h-screen bg-gray-50 py-12">
            {/* Inject JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="max-w-6xl mx-auto px-4">
                <Link 
                    href="/blog"
                    className="inline-flex items-center text-appleMuted hover:text-appleBlue mb-8 transition-colors font-medium"
                >
                    <FiArrowLeft className="mr-2" />
                    Back to all articles
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <article className="bg-white rounded-3xl overflow-hidden shadow-sm border border-appleBorder">
                            <div className="w-full h-64 md:h-[400px] relative">
                                <img 
                                    src={post.image} 
                                    alt={post.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            
                            <div className="p-8 md:p-12">
                                <h1 className="text-3xl md:text-5xl font-bold text-appleText mb-6 leading-tight" style={{ fontFamily: 'Outfit' }}>
                                    {post.title}
                                </h1>

                                <div className="flex flex-wrap items-center gap-4 text-sm text-appleMuted mb-10 pb-8 border-b border-appleBorder">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 rounded-full bg-appleBlue/10 flex items-center justify-center mr-3">
                                            <FiUser className="text-appleBlue" />
                                        </div>
                                        <span className="font-medium text-appleText">{post.author}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <FiCalendar className="mr-2" />
                                        <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <FiClock className="mr-2" />
                                        <span>{post.readTime}</span>
                                    </div>
                                </div>

                                {/* Article Content */}
                                <div 
                                    className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-appleText prose-p:text-gray-700 prose-a:text-appleBlue hover:prose-a:text-blue-700"
                                    dangerouslySetInnerHTML={{ __html: post.content }}
                                />
                            </div>
                        </article>
                    </div>

                    {/* Sidebar */}
                    <aside className="lg:col-span-1">
                        <div className="sticky top-24">
                            <h3 className="text-xl font-bold text-appleText mb-6 font-display">More Shopping Guides</h3>
                            <div className="space-y-6">
                                {blogPosts.filter(p => p.id !== post.id).slice(0, 4).map((relatedPost) => (
                                    <Link 
                                        key={relatedPost.id} 
                                        href={`/blog/${relatedPost.slug}`}
                                        className="group block"
                                    >
                                        <div className="flex space-x-4">
                                            <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                                                <img 
                                                    src={relatedPost.image} 
                                                    alt={relatedPost.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-appleText leading-tight group-hover:text-appleBlue transition-colors line-clamp-2 mb-2">
                                                    {relatedPost.title}
                                                </h4>
                                                <span className="text-xs text-appleMuted">{new Date(relatedPost.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                            
                            <div className="mt-10 p-6 bg-blue-50 rounded-2xl border border-blue-100">
                                <h3 className="font-bold text-appleText mb-2">Want more savings?</h3>
                                <p className="text-sm text-gray-600 mb-4">Browse our database of over 10,000 verified discount codes for top retailers.</p>
                                <Link href="/platforms" className="block w-full py-3 bg-appleBlue text-white text-center rounded-xl font-medium hover:bg-blue-600 transition-colors">
                                    Browse Stores
                                </Link>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}
