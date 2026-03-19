import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, Loader2, Copy } from 'lucide-react';
import Button from '../Button.js';
import DragHandle from './DragHandle.js';
import { adminApi } from '../../api/adminClient.js';

import EditIcon from '../../assets/edit.svg';
import TrashIcon from '../../assets/trash.svg';

import MinimalSortableItem from './MinimalSortableItem.js';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

interface SortableLessonProps {
    lesson: any;
    onEdit: (lesson: any) => void;
    onDelete: (lessonId: string) => void;
    onClone: (lessonId: string, title: string) => void;
    onDataLoaded?: (lessonId: string, data: { videos: any[], pyqs: any[] }) => void;
}

const SortableLesson: React.FC<SortableLessonProps> = ({ lesson, onEdit, onDelete, onClone, onDataLoaded }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: lesson.id,
        data: {
            type: 'lesson'
        }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 10 : 1
    };

    // Use _count from optimized backend, fallback to array length if available
    const videoCount = lesson._count?.videos ?? lesson.videos?.length ?? 0;
    const pyqCount = lesson._count?.pyqs ?? lesson.pyqs?.length ?? 0;
    const hasContent = videoCount > 0 || pyqCount > 0;

    const handleToggleExpand = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!hasContent) return;

        const nextExpanded = !isExpanded;
        setIsExpanded(nextExpanded);

        // Fetch details if expanding and data is missing
        const hasData = lesson.videos?.length > 0 || lesson.pyqs?.length > 0;
        if (nextExpanded && !hasData) {
            setIsLoading(true);
            try {
                const { data } = await adminApi.getLessonDetails(lesson.id);
                if (onDataLoaded) {
                    onDataLoaded(lesson.id, {
                        videos: data.videos || [],
                        pyqs: data.pyqs || []
                    });
                }
            } catch (error) {
                console.error('Failed to load lesson details', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const displayVideos = lesson.videos || [];
    const displayPyqs = lesson.pyqs || [];

    return (
        <div id={`lesson-${lesson.id}`} ref={setNodeRef} style={style} className="p-3 bg-black/20 rounded border border-white/5 shadow-sm group">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <DragHandle attributes={attributes} listeners={listeners} />
                    <button
                        type="button"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={handleToggleExpand}
                        className={`p-1 hover:bg-white/5 rounded transition-colors cursor-pointer ${!hasContent && 'opacity-20 cursor-default'}`}
                        disabled={!hasContent}
                    >
                        {isLoading ? (
                            <Loader2 size={16} className="animate-spin text-blue-400" />
                        ) : (
                            isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />
                        )}
                    </button>
                    <div>
                        <div className="font-medium flex items-center gap-2">
                            <span className="text-gray-400 text-xs font-mono">L{lesson.order}</span>
                            {lesson.title}
                        </div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">
                            {videoCount} videos • {pyqCount} PYQs
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button size="sm" variant="glass" onPointerDown={(e) => e.stopPropagation()} onClick={(e: React.MouseEvent) => { e.stopPropagation(); onEdit(lesson); }} className="cursor-pointer">
                        <img src={EditIcon} alt="Edit" style={{ width: '14px', height: '14px', marginRight: '6px', opacity: 0.7 }} /> Content
                    </Button>
                    <button
                        type="button"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => { e.stopPropagation(); onClone(lesson.id, lesson.title); }}
                        className="p-2 hover:bg-white/10 rounded transition-colors cursor-pointer text-white/50 hover:text-white"
                        title="Clone Lesson"
                    >
                        <Copy size={16} />
                    </button>
                    <button
                        type="button"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => { e.stopPropagation(); onDelete(lesson.id); }}
                        className="p-2 hover:bg-white/5 rounded transition-colors cursor-pointer group/trash"
                        title="Delete Lesson"
                    >
                        <img src={TrashIcon} alt="Delete" style={{ width: '16px', height: '16px', opacity: 0.5 }} className="group-hover/trash:opacity-100 transition-opacity" />
                    </button>
                </div>
            </div>

            <AnimatePresence initial={false}>
                {isExpanded && hasContent && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="mt-3 pl-8 border-l-2 border-white/10 space-y-3 pt-1">
                            {isLoading && (
                                <div className="text-[10px] text-gray-600 animate-pulse">Loading content...</div>
                            )}

                            {displayVideos.length > 0 && (
                                <div className="space-y-1">
                                    <div className="text-[9px] uppercase tracking-tighter text-gray-600 font-bold mb-1">Video Lectures</div>
                                    <SortableContext
                                        items={displayVideos.map((v: any) => v.id)}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        <div className="space-y-1">
                                            {displayVideos.sort((a: any, b: any) => (a.order || 0) - (b.order || 0)).map((v: any) => (
                                                <MinimalSortableItem
                                                    key={v.id}
                                                    id={v.id}
                                                    type="video"
                                                    title={v.title}
                                                    order={v.order}
                                                />
                                            ))}
                                        </div>
                                    </SortableContext>
                                </div>
                            )}

                            {displayPyqs.length > 0 && (
                                <div className="space-y-1">
                                    <div className="text-[9px] uppercase tracking-tighter text-gray-600 font-bold mb-1">Previous Year Questions</div>
                                    <SortableContext
                                        items={displayPyqs.map((p: any) => p.id)}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        <div className="space-y-1">
                                            {displayPyqs.sort((a: any, b: any) => (a.order || 0) - (b.order || 0)).map((p: any) => (
                                                <MinimalSortableItem
                                                    key={p.id}
                                                    id={p.id}
                                                    type="pyq"
                                                    title={p.questionText?.replace(/<[^>]*>/g, '') || 'Question'}
                                                    order={p.order}
                                                />
                                            ))}
                                        </div>
                                    </SortableContext>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SortableLesson;
