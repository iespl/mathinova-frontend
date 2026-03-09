import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import DragHandle from './DragHandle.js';

import TrashIcon from '../../assets/trash.svg';
import Input from '../Input.js';

interface SortableQuestionProps {
    question: any;
    index: number;
    onChange: (index: number, field: string, value: any) => void;
    onRemove: (index: number) => void;
}

const SortableQuestion: React.FC<SortableQuestionProps> = ({ question, index, onChange, onRemove }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: question.id || `question-${index}` });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 10 : 1
    };

    return (
        <div ref={setNodeRef} style={style} className="p-4 bg-black/20 rounded border border-white/5 group shadow-md">
            <div className="flex justify-between items-center mb-3">
                <p className="text-[10px] text-gray-400 uppercase font-mono font-bold tracking-wider">Question {index + 1}</p>
                <div className="flex items-center gap-2">
                    <DragHandle attributes={attributes} listeners={listeners} />
                    <button
                        type="button"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => { e.stopPropagation(); onRemove(index); }}
                        className="p-1.5 hover:bg-white/5 rounded transition-colors cursor-pointer group/trash"
                        title="Remove Question"
                    >
                        <img src={TrashIcon} alt="Remove" style={{ width: '14px', height: '14px', opacity: 0.5 }} className="group-hover/trash:opacity-100 transition-opacity" />
                    </button>
                </div>
            </div>

            <div className="space-y-3">
                <textarea
                    className="w-full bg-transparent border-b border-white/10 py-1 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="Question prompt..."
                    value={question.prompt}
                    onChange={(e) => onChange(index, 'prompt', e.target.value)}
                />
                <div className="flex justify-between items-center">
                    <div className="flex gap-4">
                        <select
                            className="bg-white/10 border border-white/10 rounded px-2 py-0.5 text-xs text-text-primary focus:outline-none"
                            value={question.type}
                            onChange={(e) => onChange(index, 'type', e.target.value)}
                        >
                            <option value="mcq_single">Single Choice</option>
                            <option value="numeric">Numeric Answer</option>
                        </select>
                    </div>
                </div>

                {question.type === 'mcq_single' && (
                    <div className="space-y-2 pt-2">
                        <div className="flex justify-between items-center">
                            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Options</p>
                            <button
                                type="button"
                                onClick={() => {
                                    const options = question.options || [];
                                    onChange(index, 'options', [...options, { text: '', isCorrect: options.length === 0 }]);
                                }}
                                className="text-[10px] text-blue-400 hover:text-blue-300 font-bold uppercase tracking-tighter"
                            >
                                + Add Option
                            </button>
                        </div>
                        <div className="space-y-2">
                            {(question.options || []).map((opt: any, optIdx: number) => (
                                <div key={optIdx} className="flex items-center gap-3 bg-white/5 p-2 rounded group/opt">
                                    <input
                                        type="radio"
                                        name={`correct-${question.id || index}`}
                                        checked={opt.isCorrect}
                                        onChange={() => {
                                            const newOptions = (question.options || []).map((o: any, i: number) => ({
                                                ...o,
                                                isCorrect: i === optIdx
                                            }));
                                            onChange(index, 'options', newOptions);
                                        }}
                                        className="cursor-pointer accent-blue-500"
                                    />
                                    <input
                                        type="text"
                                        value={opt.text}
                                        onChange={(e) => {
                                            const newOptions = [...(question.options || [])];
                                            newOptions[optIdx] = { ...newOptions[optIdx], text: e.target.value };
                                            onChange(index, 'options', newOptions);
                                        }}
                                        className="flex-1 bg-transparent border-b border-white/5 focus:border-blue-500/50 outline-none text-xs py-1"
                                        placeholder={`Option ${optIdx + 1}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newOptions = (question.options || []).filter((_: any, i: number) => i !== optIdx);
                                            onChange(index, 'options', newOptions);
                                        }}
                                        className="opacity-0 group-hover/opt:opacity-100 p-1 hover:bg-red-500/10 rounded transition-all"
                                    >
                                        <img src={TrashIcon} alt="Del" style={{ width: '12px', height: '12px', opacity: 0.5 }} className="invert brightness-200" />
                                    </button>
                                </div>
                            ))}
                            {(!question.options || question.options.length === 0) && (
                                <p className="text-[10px] text-gray-600 italic">No options added. Click + Add Option.</p>
                            )}
                        </div>
                    </div>
                )}

                {question.type === 'numeric' && (
                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <Input
                            label="Value"
                            type="number"
                            value={question.numericValue || 0}
                            onChange={(e) => onChange(index, 'numericValue', parseFloat(e.target.value))}
                        />
                        <Input
                            label="Tolerance"
                            type="number"
                            value={question.tolerance || 0}
                            onChange={(e) => onChange(index, 'tolerance', parseFloat(e.target.value))}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default SortableQuestion;
