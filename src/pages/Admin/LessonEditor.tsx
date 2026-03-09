import React, { useState } from 'react';
import GlassCard from '../../components/GlassCard.js';
import Button from '../../components/Button.js';
import Input from '../../components/Input.js';
import RichTextEditor from '../../components/RichTextEditor.js';
import { adminApi } from '../../api/adminClient.js';
import DurationInput from '../../components/DurationInput.js';
import ConfirmModal from '../../components/Admin/ConfirmModal.js';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import SortableVideo from '../../components/Admin/SortableVideo.js';
import SortablePYQ from '../../components/Admin/SortablePYQ.js';
import SortableQuestion from '../../components/Admin/SortableQuestion.js';

import TrashIcon from '../../assets/trash.svg';

interface LessonEditorProps {
    lesson: any;
    onClose: () => void;
    onUpdate: () => void;
    initialTab?: 'videos' | 'pyqs' | 'quiz';
}

const LessonEditor: React.FC<LessonEditorProps> = ({ lesson, onClose, onUpdate, initialTab = 'videos' }) => {
    const [videos, setVideos] = useState<any[]>(lesson.videos || []);
    const [pyqs, setPyqs] = useState<any[]>(lesson.pyqs || []);
    const [quiz, setQuiz] = useState<any>(lesson.quiz || null);
    const [editableTitle, setEditableTitle] = useState(lesson.title);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'videos' | 'pyqs' | 'quiz'>(initialTab);
    const [confirmConfig, setConfirmConfig] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
    }>({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { }
    });

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleAddVideo = () => {
        setVideos([...videos, { title: '', videoUrl: '', duration: 0, isSample: false }]);
    };

    const handleVideoChange = (index: number, field: string, value: any) => {
        const newVideos = [...videos];
        newVideos[index] = { ...newVideos[index], [field]: value };
        setVideos(newVideos);
    };

    const handleRemoveVideo = (index: number) => {
        setConfirmConfig({
            isOpen: true,
            title: 'Remove Video?',
            message: 'Are you sure you want to remove this video from the lesson?',
            onConfirm: () => {
                setVideos(videos.filter((_, i) => i !== index));
                setConfirmConfig(prev => ({ ...prev, isOpen: false })); // Close modal after action
            }
        });
    };

    const handleDragEndVideo = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = videos.findIndex((v: any) => (v.id || `video-${videos.indexOf(v)}`) === active.id);
        const newIndex = videos.findIndex((v: any) => (v.id || `video-${videos.indexOf(v)}`) === over.id);

        setVideos(arrayMove(videos, oldIndex, newIndex).map((v: any, idx: number) => ({ ...v, order: idx })));
    };

    // PYQ Handlers
    const handleAddPyq = () => {
        setPyqs([...pyqs, {
            questionText: '',
            answerText: '',
            solutionVideoUrl: '',
            order: pyqs.length,
            occurrences: [{ year: new Date().getFullYear(), month: 'June', courseCode: '', part: 'Part-A' }]
        }]);
    };

    const handlePyqChange = (index: number, field: string, value: any) => {
        const newPyqs = [...pyqs];
        newPyqs[index] = { ...newPyqs[index], [field]: value };
        setPyqs(newPyqs);
    };

    const handleAddOccurrence = (pyqIndex: number) => {
        const newPyqs = [...pyqs];
        const occurrences = newPyqs[pyqIndex].occurrences || [];
        newPyqs[pyqIndex].occurrences = [...occurrences, { year: new Date().getFullYear(), month: 'June', courseCode: '', part: 'Part-A' }];
        setPyqs(newPyqs);
    };

    const handleOccurrenceChange = (pyqIndex: number, occIndex: number, field: string, value: any) => {
        const newPyqs = [...pyqs];
        const occurrences = [...newPyqs[pyqIndex].occurrences];
        occurrences[occIndex] = { ...occurrences[occIndex], [field]: value };
        newPyqs[pyqIndex].occurrences = occurrences;
        setPyqs(newPyqs);
    };

    const handleRemoveOccurrence = (pyqIndex: number, occIndex: number) => {
        const newPyqs = [...pyqs];
        newPyqs[pyqIndex].occurrences = newPyqs[pyqIndex].occurrences.filter((_: any, i: number) => i !== occIndex);
        setPyqs(newPyqs);
    };

    const handleRemovePyq = (index: number) => {
        setConfirmConfig({
            isOpen: true,
            title: 'Remove PYQ?',
            message: 'Are you sure you want to remove this PYQ from the lesson?',
            onConfirm: () => {
                setPyqs(pyqs.filter((_, i) => i !== index));
                setConfirmConfig(prev => ({ ...prev, isOpen: false })); // Close modal after action
            }
        });
    };

    const handleDragEndPyq = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = pyqs.findIndex((p: any) => (p.id || `pyq-${pyqs.indexOf(p)}`) === active.id);
        const newIndex = pyqs.findIndex((p: any) => (p.id || `pyq-${pyqs.indexOf(p)}`) === over.id);

        setPyqs(arrayMove(pyqs, oldIndex, newIndex).map((p: any, idx: number) => ({ ...p, order: idx })));
    };

    // Quiz Handlers
    const handleToggleQuiz = () => {
        if (quiz) {
            setConfirmConfig({
                isOpen: true,
                title: 'Delete Quiz?',
                message: 'Would you really like to delete this quiz? All questions will be lost. This operation cannot be reversed.',
                onConfirm: () => {
                    setQuiz(null);
                    setConfirmConfig(prev => ({ ...prev, isOpen: false })); // Close modal after action
                }
            });
        } else {
            setQuiz({ title: lesson.title + ' Quiz', description: '', isPublished: true, questions: [] });
        }
    };
    const handleQuizChange = (field: string, value: any) => {
        setQuiz({ ...quiz, [field]: value });
    };

    const handleAddQuestion = () => {
        const newQuestions = [...(quiz.questions || []), {
            prompt: '',
            type: 'mcq_single',
            order: (quiz.questions || []).length,
            options: [
                { text: '', isCorrect: true },
                { text: '', isCorrect: false },
                { text: '', isCorrect: false },
                { text: '', isCorrect: false }
            ]
        }];
        setQuiz({ ...quiz, questions: newQuestions });
    };

    const handleQuestionChange = (qIndex: number, field: string, value: any) => {
        const newQuestions = [...quiz.questions];
        newQuestions[qIndex] = { ...newQuestions[qIndex], [field]: value };
        setQuiz({ ...quiz, questions: newQuestions });
    };

    const handleRemoveQuestion = (qIndex: number) => {
        setConfirmConfig({
            isOpen: true,
            title: 'Delete Question?',
            message: 'Are you sure you want to remove this question from the quiz?',
            onConfirm: () => {
                const newQuestions = quiz.questions.filter((_: any, i: number) => i !== qIndex);
                setQuiz({ ...quiz, questions: newQuestions });
                setConfirmConfig(prev => ({ ...prev, isOpen: false })); // Close modal after action
            }
        });
    };

    const handleDragEndQuestion = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = quiz.questions.findIndex((q: any) => (q.id || `question-${quiz.questions.indexOf(q)}`) === active.id);
        const newIndex = quiz.questions.findIndex((q: any) => (q.id || `question-${quiz.questions.indexOf(q)}`) === over.id);

        const newQuestions = arrayMove(quiz.questions, oldIndex, newIndex).map((q: any, idx) => ({ ...q, order: idx }));
        setQuiz({ ...quiz, questions: newQuestions });
    };

    const handleSave = async () => {
        if (!editableTitle.trim()) {
            alert('Lesson title cannot be empty');
            return;
        }

        setIsSaving(true);
        try {
            // Update Title if changed
            if (editableTitle.trim() !== lesson.title) {
                await adminApi.updateLesson(lesson.id, { title: editableTitle.trim() });
            }

            // Update Content
            await adminApi.updateLessonContent(lesson.id, { videos, pyqs, quiz });

            await onUpdate();
            onClose();
        } catch (error) {
            alert('Failed to update lesson');
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)',
            zIndex: 100000, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
            <GlassCard style={{ width: '95%', maxWidth: '1000px', maxHeight: '95vh', overflowY: 'auto' }}>
                <div className="flex justify-between items-center mb-6">
                    <div className="flex-1 mr-4">
                        <div className="flex items-center gap-2 group">
                            <h2 className="text-xl font-bold gradient-text whitespace-nowrap">Edit Content:</h2>
                            <input
                                type="text"
                                value={editableTitle}
                                onChange={(e) => setEditableTitle(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
                                    if (e.key === 'Escape') {
                                        setEditableTitle(lesson.title);
                                        (e.target as HTMLInputElement).blur();
                                    }
                                }}
                                className="text-xl font-bold text-black bg-transparent border-b border-transparent hover:border-black/30 focus:border-black focus:outline-none transition-all flex-1"
                                placeholder="Lesson Title"
                            />
                        </div>
                        <div className="flex gap-4 mt-2">
                            <button
                                onClick={() => setActiveTab('videos')}
                                className={`text-sm font-medium pb-1 transition-colors cursor-pointer ${activeTab === 'videos' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-500 hover:text-white'}`}
                            >
                                📹 Video Lectures ({videos.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('pyqs')}
                                className={`text-sm font-medium pb-1 transition-colors cursor-pointer ${activeTab === 'pyqs' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-500 hover:text-white'}`}
                            >
                                📝 PYQs ({pyqs.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('quiz')}
                                className={`text-sm font-medium pb-1 transition-colors cursor-pointer ${activeTab === 'quiz' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-500 hover:text-white'}`}
                            >
                                🧠 Quiz {quiz ? '(Active)' : '(None)'}
                            </button>
                        </div>
                    </div>
                    <Button variant="glass" size="sm" onClick={onClose}>✕</Button>
                </div>

                <div className="mt-4">
                    {/* Videos Section */}
                    {activeTab === 'videos' && (
                        <section className="space-y-6">
                            <div className="mb-4">
                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                    <span className="text-blue-400">📹</span> Video Lectures
                                </h3>
                            </div>

                            <div className="space-y-4">
                                {videos.length === 0 && <p className="text-gray-400 text-sm italic">No videos attached to this lesson.</p>}
                                <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragEnd={handleDragEndVideo}
                                    modifiers={[restrictToVerticalAxis]}
                                >
                                    <SortableContext
                                        items={videos.map((v, i) => v.id || `video-${i}`)}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        <div className="space-y-4">
                                            {videos.map((video, index) => (
                                                <SortableVideo
                                                    key={video.id || `video-${index}`}
                                                    video={video}
                                                    index={index}
                                                    onChange={handleVideoChange}
                                                    onRemove={handleRemoveVideo}
                                                />
                                            ))}
                                        </div>
                                    </SortableContext>
                                </DndContext>
                                <div className="mt-4 flex justify-start">
                                    <Button size="sm" variant="glass" onClick={handleAddVideo}>+ Add Video</Button>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* PYQs Section */}
                    {activeTab === 'pyqs' && (
                        <section className="space-y-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                    <span className="text-yellow-400">📝</span> Previous Year Questions
                                </h3>
                                <Button size="sm" variant="glass" onClick={handleAddPyq}>+ Add PYQ</Button>
                            </div>

                            <div className="space-y-4">
                                {pyqs.length === 0 && <p className="text-gray-400 text-sm italic">No PYQs attached to this lesson.</p>}
                                <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragEnd={handleDragEndPyq}
                                    modifiers={[restrictToVerticalAxis]}
                                >
                                    <SortableContext
                                        items={pyqs.map((p, i) => p.id || `pyq-${i}`)}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        <div className="space-y-4">
                                            {pyqs.map((pyq, index) => (
                                                <SortablePYQ
                                                    key={pyq.id || `pyq-${index}`}
                                                    pyq={pyq}
                                                    index={index}
                                                    onChange={handlePyqChange}
                                                    onRemove={handleRemovePyq}
                                                    onAddOccurrence={handleAddOccurrence}
                                                    onOccurrenceChange={handleOccurrenceChange}
                                                    onRemoveOccurrence={handleRemoveOccurrence}
                                                />
                                            ))}
                                        </div>
                                    </SortableContext>
                                </DndContext>
                                <div className="mt-4 flex justify-start">
                                    <Button size="sm" variant="glass" onClick={handleAddPyq}>+ Add PYQ</Button>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Quiz Section */}
                    {activeTab === 'quiz' && (
                        <section className="space-y-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                    <span className="text-purple-400">🧠</span> Lesson Quiz
                                </h3>
                                <Button size="sm" variant={quiz ? "glass" : "primary"} onClick={handleToggleQuiz} className="flex items-center gap-2 cursor-pointer">
                                    {quiz && <img src={TrashIcon} alt="" style={{ width: '14px', height: '14px', opacity: 0.7 }} />}
                                    {quiz ? "Delete Quiz" : "+ Create Quiz"}
                                </Button>
                            </div>

                            {quiz ? (
                                <div className="p-5 bg-blue-500/5 rounded-xl border border-blue-500/20 space-y-6">
                                    <div className="space-y-4">
                                        <Input
                                            label="Quiz Title"
                                            value={quiz.title}
                                            onChange={(e) => handleQuizChange('title', e.target.value)}
                                        />
                                        <Input
                                            label="Description (Optional)"
                                            value={quiz.description || ''}
                                            onChange={(e) => handleQuizChange('description', e.target.value)}
                                        />
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={quiz.isPublished !== false}
                                                onChange={(e) => handleQuizChange('isPublished', e.target.checked)}
                                            />
                                            <span className="text-xs">Published</span>
                                        </label>
                                    </div>

                                    <div className="pt-4 border-t border-white/10">
                                        <div className="flex justify-between items-center mb-4">
                                            <h4 className="text-sm font-medium uppercase tracking-wider text-gray-400">Questions</h4>
                                            <button
                                                onClick={handleAddQuestion}
                                                className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
                                            >+ Add Question</button>
                                        </div>

                                        <div className="space-y-4">
                                            {(!quiz.questions || quiz.questions.length === 0) && (
                                                <p className="text-gray-500 text-xs italic">No questions added yet.</p>
                                            )}
                                            <DndContext
                                                sensors={sensors}
                                                collisionDetection={closestCenter}
                                                onDragEnd={handleDragEndQuestion}
                                                modifiers={[restrictToVerticalAxis]}
                                            >
                                                <SortableContext
                                                    items={(quiz.questions || []).map((q: any, i: number) => q.id || `question-${i}`)}
                                                    strategy={verticalListSortingStrategy}
                                                >
                                                    <div className="space-y-4">
                                                        {(quiz.questions || []).map((q: any, qIdx: number) => (
                                                            <SortableQuestion
                                                                key={q.id || `question-${qIdx}`}
                                                                question={q}
                                                                index={qIdx}
                                                                onChange={handleQuestionChange}
                                                                onRemove={handleRemoveQuestion}
                                                            />
                                                        ))}
                                                    </div>
                                                </SortableContext>
                                            </DndContext>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-xl text-gray-500">
                                    <p className="text-sm">No Quiz attached to this lesson.</p>
                                    <button
                                        onClick={handleToggleQuiz}
                                        className="text-xs text-blue-400 mt-2 hover:underline"
                                    >Create one now</button>
                                </div>
                            )}
                        </section>
                    )}
                </div>

                <div className="mt-10 pt-6 border-t border-white/10 flex justify-end gap-4">
                    <Button variant="glass" onClick={onClose}>Cancel</Button>
                    <Button isLoading={isSaving} onClick={handleSave}>Save Changes</Button>
                </div>
            </GlassCard>
            {/* Confirmation Modal */}
            <ConfirmModal
                isOpen={confirmConfig.isOpen}
                title={confirmConfig.title}
                message={confirmConfig.message}
                onConfirm={confirmConfig.onConfirm}
                onClose={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
            />
        </div>
    );
};

export default LessonEditor;
