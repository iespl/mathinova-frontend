import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, Plus } from 'lucide-react';
import Button from '../Button.js';
import DragHandle from './DragHandle.js';

import EditIcon from '../../assets/edit.svg';
import TrashIcon from '../../assets/trash.svg';

import MinimalSortableItem from './MinimalSortableItem.js';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

interface SortableLessonProps {
    lesson: any;
    onEdit: (lesson: any) => void;
    onDelete: (lessonId: string) => void;
}

const SortableLesson: React.FC<SortableLessonProps> = ({ lesson, onEdit, onDelete }) => {
    const [isExpanded, setIsExpanded] = useState(false);
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

    const hasContent = (lesson.videos?.length > 0) || (lesson.pyqs?.length > 0);

    return (
        <div ref={setNodeRef} style={style} className="p-3 bg-black/20 rounded border border-white/5 shadow-sm group">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <DragHandle attributes={attributes} listeners={listeners} />
                    <button
                        type="button"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                        className={`p-1 hover:bg-white/5 rounded transition-colors cursor-pointer ${!hasContent && 'opacity-20 cursor-default'}`}
                        disabled={!hasContent}
                    >
                        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                    <div>
                        <div className="font-medium flex items-center gap-2">
                            <span className="text-gray-400 text-xs font-mono">L{lesson.order}</span>
                            {lesson.title}
                        </div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">
                            {lesson.videos?.length || 0} videos • {lesson.pyqs?.length || 0} PYQs
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
                            {lesson.videos?.length > 0 && (
                                <div className="space-y-1">
                                    <div className="text-[9px] uppercase tracking-tighter text-gray-600 font-bold mb-1">Video Lectures</div>
                                    <SortableContext
                                        items={lesson.videos.map((v: any) => v.id)}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        <div className="space-y-1">
                                            {lesson.videos.sort((a: any, b: any) => (a.order || 0) - (b.order || 0)).map((v: any) => (
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

                            {lesson.pyqs?.length > 0 && (
                                <div className="space-y-1">
                                    <div className="text-[9px] uppercase tracking-tighter text-gray-600 font-bold mb-1">Previous Year Questions</div>
                                    <SortableContext
                                        items={lesson.pyqs.map((p: any) => p.id)}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        <div className="space-y-1">
                                            {lesson.pyqs.sort((a: any, b: any) => (a.order || 0) - (b.order || 0)).map((p: any) => (
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
