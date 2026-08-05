import { blogPosts } from '@/data/blogPosts';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FiArrowLeft, FiClock, FiUser, FiCalendar } from 'react-icons/fi';
import NativeAd from '@/components/ui/NativeAd';

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
        <main className="min-h-screen bg-appleBg py-16">
            {/* Inject JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link 
                    href="/blog"
                    className="inline-flex items-center text-appleMuted hover:text-appleBlue mb-8 transition-colors font-medium"
                >
                    <FiArrowLeft className="mr-2 w-5 h-5" />
                    Back to all guides
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-8">
                        <article className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-appleBorder/60">
                            <div className="w-full h-64 md:h-[450px] relative bg-appleCard">
                                <Image 
                                    src={post.image} 
                                    alt={post.title}
                                    fill
                                    priority
                                    sizes="(max-width: 768px) 100vw, 66vw"
                                    className="object-cover"
                                />
                            </div>
                            
                            <div className="p-8 md:p-12 lg:p-16">
                                <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-appleText mb-8 leading-tight font-display tracking-tight">
                                    {post.title}
                                </h1>

                                <div className="flex flex-wrap items-center gap-6 text-sm text-appleMuted mb-12 pb-8 border-b border-appleBorder/50">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mr-4">
                                            <span className="text-appleBlue font-extrabold">{post.author.charAt(0)}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-appleMuted">Written by</span>
                                            <span className="font-bold text-appleText">{post.author}</span>
                                        </div>
                                    </div>
                                    <div className="w-px h-8 bg-appleBorder/50 hidden sm:block"></div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-appleMuted">Published</span>
                                        <span suppressHydrationWarning className="font-semibold text-appleText flex items-center"><FiCalendar className="mr-2 text-appleBlue" /> {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                    </div>
                                    <div className="w-px h-8 bg-appleBorder/50 hidden sm:block"></div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-appleMuted">Read Time</span>
                                        <span className="font-semibold text-appleText flex items-center"><FiClock className="mr-2 text-appleBlue" /> {post.readTime}</span>
                                    </div>
                                </div>

                                {/* Article Content */}
                                <div 
                                    className="prose prose-lg md:prose-xl max-w-none prose-headings:font-extrabold prose-headings:text-appleText prose-headings:font-display prose-p:text-appleMuted prose-p:leading-relaxed prose-a:text-appleBlue hover:prose-a:text-blue-700 prose-img:rounded-2xl"
                                    dangerouslySetInnerHTML={{ __html: post.content }}
                                />
                            </div>
                        </article>
                    </div>

                    {/* Sidebar */}
                    <aside className="lg:col-span-4">
                        <div className="sticky top-28">
                            <h3 className="text-2xl font-extrabold text-appleText mb-6 font-display tracking-tight">More Shopping Guides</h3>
                            <div className="space-y-5">
                                {blogPosts.filter(p => p.id !== post.id).slice(0, 4).map((relatedPost) => (
                                    <Link 
                                        key={relatedPost.id} 
                                        href={`/blog/${relatedPost.slug}`}
                                        className="group block bg-white p-3 rounded-2xl border border-appleBorder/50 hover:border-appleBlue/30 hover:shadow-premium-hover transition-all duration-300"
                                    >
                                        <div className="flex space-x-4">
                                            <div className="relative w-24 h-24 flex-shrink-0 rounded-[1rem] overflow-hidden bg-appleCard">
                                                <Image 
                                                    src={relatedPost.image} 
                                                    alt={relatedPost.title}
                                                    fill
                                                    sizes="96px"
                                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                            <div className="flex flex-col justify-center py-1 pr-2">
                                                <h4 className="font-bold text-appleText leading-snug group-hover:text-appleBlue transition-colors line-clamp-2 mb-2">
                                                    {relatedPost.title}
                                                </h4>
                                                <span suppressHydrationWarning className="text-[11px] font-semibold uppercase tracking-wider text-appleMuted">{new Date(relatedPost.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                            
                            <div className="mt-10 p-6 bg-blue-50 rounded-2xl border border-blue-100 mb-8">
                                <h3 className="font-bold text-appleText mb-2">Want more savings?</h3>
                                <p className="text-sm text-gray-600 mb-4">Browse our database of over 10,000 verified discount codes for top retailers.</p>
                                <Link href="/platforms" className="block w-full py-3 bg-appleBlue text-white text-center rounded-xl font-medium hover:bg-blue-600 transition-colors">
                                    Browse Stores
                                </Link>
                            </div>

                            <NativeAd />
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}
