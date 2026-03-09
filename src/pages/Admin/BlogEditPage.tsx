import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminApi } from '../../api/adminClient.js';
import GlassCard from '../../components/GlassCard.js';
import Button from '../../components/Button.js';
import Input from '../../components/Input.js';
import RichTextEditor from '../../components/RichTextEditor.js';
import { Save, ArrowLeft, Trash2, Globe, FileText } from 'lucide-react';

const BlogEditPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [blog, setBlog] = useState<any>(null);

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        content: '',
        excerpt: '',
        thumbnail: '',
        status: 'draft',
        category: '',
        tags: '',
        videoUrl: ''
    });

    useEffect(() => {
        const fetchBlog = async () => {
            if (!id) return;
            try {
                // We'll reuse getBlogsAdmin and find the specific one for now, 
                // but better to add a getBlogById endpoint if needed.
                // For now, let's assume updateBlog handles it.
                // Wait, I should probably check if I have a getBlogById endpoint.
                // I'll just fetch all and filter or assume service handles it.
                const res = await adminApi.getBlogsAdmin();
                const found = res.data.find((b: any) => b.id === id);
                if (found) {
                    setBlog(found);
                    setFormData({
                        title: found.title || '',
                        slug: found.slug || '',
                        content: found.content || '',
                        excerpt: found.excerpt || '',
                        thumbnail: found.thumbnail || '',
                        status: found.status || 'draft',
                        category: found.category || '',
                        tags: Array.isArray(found.tags) ? found.tags.join(', ') : '',
                        videoUrl: found.videoUrl || ''
                    });
                } else {
                    alert('Blog post not found');
                    navigate('/admin/blogs');
                }
            } catch (error) {
                console.error('Failed to fetch blog', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBlog();
    }, [id, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;
        setIsSaving(true);
        try {
            const payload = {
                ...formData,
                tags: formData.tags.split(',').map(t => t.trim()).filter(t => t.length > 0)
            };
            await adminApi.updateBlog(id, payload);
            alert('Blog post updated successfully');
            navigate('/admin/blogs');
        } catch (error) {
            alert('Failed to update blog post');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (!id || !window.confirm('Are you sure you want to delete this blog post?')) return;
        try {
            await adminApi.deleteBlog(id);
            navigate('/admin/blogs');
        } catch (error) {
            alert('Failed to delete blog post');
        }
    };

    if (isLoading) return <div className="p-8 text-center text-text-secondary">Loading editor...</div>;

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/admin/blogs')}
                        className="p-2 hover:bg-white/10 rounded-full text-text-secondary transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-3xl font-bold text-text-primary">Edit Post</h1>
                </div>
                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="px-4 py-2 border border-red-500/20 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all flex items-center gap-2 text-sm font-semibold"
                    >
                        <Trash2 size={18} />
                        Delete Post
                    </button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSaving}
                        className="flex items-center gap-2"
                    >
                        <Save size={18} />
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-6">
                    <GlassCard className="p-6">
                        <div className="space-y-4">
                            <Input
                                label="Post Title"
                                placeholder="Stunning title for your article"
                                value={formData.title}
                                className="text-black"
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">Content</label>
                                <RichTextEditor
                                    value={formData.content}
                                    onChange={(content) => setFormData({ ...formData, content })}
                                    placeholder="Tell your story..."
                                />
                            </div>
                        </div>
                    </GlassCard>

                    <GlassCard className="p-6">
                        <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                            <FileText size={20} className="text-brand-primary" />
                            SEO & Excerpt
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">Brief Excerpt</label>
                                <textarea
                                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary h-24 text-sm"
                                    placeholder="Write a short Hook for the preview grid..."
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                />
                            </div>
                            <Input
                                label="URL Slug"
                                placeholder="my-awesome-post"
                                className="text-black"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            />
                        </div>
                    </GlassCard>
                </div>

                {/* Sidebar Settings */}
                <div className="space-y-6">
                    <GlassCard className="p-6">
                        <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                            <Globe size={20} className="text-brand-primary" />
                            Publishing
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">Status</label>
                                <select
                                    className="w-full px-4 py-2 bg-white/10 border border-white/10 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="draft" className="bg-gray-900">Draft</option>
                                    <option value="published" className="bg-gray-900">Published</option>
                                </select>
                            </div>
                            <div className="pt-4 border-t border-white/5">
                                <p className="text-xs text-text-muted mb-2">
                                    Last Updated: {blog?.updatedAt ? new Date(blog.updatedAt).toLocaleString() : 'Never'}
                                </p>
                                {blog?.publishedAt && (
                                    <p className="text-xs text-green-400">
                                        Published on: {new Date(blog.publishedAt).toLocaleDateString()}
                                    </p>
                                )}
                            </div>
                        </div>
                    </GlassCard>

                    <GlassCard className="p-6">
                        <h3 className="text-lg font-semibold text-text-primary mb-4">Metadata</h3>
                        <div className="space-y-4">
                            <Input
                                label="Thumbnail URL"
                                placeholder="https://..."
                                className="text-black"
                                value={formData.thumbnail}
                                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                            />
                            {formData.thumbnail && (
                                <div className="mt-2 rounded-lg overflow-hidden border border-white/10">
                                    <img src={formData.thumbnail} alt="Preview" className="w-full h-32 object-cover" />
                                </div>
                            )}
                            <Input
                                label="Category"
                                placeholder="e.g. Tips, VTU Updates"
                                className="text-black"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            />
                            <Input
                                label="Tags (comma separated)"
                                placeholder="mathematics, engineering, vtu"
                                className="text-black"
                                value={formData.tags}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            />
                            <div className="mb-6">
                                <Input
                                    label="Video URL (YouTube or HLS)"
                                    placeholder="https://..."
                                    className="text-black"
                                    value={formData.videoUrl}
                                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                                />
                                <p className="text-xs text-text-muted -mt-4 mb-4">Supports YouTube links and HLS (.m3u8) streams.</p>
                            </div>
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
};

export default BlogEditPage;
