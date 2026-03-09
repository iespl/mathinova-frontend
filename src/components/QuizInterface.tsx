import React, { useState, useEffect } from 'react';
import GlassCard from './GlassCard';
import Button from './Button';
import api from '../api/client';
import { CheckCircle2, Circle, ChevronRight, ChevronLeft, Send, CheckSquare, Square } from 'lucide-react';

interface Option {
    id: string;
    text: string;
}

interface Question {
    id: string;
    type: string;
    prompt: string;
    options: Option[];
}

interface QuizInterfaceProps {
    quiz: {
        id: string;
        title: string;
        questions: Question[];
    };
    onComplete: () => void;
}

const QuizInterface: React.FC<QuizInterfaceProps> = ({ quiz, onComplete }) => {
    const [attemptId, setAttemptId] = useState<string | null>(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState<{ score: number } | null>(null);

    useEffect(() => {
        const startAttempt = async () => {
            try {
                const { data } = await api.post('/student/quiz/start', { quizId: quiz.id });
                setAttemptId(data.id);
            } catch (err) {
                console.error('Failed to start quiz attempt', err);
            }
        };
        startAttempt();
    }, [quiz.id]);

    const handleSingleSelect = (questionId: string, optionId: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: { selectedOptions: [optionId] } }));
    };

    const handleMultiSelect = (questionId: string, optionId: string) => {
        const current = answers[questionId]?.selectedOptions || [];
        const updated = current.includes(optionId)
            ? current.filter((id: string) => id !== optionId)
            : [...current, optionId];
        setAnswers(prev => ({ ...prev, [questionId]: { selectedOptions: updated } }));
    };

    const handleNumericInput = (questionId: string, value: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: { numericAnswer: parseFloat(value) } }));
    };

    const handleSubmit = async () => {
        if (!attemptId) return;
        setIsSubmitting(true);
        try {
            const answerPayload = Object.entries(answers).map(([qId, val]) => ({
                questionId: qId,
                ...val
            }));
            const { data } = await api.post('/student/quiz/submit', {
                quizId: quiz.id,
                attemptId,
                answers: answerPayload
            });
            setResult(data);
            onComplete();
        } catch (err) {
            alert('Failed to submit quiz. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (result) {
        return (
            <div className="flex flex-col items-center justify-center gap-6 p-8 text-center animate-in fade-in zoom-in duration-300">
                <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-12 h-12 text-primary" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold gradient-text">Quiz Complete!</h2>
                    <p className="text-text-secondary mt-2 text-lg">You scored {result.score.toFixed(1)}%</p>
                </div>
                <div className="flex gap-4">
                    <Button onClick={() => window.location.reload()} variant="outline">Retake Quiz</Button>
                </div>
            </div>
        );
    }

    const currentQuestion = quiz.questions[currentStep];
    if (!currentQuestion) return <div>No questions available.</div>;

    const isLastStep = currentStep === quiz.questions.length - 1;

    return (
        <div className="flex flex-col gap-8 w-full animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white">{quiz.title}</h2>
                    <p className="text-text-muted text-sm mt-1">Question {currentStep + 1} of {quiz.questions.length}</p>
                </div>
                <div className="h-2 w-32 bg-white/5 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${((currentStep + 1) / quiz.questions.length) * 100}%` }}
                    />
                </div>
            </div>

            <GlassCard className="p-8 border-primary/20">
                <h3 className="text-xl font-medium mb-8 leading-relaxed">
                    {currentQuestion.prompt}
                </h3>

                <div className="flex flex-col gap-4">
                    {currentQuestion.type === 'numeric' ? (
                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-text-muted">Enter your numerical answer:</label>
                            <input
                                type="number"
                                step="any"
                                value={answers[currentQuestion.id]?.numericAnswer || ''}
                                onChange={(e) => handleNumericInput(currentQuestion.id, e.target.value)}
                                className="bg-white/5 border border-white/10 p-4 rounded-xl text-white focus:outline-none focus:border-primary transition-all text-xl"
                                placeholder="0.00"
                            />
                        </div>
                    ) : (
                        currentQuestion.options?.map(opt => {
                            const isSelected = answers[currentQuestion.id]?.selectedOptions?.includes(opt.id);
                            const Icon = currentQuestion.type === 'mcq_multiple'
                                ? (isSelected ? CheckSquare : Square)
                                : (isSelected ? CheckCircle2 : Circle);

                            return (
                                <div
                                    key={opt.id}
                                    className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all border-2 ${isSelected
                                        ? 'bg-primary/10 border-primary'
                                        : 'bg-white/5 border-transparent hover:border-white/20'
                                        }`}
                                    onClick={() => currentQuestion.type === 'mcq_multiple'
                                        ? handleMultiSelect(currentQuestion.id, opt.id)
                                        : handleSingleSelect(currentQuestion.id, opt.id)
                                    }
                                >
                                    <Icon className={`w-6 h-6 ${isSelected ? 'text-primary' : 'text-text-muted'}`} />
                                    <span className={`text-lg ${isSelected ? 'text-white' : 'text-text-secondary'}`}>
                                        {opt.text}
                                    </span>
                                </div>
                            );
                        })
                    )}
                </div>
            </GlassCard>

            <div className="flex items-center justify-between gap-4 mt-2">
                <Button
                    onClick={() => setCurrentStep(prev => prev - 1)}
                    disabled={currentStep === 0}
                    variant="outline"
                    className="flex-1"
                >
                    <ChevronLeft className="w-5 h-5 mr-2" />
                    Previous
                </Button>

                {isLastStep ? (
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex-[2]"
                    >
                        {isSubmitting ? 'Submitting...' : 'Complete Quiz'}
                        {!isSubmitting && <Send className="w-5 h-5 ml-2" />}
                    </Button>
                ) : (
                    <Button
                        onClick={() => setCurrentStep(prev => prev + 1)}
                        className="flex-1"
                    >
                        Next
                        <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                )}
            </div>
        </div>
    );
};

export default QuizInterface;
