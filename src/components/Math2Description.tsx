import React from 'react';
import GlassCard from '../components/GlassCard.js';
import { CheckCircle2, BookOpen, Layers, Zap, Award } from 'lucide-react';

const Math2Description: React.FC = () => {
    return (
        <div className="space-y-8 animate-fade-in delay-200">
            {/* Main Description */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-violet-400 bg-clip-text text-transparent">
                    Engineering Mathematics-II (BMATE201) – Master Concepts with Solved PYQs
                </h2>
                <p className="text-text-secondary leading-relaxed">
                    Master Engineering Mathematics-II with a resource package designed specifically for <span className="text-primary font-bold">VTU Electrical & Electronics Engineering (EEE)</span> Semester II students. This program addresses common challenges in <span className="text-primary font-bold">BMATE201</span>—unclear priorities, unpredictable exams, and limited practice time—by placing extensive, solved previous year questions (PYQs) at its core.
                </p>
                <p className="text-text-secondary leading-relaxed">
                    We supplement these solutions with selected video lectures to clarify complex problems and concepts, ensuring you gain exam-ready skills while reinforcing theory and building confidence.
                </p>
            </div>

            {/* Feature Highlight: Solved PYQ */}
            <GlassCard className="border-primary/20 bg-primary/5 p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-500" />

                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-text-primary">
                    <Zap className="text-primary" size={24} />
                    Solved PYQs – Your Core Learning Tool
                </h3>

                <p className="text-text-secondary mb-6 leading-relaxed">
                    The comprehensive Solved PYQ section forms the foundation of this package. You’ll explore authentic VTU questions from past exams, carefully organized module-wise and solved using standard methods. For tougher topics, selected video explanations are included to break down key problems and concepts where students typically need extra support.
                </p>

                <div className="grid md:grid-cols-3 gap-4">
                    {[
                        { title: "Concept Mastery", desc: "Connecting theoretical principles to their application" },
                        { title: "Exam Readiness", desc: "Familiarizing with question patterns & marking" },
                        { title: "Confidence Building", desc: "Learning systematic approaches to simplify" }
                    ].map((item, i) => (
                        <div key={i} className="bg-bg-glass rounded-xl p-4 border border-border-glass flex flex-col gap-2 hover:bg-white/10 transition-colors">
                            <CheckCircle2 className="text-emerald-400" size={20} />
                            <div className="font-bold text-sm text-text-primary">{item.title}</div>
                            <div className="text-xs text-text-muted">{item.desc}</div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 pt-6 border-t border-border-glass text-sm text-text-secondary italic">
                    With Solved PYQs as the main focus, this program transforms your learning from passive study to active problem-solving—a proven path to top performance in VTU exams.
                </div>
            </GlassCard>

            {/* What You'll Learn */}
            <div className="space-y-6">
                <h3 className="text-xl font-bold flex items-center gap-2 text-text-primary">
                    <BookOpen className="text-violet-400" size={24} />
                    What You’ll Learn
                </h3>

                <div className="grid gap-4">
                    {[
                        {
                            module: "Module 1",
                            title: "Integral Calculus",
                            desc: "Master multiple integrals and their applications in electrical engineering. Selected videos provide visual guidance on complex integration problems."
                        },
                        {
                            module: "Module 2",
                            title: "Series Expansion & Multivariable Calculus",
                            desc: "Understand total derivatives, Jacobians, and series expansions for practical modeling. Solved PYQs demonstrate step-by-step techniques."
                        },
                        {
                            module: "Module 3",
                            title: "Ordinary Differential Equations (1st Order)",
                            desc: "Learn solution strategies for equations used in EEE systems modeling. Selected videos demystify solution methods for specific types."
                        },
                        {
                            module: "Module 4",
                            title: "Linear Algebra",
                            desc: "Apply rank, eigenvalues, and eigenvectors to circuits and control systems. Solved PYQs bridge conceptual understanding with real-world application."
                        }
                    ].map((mod, i) => (
                        <div key={i} className="flex gap-4 p-4 rounded-xl bg-bg-glass border border-border-glass hover:bg-white/10 transition-colors">
                            <div className="shrink-0 w-12 h-12 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400 font-bold text-xs uppercase tracking-tighter text-center leading-tight whitespace-pre-line">
                                {mod.module.replace('Module ', 'MOD\n')}
                            </div>
                            <div>
                                <h4 className="font-bold text-text-primary mb-1">{mod.title}</h4>
                                <p className="text-sm text-text-secondary leading-relaxed">{mod.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Our Approach */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold flex items-center gap-2 text-text-primary">
                    <Layers className="text-blue-400" size={24} />
                    Our Approach
                </h3>
                <p className="text-text-secondary leading-relaxed">
                    We combine focused theory, targeted practice, and exam-focused tools to ensure mastery:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-text-secondary text-sm">
                    <li><span className="font-bold text-text-primary">Expert Instruction:</span> Solutions and supplemental videos simplify complex concepts for EEE applications.</li>
                    <li><span className="font-bold text-text-primary">Multi-Modal Learning:</span> Module-wise notes, key video explanations, and interactive exercises.</li>
                    <li><span className="font-bold text-text-primary">Smart Practice:</span> Step-by-step PYQs, bookmarking tools, and progress tracking.</li>
                    <li><span className="font-bold text-text-primary">Exam-Oriented Focus:</span> Prioritize "must-know" problems and avoid common pitfalls.</li>
                </ul>
            </div>

            {/* Join Us CTA */}
            <div className="bg-gradient-to-r from-primary/10 to-violet-500/10 rounded-2xl p-8 border border-primary/20 text-center space-y-4">
                <Award className="mx-auto text-primary mb-2" size={32} />
                <h3 className="text-xl font-bold text-text-primary">Join Mathinova’s Engineering Mathematics Program</h3>
                <p className="text-text-secondary max-w-2xl mx-auto">
                    Start today and study smarter with the VTU Math Kit – your strategic shortcut to exam success. Experience a methodical, exam-oriented approach that helps you understand deeply and excel consistently.
                </p>
            </div>
        </div>
    );
};

export default Math2Description;
