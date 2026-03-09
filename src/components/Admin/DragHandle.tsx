import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface DragHandleProps {
    attributes: any;
    listeners: any;
    className?: string;
}

const DragHandle: React.FC<DragHandleProps> = ({ attributes, listeners, className = "" }) => {
    return (
        <div
            {...attributes}
            {...listeners}
            className={`cursor-grab active:cursor-grabbing p-1 hover:bg-white/10 rounded transition-colors ${className}`}
        >
            <GripVertical size={16} className="text-gray-500" />
        </div>
    );
};

export default DragHandle;
