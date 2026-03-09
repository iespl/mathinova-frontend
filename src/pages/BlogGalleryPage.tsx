import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { blogApi } from '../api/blogClient.js';
import GlassCard from '../components/GlassCard.js';
import { Calendar, User, ArrowRight, Tag } from 'lucide-react';

const BlogGalleryPage: React.FC = () => {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await blogApi.getPublishedBlogs();
                setBlogs(res.data);
            } catch (error) {
                console.error('Failed to fetch blogs', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen py-20 px-8 flex items-center justify-center">
                <div className="text-xl text-text-secondary animate-pulse">Curating our latest stories...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-24 md:py-32 px-4 md:px-8 max-w-7xl mx-auto">
            <header className="text-center">
                <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-6">Explore the Mathinova Blog</h1>
                <p className="text-lg md:text-xl text-text-secondary mx-auto" style={{ marginBottom: '43px' }}>
                    Deep dives into engineering mathematics, exam tips, and platform updates to help you excel.
                </p>
            </header>

            {blogs.length === 0 ? (
                <div className="text-center py-20">
                    <GlassCard className="max-w-md mx-auto p-12">
                        <p className="text-text-secondary text-lg">No stories published yet. Check back soon!</p>
                    </GlassCard>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogs.map((blog) => (
                        <Link key={blog.id} to={`/blog/${blog.slug}`} className="group h-full">
                            <GlassCard className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/20 border-white/5 hover:border-primary/30">
                                {blog.thumbnail ? (
                                    <div className="h-48 overflow-hidden relative">
                                        <img
                                            src={blog.thumbnail}
                                            alt={blog.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 to-transparent" />
                                        {blog.category && (
                                            <div className="absolute top-4 left-4">
                                                <span className="bg-primary/90 text-white text-[10px] uppercase tracking-widest px-3 py-1 rounded-full font-bold">
                                                    {blog.category}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="h-48 bg-gradient-to-br from-primary/20 to-brand-primary/20 flex items-center justify-center relative">
                                        <div className="text-primary/40 font-bold opacity-30 text-4xl select-none">MATHINOVA</div>
                                        {blog.category && (
                                            <div className="absolute top-4 left-4">
                                                <span className="bg-primary/90 text-white text-[10px] uppercase tracking-widest px-3 py-1 rounded-full font-bold">
                                                    {blog.category}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-center gap-4 text-xs text-text-muted mb-4">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={14} />
                                            {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString()}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <User size={14} />
                                            {blog.author?.name || 'Innova Team'}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-text-primary mb-3 leading-tight group-hover:text-primary transition-colors line-clamp-2 dark:text-white dark:group-hover:text-primary">
                                        {blog.title}
                                    </h3>

                                    <p className="text-text-secondary text-sm mb-6 line-clamp-3 leading-relaxed">
                                        {blog.excerpt || 'Read this insightful article on Mathinova...'}
                                    </p>

                                    <div className="mt-auto pt-4 border-t border-white/5 flex items-center text-primary text-sm font-semibold group-hover:gap-2 transition-all">
                                        Read Full Article
                                        <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
                                    </div>
                                </div>
                            </GlassCard>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BlogGalleryPage;
