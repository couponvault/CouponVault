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
                url: 'https://couponvault.vercel.app/logo.png' // Adjust URL as needed
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

            <div className="max-w-3xl mx-auto px-4">
                <Link 
                    href="/blog"
                    className="inline-flex items-center text-appleMuted hover:text-appleBlue mb-8 transition-colors font-medium"
                >
                    <FiArrowLeft className="mr-2" />
                    Back to all articles
                </Link>

                <article className="bg-white rounded-3xl overflow-hidden shadow-sm border border-appleBorder">
                    <div className="w-full h-64 md:h-96 relative">
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
                                <FiUser className="mr-2" />
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
        </main>
    );
}
