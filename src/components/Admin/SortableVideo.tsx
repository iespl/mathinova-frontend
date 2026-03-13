import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import DragHandle from './DragHandle.js';
import Input from '../Input.js';

import TrashIcon from '../../assets/trash.svg';
import DurationInput from '../DurationInput.js';

interface SortableVideoProps {
    video: any;
    index: number;
    onChange: (index: number, field: string, value: any) => void;
    onRemove: (index: number) => void;
}

const SortableVideo: React.FC<SortableVideoProps> = ({ video, index, onChange, onRemove }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: video.id || `video-${index}` });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 10 : 1
    };

    return (
        <div ref={setNodeRef} style={style} className="p-4 bg-white/5 rounded border border-white/10 group shadow-md">
            <div className="flex justify-between items-center mb-4">
                <p className="text-[10px] text-gray-400 uppercase font-mono font-bold tracking-wider">Video {index + 1}</p>
                <div className="flex items-center gap-2">
                    <DragHandle attributes={attributes} listeners={listeners} />
                    <button
                        type="button"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => { e.stopPropagation(); onRemove(index); }}
                        className="p-1.5 hover:bg-white/5 rounded transition-colors cursor-pointer group/trash"
                        title="Remove Video"
                    >
                        <img src={TrashIcon} alt="Remove" style={{ width: '14px', height: '14px', opacity: 0.5 }} className="group-hover/trash:opacity-100 transition-opacity" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 mb-2">
                <Input
                    label="Title"
                    value={video.title}
                    onChange={(e) => onChange(index, 'title', e.target.value)}
                    placeholder="Part 1: Overview"
                />
                <Input
                    label="HLS/MP4 URL"
                    value={video.videoUrl}
                    onChange={(e) => onChange(index, 'videoUrl', e.target.value)}
                    placeholder="https://..."
                />
            </div>
            <div className="flex items-center gap-4">
                <DurationInput
                    label="Duration"
                    value={video.duration}
                    onChange={(seconds) => onChange(index, 'duration', seconds)}
                />
            {/* Premium Showcase Toggle */}
            <div className="flex items-center justify-between p-3 bg-blue-400/5 border border-blue-400/10 rounded-lg mt-4">
                <div className="flex flex-col">
                    <span className="text-sm font-semibold text-blue-400">Public Showcase Sample</span>
                    <span className="text-[10px] text-gray-400">If enabled, this video will be visible to non-logged in visitors.</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={video.isSample || false}
                        onChange={(e) => onChange(index, 'isSample', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-400"></div>
                </label>
            </div>
            </div>
        </div>
    );
};

export default SortableVideo;
