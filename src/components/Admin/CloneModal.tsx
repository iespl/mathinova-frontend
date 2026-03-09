import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, ChevronRight, Loader2 } from 'lucide-react';
import { adminApi } from '../../api/adminClient.js';
import Button from '../Button.js';
import GlassCard from '../GlassCard.js';

interface CloneModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'module' | 'lesson';
    sourceId: string;
    sourceTitle: string;
    onSuccess: () => void;
}

const CloneModal: React.FC<CloneModalProps> = ({ isOpen, onClose, type, sourceId, sourceTitle, onSuccess }) => {
    const [courses, setCourses] = useState<any[]>([]);
    const [modules, setModules] = useState<any[]>([]);
    const [selectedCourseId, setSelectedCourseId] = useState<string>('');
    const [selectedModuleId, setSelectedModuleId] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [isclining, setIsCloning] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchCourses();
        } else {
            // Reset state
            setSelectedCourseId('');
            setSelectedModuleId('');
            setModules([]);
        }
    }, [isOpen]);

    const fetchCourses = async () => {
        setIsLoading(true);
        try {
            const { data } = await adminApi.getCourses();
            setCourses(data);
        } catch (error) {
            console.error('Failed to fetch courses', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCourseChange = async (courseId: string) => {
        setSelectedCourseId(courseId);
        setSelectedModuleId('');
        if (type === 'lesson' && courseId) {
            setIsLoading(true);
            try {
                const { data } = await adminApi.getCourse(courseId);
                setModules(data.modules || []);
            } catch (error) {
                console.error('Failed to fetch modules', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleClone = async () => {
        if (!selectedCourseId) return;
        if (type === 'lesson' && !selectedModuleId) return;

        setIsCloning(true);
        try {
            if (type === 'module') {
                await adminApi.cloneModule(sourceId, selectedCourseId);
            } else {
                await adminApi.cloneLesson(sourceId, selectedModuleId);
            }
            onSuccess();
            onClose();
        } catch (error: any) {
            alert(`Cloning failed: ${error.message}`);
        } finally {
            setIsCloning(false);
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="w-full max-w-md"
                >
                    <GlassCard className="!bg-white border-gray-200 overflow-hidden shadow-2xl">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-500/20 rounded-lg">
                                    <Copy className="text-purple-400" size={20} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Deep Clone {type === 'module' ? 'Module' : 'Lesson'}</h3>
                                    <p className="text-xs text-gray-600 truncate max-w-[200px]">{sourceTitle}</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X size={20} className="text-gray-400 hover:text-white" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Target Course</label>
                                    <select
                                        value={selectedCourseId}
                                        onChange={(e) => handleCourseChange(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all appearance-none cursor-pointer"
                                        disabled={isLoading || isclining}
                                    >
                                        <option value="">-- Click to select course --</option>
                                        {courses.map(course => (
                                            <option key={course.id} value={course.id}>
                                                {course.title} ({course.courseCode})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {type === 'lesson' && selectedCourseId && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Target Module</label>
                                        <select
                                            value={selectedModuleId}
                                            onChange={(e) => setSelectedModuleId(e.target.value)}
                                            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all appearance-none cursor-pointer"
                                            disabled={isLoading || isclining}
                                        >
                                            <option value="">-- Select target module --</option>
                                            {modules.map(mod => (
                                                <option key={mod.id} value={mod.id}>
                                                    {mod.title}
                                                </option>
                                            ))}
                                        </select>
                                    </motion.div>
                                )}

                                {isLoading && (
                                    <div className="flex justify-center items-center py-4">
                                        <Loader2 className="animate-spin text-purple-400" size={24} />
                                    </div>
                                )}
                            </div>

                            <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                                <p className="text-xs text-purple-300 leading-relaxed">
                                    <span className="font-bold flex items-center gap-1 mb-1 italic uppercase">Deep Clone Verified:</span>
                                    This will create a completely independent copy of all nested videos, quizzes, and resources. Student progress will start fresh on the cloned item.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3 p-6 bg-gray-50 border-t border-gray-100">
                            <Button
                                className="flex-1 font-bold tracking-wide"
                                variant="primary"
                                onClick={handleClone}
                                disabled={!selectedCourseId || (type === 'lesson' && !selectedModuleId) || isclining}
                            >
                                {isclining ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="animate-spin" size={18} /> Cloning...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Confirm Deep Clone <ChevronRight size={18} />
                                    </span>
                                )}
                            </Button>
                            <Button
                                variant="glass"
                                onClick={onClose}
                                disabled={isclining}
                                className="font-semibold"
                            >
                                Cancel
                            </Button>
                        </div>
                    </GlassCard>
                </motion.div>
            </div>
        </AnimatePresence>,
        document.body
    );
};

export default CloneModal;
