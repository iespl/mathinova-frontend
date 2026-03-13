import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogApi } from '../api/blogClient.js';
import GlassCard from '../components/GlassCard.js';
import { Calendar, User, ArrowLeft, Share2, MessageCircle, Play } from 'lucide-react';
import VideoPlayer from '../components/VideoPlayer.js';
import RichTextDisplay from '../components/RichTextDisplay.js';

const BlogPostDisplay: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [blog, setBlog] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            if (!slug) return;
            try {
                const res = await blogApi.getBlogBySlug(slug);
                setBlog(res.data);
                // Update page title
                if (res.data.title) {
                    document.title = `${res.data.title} | Mathinova Blog`;
                }
            } catch (error) {
                console.error('Failed to fetch blog post', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPost();

        return () => {
            document.title = 'Mathinova - Premium Learning Platform';
        };
    }, [slug]);

    if (isLoading) {
        return (
            <div className="min-h-screen py-20 px-8 flex items-center justify-center">
                <div className="text-xl text-text-secondary animate-pulse">Loading story...</div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="min-h-screen py-20 px-4 flex items-center justify-center">
                <GlassCard className="max-w-md w-full p-12 text-center">
                    <h2 className="text-2xl font-bold text-text-primary mb-4">Post Not Found</h2>
                    <p className="text-text-secondary mb-8">The story you're looking for might have been moved or unpublished.</p>
                    <Link to="/blog">
                        <button className="bg-primary text-white px-6 py-2 rounded-lg font-bold">Back to Blog</button>
                    </Link>
                </GlassCard>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-24 md:py-32 overflow-x-hidden w-full max-w-full">
            <article className="w-full">
                <div className="container">
                    <Link to="/blog" className="inline-flex items-center gap-2 text-text-secondary hover:text-brand-primary transition-colors mb-8 group">
                        <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-1" />
                        Back to all stories
                    </Link>

                    {blog.videoUrl ? (
                        <div className="rounded-3xl overflow-hidden mb-16 shadow-2xl border border-white/10 aspect-video bg-black w-full">
                            <VideoPlayer src={blog.videoUrl} poster={blog.thumbnail || undefined} />
                        </div>
                    ) : blog.thumbnail ? (
                        <div className="rounded-3xl overflow-hidden mb-16 shadow-2xl border border-white/10 aspect-video w-full">
                            <img src={blog.thumbnail} alt={blog.title} className="w-full h-full object-cover" />
                        </div>
                    ) : null}
                </div>

                <div className="container">
                    <header className="mb-16 flex flex-col gap-4">
                        {blog.category && (
                            <span className="inline-block bg-brand-primary/10 text-brand-primary text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest border border-brand-primary/20 w-fit">
                                {blog.category}
                            </span>
                        )}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-6 leading-tight dark:text-white">
                            {blog.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 text-text-secondary border-b border-white/5 pb-8 w-full">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary border border-brand-primary/20 shadow-inner">
                                    <User size={20} />
                                </div>
                                <div className="text-left">
                                    <p className="text-xs text-text-muted font-medium">Written by</p>
                                    <p className="font-bold text-text-primary text-sm">{blog.author?.name || 'Innova Team'}</p>
                                </div>
                            </div>
                            <div className="h-10 w-px bg-border-glass hidden md:block" />
                            <div className="flex items-center gap-2 text-sm font-medium">
                                <Calendar size={18} className="text-brand-primary" />
                                {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>
                        </div>
                    </header>

                    <RichTextDisplay
                        htmlContent={blog.content}
                        className="blog-content w-full max-w-full overflow-hidden break-words text-text-secondary leading-loose space-y-8"
                    />

                    {blog.tags && blog.tags.length > 0 && (
                        <div className="mt-16 pt-8 border-t border-white/5">
                            <div className="flex flex-wrap gap-2">
                                {blog.tags.map((tag: string) => (
                                    <span key={tag} className="text-xs font-medium bg-white/5 hover:bg-white/10 text-brand-primary px-4 py-1.5 rounded-full border border-white/10 transition-colors cursor-default shadow-sm">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <footer className="mt-16 pb-12">
                        <GlassCard className="p-8 bg-brand-primary/5 border-brand-primary/20 shadow-sm">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                                <div>
                                    <h4 className="text-xl font-bold text-text-primary mb-2">Share this story</h4>
                                    <p className="text-text-secondary text-sm">Found this helpful? Pass it on to your friends and colleagues.</p>
                                </div>
                                <div className="flex gap-4">
                                    <button className="p-3 bg-bg-card rounded-full hover:bg-brand-primary/10 text-brand-primary transition-all border border-border-glass shadow-sm hover:shadow-md" title="Copy Link">
                                        <Share2 size={24} />
                                    </button>
                                </div>
                            </div>
                        </GlassCard>
                    </footer>
                </div>
            </article>

            <style>{`
                .blog-content {
                    overflow-wrap: break-word; /* Soft wrap on boundaries */
                }
                .blog-content h1, .blog-content h2, .blog-content h3 {
                    color: var(--text-primary);
                    font-weight: 700;
                    margin-top: 2rem;
                    margin-bottom: 1rem;
                }
                .blog-content h1 { font-size: 2.125rem; }
                .blog-content h2 { font-size: 1.75rem; }
                .blog-content h3 { font-size: 1.375rem; }
                .blog-content p, .blog-content li { 
                    font-size: 1rem; 
                    color: var(--text-secondary); 
                }
                .blog-content ul, .blog-content ol {
                    padding-left: 1.5rem;
                    margin-bottom: 1.5rem;
                }
                .blog-content ul { list-style-type: disc; }
                .blog-content ol { list-style-type: decimal; }
                .blog-content li { margin-bottom: 0.5rem; }
                .blog-content blockquote {
                    border-left: 4px solid var(--brand-primary);
                    padding-left: 1.5rem;
                    font-style: italic;
                    color: var(--text-muted);
                    margin: 2rem 0;
                }
                .blog-content img {
                    border-radius: 1rem;
                    margin: 2rem auto;
                    display: block;
                    max-width: 100%;
                }
                /* Formula styling from Quill */
                .ql-formula {
                    font-family: serif;
                    padding: 2px 4px;
                    display: inline-block;
                    max-width: 100%;
                    white-space: normal; /* Allow formula internals to wrap */
                    word-wrap: normal;
                }
            `}</style>
        </div>
    );
};

export default BlogPostDisplay;
