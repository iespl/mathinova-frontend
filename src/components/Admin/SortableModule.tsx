import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, Plus, Copy } from 'lucide-react';
import Button from '../Button.js';
import DragHandle from './DragHandle.js';

import EditIcon from '../../assets/edit.svg';
import TrashIcon from '../../assets/trash.svg';

interface SortableModuleProps {
    module: any;
    children: React.ReactNode;
    onAddLesson: (moduleId: string) => void;
    onRename: (moduleId: string, newTitle: string) => void;
    onDelete: (moduleId: string) => void;
    onClone: (moduleId: string, title: string) => void;
}

const SortableModule: React.FC<SortableModuleProps> = ({ module, children, onAddLesson, onRename, onDelete, onClone }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(module.title);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: module.id,
        disabled: isEditing,
        data: {
            type: 'module'
        }
    });

    const handleSaveRename = () => {
        if (editedTitle.trim() && editedTitle !== module.title) {
            onRename(module.id, editedTitle.trim());
        }
        setIsEditing(false);
    };

    const handleCancelRename = () => {
        setEditedTitle(module.title);
        setIsEditing(false);
    };

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 10 : 1
    };

    return (
        <div id={`module-${module.id}`} ref={setNodeRef} style={style} className="p-4 bg-black/20 rounded border border-white/5 shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3 flex-1">
                    <DragHandle attributes={attributes} listeners={listeners} />
                    <button
                        type="button"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                        className="p-1 hover:bg-white/5 rounded transition-colors cursor-pointer"
                    >
                        {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    </button>

                    {isEditing ? (
                        <div className="flex items-center gap-2 flex-1">
                            <input
                                autoFocus
                                className="bg-white/10 border border-white/20 rounded px-2 py-1 text-sm flex-1 outline-none focus:ring-1 focus:ring-purple-500"
                                value={editedTitle}
                                onChange={(e) => setEditedTitle(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSaveRename();
                                    if (e.key === 'Escape') handleCancelRename();
                                }}
                            />
                            <button type="button" onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); handleSaveRename(); }} className="text-green-500 hover:text-green-400 text-xs font-bold px-1 cursor-pointer">SAVE</button>
                            <button type="button" onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); handleCancelRename(); }} className="text-gray-500 hover:text-gray-400 text-xs font-bold px-1 cursor-pointer">CANCEL</button>
                        </div>
                    ) : (
                        <h3 className="font-semibold text-lg flex items-center gap-2 group/title">
                            <span className="text-white/30 text-sm font-mono">{module.order}.</span>
                            {module.title}
                            <button
                                type="button"
                                onPointerDown={(e) => e.stopPropagation()}
                                onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
                                className="p-1 hover:bg-white/5 rounded transition-all cursor-pointer"
                                title="Rename Module"
                            >
                                <img src={EditIcon} alt="Edit" style={{ width: '14px', height: '14px', opacity: 0.5 }} className="hover:opacity-100 transition-opacity" />
                            </button>
                        </h3>
                    )}
                </div>
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        variant="glass"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e: React.MouseEvent) => { e.stopPropagation(); onAddLesson(module.id); }}
                        className="cursor-pointer"
                    >
                        <Plus size={14} className="mr-1" /> Add Lesson
                    </Button>
                    <button
                        type="button"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => { e.stopPropagation(); onClone(module.id, module.title); }}
                        className="p-2 hover:bg-white/10 rounded transition-colors cursor-pointer text-white/50 hover:text-white"
                        title="Clone Module"
                    >
                        <Copy size={16} />
                    </button>
                    <button
                        type="button"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => { e.stopPropagation(); onDelete(module.id); }}
                        className="p-2 hover:bg-red-500/10 rounded transition-colors cursor-pointer"
                        title="Delete Module"
                    >
                        <img src={TrashIcon} alt="Delete" style={{ width: '16px', height: '16px', opacity: 0.5 }} className="hover:opacity-100" />
                    </button>
                </div>
            </div>

            <AnimatePresence initial={false}>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="pl-4 space-y-2 pb-2">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SortableModule;
