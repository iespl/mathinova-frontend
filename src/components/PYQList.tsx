import React, { useState } from 'react';
import GlassCard from './GlassCard';
import Button from './Button';
import api from '../api/client';
import { Eye, EyeOff, Video, Calendar, Tag, ChevronDown, ChevronUp, CheckSquare } from 'lucide-react';
import RichTextDisplay from './RichTextDisplay';

interface Occurrence {
    id: string;
    year: number;
    month: string;
    courseCode: string;
}

interface PYQ {
    id: string;
    questionType: 'text' | 'image' | 'mixed';
    questionText?: string;
    questionImages?: string[]; // Expecting JSON array from backend
    answerText?: string;
    answerImages?: string[];
    solutionVideoUrl?: string;
    difficulty?: string;
    description?: string;
    occurrences: Occurrence[];
}

interface PYQListProps {
    pyqs: PYQ[];
    onSelectPyq?: (pyq: PYQ) => void;
}

const PYQList: React.FC<PYQListProps> = ({ pyqs, onSelectPyq }) => {
    const [expandedPyq, setExpandedPyq] = useState<string | null>(null);
    const [showSolution, setShowSolution] = useState<Record<string, boolean>>({});

    const handleToggleExpand = async (pyq: PYQ) => {
        const id = pyq.id;
        
        if (onSelectPyq) {
            onSelectPyq(pyq);
            return;
        }

        if (expandedPyq === id) {
            setExpandedPyq(null);
        } else {
            setExpandedPyq(id);
            // Track view
            try {
                await api.post(`/student/pyqs/${id}/view`);
            } catch (err) {
                console.error('Failed to track PYQ view', err);
            }
        }
    };

    const toggleSolution = (id: string) => {
        setShowSolution(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="flex flex-col gap-6 w-full">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <h2 className="text-xl md:text-2xl font-bold gradient-text">Practice Player (PYQs)</h2>
                <span className="text-text-muted text-xs font-medium">{pyqs.length} Questions</span>
            </div>

            <div className="flex flex-col gap-4">
                {pyqs.map((pyq, idx) => {
                    const isExpanded = expandedPyq === pyq.id;
                    const isSolutionVisible = showSolution[pyq.id];

                    // Parse images safely (Backend sends Json which might be string or array)
                    const qImages = Array.isArray(pyq.questionImages) ? pyq.questionImages : [];
                    const aImages = Array.isArray(pyq.answerImages) ? pyq.answerImages : [];

                    return (
                        <GlassCard
                            key={pyq.id}
                            className={`transition-all duration-300 overflow-hidden border ${isExpanded ? 'ring-2 ring-primary/50 border-primary/20 bg-bg-surface-2' : 'border-border-default hover:border-primary/30'}`}
                        >
                            {/* Header / Summary */}
                            <div
                                className="p-4 flex items-center justify-between cursor-pointer"
                                onClick={() => handleToggleExpand(pyq)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-bg-surface-3 flex items-center justify-center text-primary font-bold shrink-0">
                                        {idx + 1}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {pyq.occurrences.map(occ => (
                                                <span key={occ.id} className="inline-block whitespace-nowrap text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-md bg-brand-primary/5 text-brand-primary border border-brand-primary/10">
                                                    {occ.year} {occ.month} • {occ.courseCode}
                                                </span>
                                            ))}
                                            {pyq.difficulty && (
                                                <span className={`inline-block whitespace-nowrap text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-md border ${pyq.difficulty === 'Hard' ? 'bg-red-500/5 text-red-600 border-red-500/10' :
                                                    pyq.difficulty === 'Medium' ? 'bg-amber-500/5 text-amber-600 border-amber-500/10' :
                                                        'bg-emerald-500/5 text-emerald-600 border-emerald-500/10'
                                                    }`}>
                                                    {pyq.difficulty}
                                                </span>
                                            )}
                                        </div>
                                        <RichTextDisplay
                                            className="text-text-secondary text-sm mt-1 line-clamp-1"
                                            htmlContent={pyq.questionText || pyq.description || "View Question Details"}
                                        />
                                    </div>
                                </div>
                                {isExpanded ? <ChevronUp className="text-text-muted shrink-0 ml-2" /> : <ChevronDown className="text-text-muted shrink-0 ml-2" />}
                            </div>

                            {/* Detailed View */}
                            {isExpanded && (
                                <div className="p-3 border-t border-border-default bg-bg-surface-2 animate-in slide-in-from-top-2 duration-300">
                                    {/* Question Content */}
                                    <div className="flex flex-col gap-0 mb-6">
                                        {pyq.questionText && (
                                            <RichTextDisplay
                                                className="text-lg text-text-primary leading-relaxed bg-bg-surface p-3 rounded-t-xl"
                                                htmlContent={pyq.questionText}
                                            />
                                        )}
                                        {qImages.length > 0 && (
                                            <div className="flex flex-col gap-0 rounded-b-xl overflow-hidden border border-border-default border-t-0">
                                                {qImages.map((img, i) => (
                                                    <img key={i} src={img} alt={`Question part ${i + 1}`} className="w-full block rounded-none m-0 p-0" />
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-wrap gap-3 mb-6">
                                        <Button
                                            variant={isSolutionVisible ? "primary" : "outline"}
                                            size="sm"
                                            onClick={() => toggleSolution(pyq.id)}
                                            className="rounded-full"
                                        >
                                            {isSolutionVisible ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                                            {isSolutionVisible ? "Hide Solution" : "Show Solution"}
                                        </Button>
                                        {pyq.solutionVideoUrl && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => window.open(pyq.solutionVideoUrl, '_blank')}
                                                className="rounded-full border-primary/50 text-primary hover:bg-primary/10"
                                            >
                                                <Video className="w-4 h-4 mr-2" />
                                                Watch Solution Video
                                            </Button>
                                        )}
                                    </div>

                                    {/* Solution Content */}
                                    {isSolutionVisible && (
                                        <div className="space-y-4 p-4 bg-primary/5 border border-primary/20 rounded-2xl animate-in fade-in duration-500">
                                            <h4 className="text-sm text-primary font-bold flex items-center gap-2 mb-4">
                                                <CheckSquare className="w-5 h-5" />
                                                Step-by-Step Solution
                                            </h4>
                                            <div className="flex flex-col gap-0 bg-bg-surface rounded-xl overflow-hidden border border-primary/20">
                                                {pyq.answerText && (
                                                    <RichTextDisplay
                                                        className="text-text-primary leading-relaxed p-3"
                                                        htmlContent={pyq.answerText}
                                                    />
                                                )}
                                                {aImages.length > 0 && (
                                                    <div className="flex flex-col gap-0 border-t border-primary/10">
                                                        {aImages.map((img, i) => (
                                                            <img key={i} src={img} alt={`Solution page ${i + 1}`} className="w-full bg-white block rounded-none m-0 p-0" />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            {!pyq.answerText && aImages.length === 0 && (
                                                <p className="text-text-muted italic text-center p-8 bg-black/20 rounded-xl">
                                                    Textual solution or further details not provided. Please refer to the solution video if available.
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </GlassCard>
                    );
                })}
            </div>

            {pyqs.length === 0 && (
                <div className="text-center p-12 text-text-muted bg-white/5 rounded-3xl border border-dashed border-white/10">
                    No PYQs available for this lesson yet.
                </div>
            )}
        </div>
    );
};


export default PYQList;
