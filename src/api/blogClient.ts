import api from './client.js';

export const blogApi = {
    /**
     * Get all published blog posts.
     */
    getPublishedBlogs: () => api.get('/blogs'),

    /**
     * Get a single blog post by its slug.
     */
    getBlogBySlug: (slug: string) => api.get(`/blogs/${slug}`),
};
