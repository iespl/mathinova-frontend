import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChevronDown, ChevronUp, Trash2, Save, Plus } from 'lucide-react';
import DragHandle from './DragHandle.js';

import RichTextEditor from '../RichTextEditor.js';
import Input from '../Input.js';
import Button from '../Button.js';

interface SortablePYQProps {
    pyq: any;
    index: number;
    isExpanded: boolean;
    onToggle: () => void;
    onChange: (index: number, field: string, value: any) => void;
    onRemove: (index: number) => void;
    onSave: (index: number) => Promise<boolean>;
    onAddOccurrence: (index: number) => void;
    onOccurrenceChange: (pyqIndex: number, occIndex: number, field: string, value: any) => void;
    onRemoveOccurrence: (pyqIndex: number, occIndex: number) => void;
}

const SortablePYQ: React.FC<SortablePYQProps> = ({
    pyq, index, isExpanded, onToggle, onChange, onRemove, onSave,
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

    const decodeHtmlEntities = (text: string) => {
        return text
            .replace(/&nbsp;/gi, ' ')
            .replace(/&amp;/gi, '&')
            .replace(/&lt;/gi, '<')
            .replace(/&gt;/gi, '>')
            .replace(/&quot;/gi, '"')
            .replace(/&#39;/gi, "'")
            .replace(/&#x27;/gi, "'");
    };

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleLocalSave = async (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsSaving(true);
        setSaveStatus('idle');
        
        try {
            const success = await onSave(index);
            if (success) {
                setSaveStatus('success');
                setTimeout(() => setSaveStatus('idle'), 3000);
            } else {
                setSaveStatus('error');
            }
        } catch (err) {
            setSaveStatus('error');
            console.error('[SortablePYQ] Save error:', err);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div ref={setNodeRef} style={style} className="bg-white/5 rounded-xl border border-white/10 group shadow-md overflow-hidden">
            {/* Header / Accordion Toggle */}
            <div
                className="p-4 flex justify-between items-center cursor-pointer hover:bg-white/5 transition-colors"
                onClick={onToggle}
            >
                <div className="flex items-center gap-3">
                    <div className="text-gray-400">
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                    <p className="text-[10px] text-gray-400 uppercase font-mono font-bold tracking-wider">PYQ {index + 1}</p>
                    <span className="text-xs text-gray-500 truncate max-w-[200px]">
                        {pyq.questionText ? decodeHtmlEntities(pyq.questionText.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ')).trim().substring(0, 60) + '...' : '(Empty Question)'}
                    </span>
                </div>

                <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                    <DragHandle attributes={attributes} listeners={listeners} />
                    <button
                        type="button"
                        onClick={() => onRemove(index)}
                        className="p-1.5 hover:bg-red-500/20 rounded transition-colors cursor-pointer text-gray-400 hover:text-red-400"
                        title="Remove PYQ"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            {/* Content - Only shown if expanded */}
            {isExpanded && (
                <div className="p-6 pt-0 space-y-6 border-t border-white/5">
                    <div className="space-y-4 pt-6">
                        {/* Premium Showcase Toggle */}
                        <div className="flex items-center justify-between p-3 bg-primary-violet/5 border border-primary-violet/10 rounded-lg">
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold text-primary-violet">Public Showcase Sample</span>
                                <span className="text-[10px] text-gray-400">If enabled, this PYQ will be visible to non-logged in visitors as a preview.</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    className="sr-only peer"
                                    checked={pyq.isSample || false}
                                    onChange={(e) => onChange(index, 'isSample', e.target.checked)}
                                />
                                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-violet"></div>
                            </label>
                        </div>

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
                                    <div key={oIdx} className="p-4 bg-black/20 rounded-lg border border-white/10 relative">
                                        <div className="flex flex-row flex-nowrap items-end gap-3 w-full overflow-x-auto">
                                            {/* Year */}
                                            <div className="flex-1 min-w-[100px]">
                                                <Input label="Year" type="number" value={occ.year} onChange={(e) => onOccurrenceChange(index, oIdx, 'year', e.target.value)} containerClassName="mb-0" />
                                            </div>
                                            {/* Month */}
                                            <div className="flex-1 min-w-[120px] flex flex-col gap-1.5">
                                                <label className="text-sm font-bold text-text-primary">Month</label>
                                                <select
                                                    className="w-full bg-surface-glass border-2 border-white/20 rounded-lg px-3 h-[54px] text-sm text-text-primary focus:outline-none focus:border-primary-violet transition-all"
                                                    value={occ.month}
                                                    onChange={(e) => onOccurrenceChange(index, oIdx, 'month', e.target.value)}
                                                >
                                                    <option value="">Select Month</option>
                                                    {months.map(m => (
                                                        <option key={m} value={m}>{m}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            {/* Course Code */}
                                            <div className="flex-1 min-w-[120px]">
                                                <Input label="Course Code" value={occ.courseCode} onChange={(e) => onOccurrenceChange(index, oIdx, 'courseCode', e.target.value)} containerClassName="mb-0" />
                                            </div>
                                            {/* Part */}
                                            <div className="w-[100px] flex flex-col gap-1.5">
                                                <label className="text-sm font-bold text-text-primary">Part</label>
                                                <select
                                                    className="w-full bg-surface-glass border-2 border-white/20 rounded-lg px-3 h-[54px] text-sm text-text-primary focus:outline-none focus:border-primary-violet transition-all"
                                                    value={occ.part || 'Part-A'}
                                                    onChange={(e) => onOccurrenceChange(index, oIdx, 'part', e.target.value)}
                                                >
                                                    <option value="Part-A">Part-A</option>
                                                    <option value="Part-B">Part-B</option>
                                                </select>
                                            </div>
                                            {/* Delete */}
                                            <div className="shrink-0 flex justify-end pb-[6px]">
                                                <button
                                                    onClick={() => onRemoveOccurrence(index, oIdx)}
                                                    className="p-2 hover:bg-red-500/10 text-red-400/70 hover:text-red-400 rounded transition-colors"
                                                    title="Remove Occurrence"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <button
                                    onClick={() => onAddOccurrence(index)}
                                    className="w-full py-2 flex justify-center items-center gap-2 text-xs text-blue-400 hover:text-blue-300 font-medium bg-blue-400/5 border border-dashed border-blue-400/30 rounded-lg hover:bg-blue-400/10 transition-colors"
                                >
                                    <Plus size={14} />
                                    Add Examination Occurrence
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end items-center gap-4">
                        {saveStatus === 'success' && (
                            <span className="text-xs text-green-400 animate-pulse font-medium">Saved Successfully!</span>
                        )}
                        {saveStatus === 'error' && (
                            <span className="text-xs text-red-400 font-medium">Failed to Save</span>
                        )}
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={handleLocalSave}
                            disabled={isSaving}
                            className={`flex items-center gap-2 px-4 shadow-lg transition-all ${
                                isSaving ? 'opacity-70 cursor-not-allowed' : 'shadow-brand-primary/10'
                            }`}
                        >
                            {isSaving ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Save size={16} />
                            )}
                            {isSaving ? 'Saving...' : 'Save Changes for this PYQ'}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SortablePYQ;
