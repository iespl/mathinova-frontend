import api from './client.js';

export const adminApi = {
    // Orders (Existing)
    getOrders: () => api.get('/admin/orders'),
    refundPayment: (paymentId: string, reason: string) => api.post(`/admin/refunds/${paymentId}`, { reason }),

    // Users
    getUsers: () => api.get('/admin/users'),
    toggleUserStatus: (id: string, isActive: boolean) => api.patch(`/admin/users/${id}/status`, { isActive }),

    // Courses
    getCourses: () => api.get('/admin/courses'),
    getCourse: (id: string) => api.get(`/admin/courses/${id}`),
    createCourse: (data: any) => api.post('/admin/courses', data),
    updateCourse: (id: string, data: any) => api.put(`/admin/courses/${id}`, data),
    deleteCourse: (id: string) => api.delete(`/admin/courses/${id}`),

    // Content
    addModule: (courseId: string, data: { title: string, order: number }) => api.post(`/admin/courses/${courseId}/modules`, data),
    updateModule: (moduleId: string, data: { title?: string, order?: number }) => api.patch(`/admin/modules/${moduleId}`, data),
    deleteModule: (moduleId: string) => api.delete(`/admin/modules/${moduleId}`),
    addLesson: (moduleId: string, data: { title: string, order: number }) => api.post(`/admin/modules/${moduleId}/lessons`, data),
    deleteLesson: (lessonId: string) => api.delete(`/admin/lessons/${lessonId}`),
    updateLesson: (lessonId: string, data: { title?: string, order?: number, moduleId?: string }) => api.patch(`/admin/lessons/${lessonId}`, data),
    updateLessonContent: (lessonId: string, data: { videos?: any[], pyqs?: any[], quiz?: any }) => api.put(`/admin/lessons/${lessonId}/content`, data),

    // Reordering
    reorderModules: (moduleIdOrders: { id: string, order: number }[]) => api.patch('/admin/reorder/modules', { moduleIdOrders }),
    reorderLessons: (lessonIdOrders: { id: string, moduleId: string, order: number }[]) => api.patch('/admin/reorder/lessons', { lessonIdOrders }),
    reorderVideos: (videoIdOrders: { id: string, lessonId: string, order: number }[]) => api.patch('/admin/reorder/videos', { videoIdOrders }),
    reorderPYQs: (pyqIdOrders: { id: string, lessonId: string, order: number }[]) => api.patch('/admin/reorder/pyqs', { pyqIdOrders }),
    reorderQuizQuestions: (questionIdOrders: { id: string, quizId: string, order: number }[]) => api.patch('/admin/reorder/quiz-questions', { questionIdOrders }),

    // Branches
    getBranches: () => api.get('/admin/branches'),
    createBranch: (name: string) => api.post('/admin/branches', { name }),
    updateBranch: (id: string, name: string) => api.put(`/admin/branches/${id}`, { name }),
    deleteBranch: (id: string) => api.delete(`/admin/branches/${id}`),

    // Blogs
    getBlogsAdmin: () => api.get('/blogs/admin/all'),
    createBlog: (data: any) => api.post('/blogs/admin', data),
    updateBlog: (id: string, data: any) => api.put(`/blogs/admin/${id}`, data),
    deleteBlog: (id: string) => api.delete(`/blogs/admin/${id}`),
};
