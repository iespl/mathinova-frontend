import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus } from 'lucide-react';
import DragHandle from './DragHandle.js';

import TrashIcon from '../../assets/trash.svg';
import RichTextEditor from '../RichTextEditor.js';
import Input from '../Input.js';
import Button from '../Button.js';

interface SortablePYQProps {
    pyq: any;
    index: number;
    onChange: (index: number, field: string, value: any) => void;
    onRemove: (index: number) => void;
    onAddOccurrence: (index: number) => void;
    onOccurrenceChange: (pyqIndex: number, occIndex: number, field: string, value: any) => void;
    onRemoveOccurrence: (pyqIndex: number, occIndex: number) => void;
}

const SortablePYQ: React.FC<SortablePYQProps> = ({
    pyq, index, onChange, onRemove,
    onAddOccurrence, onOccurrenceChange, onRemoveOccurrence
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: pyq.id || `pyq-${index}` });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 10 : 1
    };

    return (
        <div ref={setNodeRef} style={style} className="p-6 bg-white/5 rounded-xl border border-white/10 group shadow-md">
            <div className="flex justify-between items-center mb-4">
                <p className="text-[10px] text-gray-400 uppercase font-mono font-bold tracking-wider">PYQ {index + 1}</p>
                <div className="flex items-center gap-2">
                    <DragHandle attributes={attributes} listeners={listeners} />
                    <button
                        type="button"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => { e.stopPropagation(); onRemove(index); }}
                        className="p-1.5 hover:bg-white/5 rounded transition-colors cursor-pointer group/trash"
                        title="Remove PYQ"
                    >
                        <img src={TrashIcon} alt="Remove" style={{ width: '14px', height: '14px', opacity: 0.5 }} className="group-hover/trash:opacity-100 transition-opacity" />
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Question</label>
                    <RichTextEditor
                        value={pyq.questionText || ''}
                        onChange={(val) => onChange(index, 'questionText', val)}
                        placeholder="Enter question with LaTeX support..."
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Answer / Solution</label>
                    <RichTextEditor
                        value={pyq.answerText || ''}
                        onChange={(val) => onChange(index, 'answerText', val)}
                        placeholder="Enter step-by-step solution..."
                    />
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <Input
                        label="Sol. Video URL"
                        value={pyq.solutionVideoUrl || ''}
                        onChange={(e) => onChange(index, 'solutionVideoUrl', e.target.value)}
                        placeholder="https://..."
                    />
                </div>

                {/* Occurrences Section */}
                <div className="pt-4 border-t border-white/5">
                    <div className="mb-3">
                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Exam Occurrences</h4>
                    </div>
                    <div className="space-y-4">
                        {(pyq.occurrences || []).map((occ: any, oIdx: number) => (
                            <div key={oIdx} className="p-7 bg-black/40 rounded-xl border-2 border-slate-700 space-y-7 shadow-2xl relative">
                                <div className="flex gap-6">
                                    <Input label="Year" type="number" value={occ.year} onChange={(e) => onOccurrenceChange(index, oIdx, 'year', e.target.value)} containerClassName="flex-1 mb-0" />
                                    <Input label="Month" value={occ.month} onChange={(e) => onOccurrenceChange(index, oIdx, 'month', e.target.value)} containerClassName="flex-1 mb-0" />
                                    <Input label="Course Code" value={occ.courseCode} onChange={(e) => onOccurrenceChange(index, oIdx, 'courseCode', e.target.value)} containerClassName="flex-1 mb-0" />
                                </div>

                                <div className="flex items-end gap-6">
                                    <div className="flex-1 flex flex-col gap-2">
                                        <label className="text-sm font-bold text-slate-200 ml-1 block">Part</label>
                                        <select
                                            className="w-full bg-white/10 border border-white/10 rounded-md px-4 h-11 text-sm text-text-primary focus:outline-none focus:border-blue-500 transition-colors shadow-sm font-medium"
                                            value={occ.part || 'Part-A'}
                                            onChange={(e) => onOccurrenceChange(index, oIdx, 'part', e.target.value)}
                                        >
                                            <option value="Part-A">Part-A</option>
                                            <option value="Part-B">Part-B</option>
                                        </select>
                                    </div>
                                    <button
                                        onClick={() => onRemoveOccurrence(index, oIdx)}
                                        className="flex items-center gap-2 px-7 h-11 bg-slate-100 hover:bg-white text-slate-900 text-sm font-bold rounded-md border border-gray-400 shadow-lg transition-all active:scale-95"
                                    >
                                        <span className="text-lg">✕</span>
                                        <span>Remove</span>
                                    </button>
                                </div>
                            </div>
                        ))}

                        <button
                            onClick={() => onAddOccurrence(index)}
                            className="w-fit flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 font-semibold px-3 py-1.5 bg-blue-400/5 border border-blue-400/20 rounded hover:bg-blue-400/10 transition-colors mt-2"
                        >+ Add More</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SortablePYQ;
