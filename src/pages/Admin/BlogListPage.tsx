import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminApi } from '../../api/adminClient.js';
import GlassCard from '../../components/GlassCard.js';
import Button from '../../components/Button.js';
import Input from '../../components/Input.js';
import { Plus, Edit2, Trash2, Eye, FileText } from 'lucide-react';

const BlogListPage: React.FC = () => {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [newBlog, setNewBlog] = useState({ title: '', slug: '' });
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const res = await adminApi.getBlogsAdmin();
            setBlogs(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await adminApi.createBlog({
                title: newBlog.title,
                slug: newBlog.slug || newBlog.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
                content: '<p>Start writing your blog post here...</p>',
                status: 'draft'
            });
            setShowCreate(false);
            setNewBlog({ title: '', slug: '' });
            navigate(`/admin/blogs/${res.data.id}`);
        } catch (error) {
            alert('Failed to create blog post');
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();
        if (!window.confirm('Are you sure you want to delete this blog post?')) return;
        try {
            await adminApi.deleteBlog(id);
            fetchData();
        } catch (error) {
            alert('Failed to delete blog post');
        }
    };

    if (isLoading) return <div className="p-8 text-center">Loading blogs...</div>;

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary mb-2">Blog Management</h1>
                    <p className="text-text-secondary">Create and manage your platform's articles and news.</p>
                </div>
                <Button onClick={() => setShowCreate(true)} className="flex items-center gap-2">
                    <Plus size={20} />
                    New Post
                </Button>
            </div>

            {showCreate && (
                <GlassCard className="mb-8 p-6">
                    <h2 className="text-xl font-semibold mb-4 text-text-primary">Create New Post</h2>
                    <form onSubmit={handleCreate} className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 w-full text-black">
                            <Input
                                label="Blog Title"
                                placeholder="Enter post title..."
                                value={newBlog.title}
                                onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                                required
                            />
                        </div>
                        <div className="flex-1 w-full text-black">
                            <Input
                                label="Slug (optional)"
                                placeholder="post-url-slug"
                                value={newBlog.slug}
                                onChange={(e) => setNewBlog({ ...newBlog, slug: e.target.value })}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button type="submit">Initialize Post</Button>
                            <Button type="button" variant="glass" onClick={() => setShowCreate(false)}>Cancel</Button>
                        </div>
                    </form>
                </GlassCard>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.length === 0 ? (
                    <div className="col-span-full py-20">
                        <GlassCard className="text-center p-12">
                            <FileText size={48} className="mx-auto mb-4 text-brand-primary opacity-20" />
                            <h3 className="text-xl font-medium text-text-secondary">No blog posts found</h3>
                            <p className="mt-2 text-text-muted">Start by creating your first article above.</p>
                        </GlassCard>
                    </div>
                ) : (
                    blogs.map(blog => (
                        <GlassCard key={blog.id} className="flex flex-col h-full overflow-hidden group">
                            {blog.thumbnail && (
                                <div className="h-40 overflow-hidden">
                                    <img
                                        src={blog.thumbnail}
                                        alt={blog.title}
                                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                    />
                                </div>
                            )}
                            <div className="p-6 flex-1">
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`text-xs px-2 py-1 rounded-full ${blog.status === 'published'
                                        ? 'bg-green-500/20 text-green-400'
                                        : 'bg-yellow-500/20 text-yellow-500'
                                        }`}>
                                        {blog.status.toUpperCase()}
                                    </span>
                                    <span className="text-xs text-text-muted">
                                        {new Date(blog.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-text-primary mb-2 line-clamp-2">{blog.title}</h3>
                                <p className="text-text-muted text-sm mb-4 line-clamp-3">
                                    {blog.excerpt || 'No excerpt provided.'}
                                </p>
                                <div className="flex justify-between items-center mt-auto pt-4 border-t border-white/5">
                                    <span className="text-sm text-text-secondary italic">By {blog.author?.name || 'Admin'}</span>
                                    <div className="flex gap-2">
                                        <Link to={`/blog/${blog.slug}`} target="_blank" rel="noopener noreferrer" title="View Public Post">
                                            <button type="button" className="p-2 hover:bg-white/10 rounded-lg text-green-400 transition-colors">
                                                <Eye size={18} />
                                            </button>
                                        </Link>
                                        <Link to={`/admin/blogs/${blog.id}`} title="Edit Post">
                                            <button type="button" className="p-2 hover:bg-white/10 rounded-lg text-brand-primary transition-colors">
                                                <Edit2 size={18} />
                                            </button>
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={(e) => handleDelete(e, blog.id)}
                                            className="p-2 hover:bg-red-500/20 rounded-lg text-red-500 transition-colors"
                                            title="Delete Post"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </GlassCard>
                    ))
                )}
            </div>
        </div>
    );
};

export default BlogListPage;
