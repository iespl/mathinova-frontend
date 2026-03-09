import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import DragHandle from './DragHandle.js';
import { Play, FileText, HelpCircle } from 'lucide-react';

interface MinimalSortableItemProps {
    id: string;
    type: 'video' | 'pyq' | 'question';
    title: string;
    order: number;
}

const MinimalSortableItem: React.FC<MinimalSortableItemProps> = ({ id, type, title, order }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id,
        data: {
            type,
            title
        }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
        zIndex: isDragging ? 20 : 1
    };

    const getIcon = () => {
        switch (type) {
            case 'video': return <Play size={10} className="fill-current" />;
            case 'pyq': return <FileText size={10} />;
            case 'question': return <HelpCircle size={10} />;
            default: return <FileText size={10} />;
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center gap-2 py-1.5 px-3 bg-white/5 hover:bg-white/10 rounded border border-white/5 group transition-colors cursor-default"
        >
            <DragHandle attributes={attributes} listeners={listeners} />
            <span className="text-[10px] text-white/30 font-mono">#{order}</span>
            <span className="text-white/40">{getIcon()}</span>
            <span className="text-[11px] text-gray-300 truncate flex-1">{title}</span>
        </div>
    );
};

export default MinimalSortableItem;
