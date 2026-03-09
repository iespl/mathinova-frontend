import React from 'react';
import GlassCard from '../components/GlassCard.js';
import { CheckCircle2, BookOpen, Layers, Zap, Award } from 'lucide-react';

const CourseDescription: React.FC = () => {
    return (
        <div className="space-y-8 animate-fade-in delay-200">
            {/* Main Description */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-violet-400 bg-clip-text text-transparent">
                    Master VTU Mathematics through Concept Clarity and Solved PYQs
                </h2>
                <p className="text-text-secondary leading-relaxed">
                    Prepare confidently for your VTU examinations with Mathinova’s Engineering Mathematics Program for Mechanical Engineers, aligned with the <span className="text-primary font-bold">BMATM101</span> and <span className="text-primary font-bold">21MAT11</span> syllabi.
                </p>
                <p className="text-text-secondary leading-relaxed">
                    This program bridges conceptual understanding and exam-oriented preparation through a unique combination of structured theory lessons and an extensive Solved PYQ Section. Every concept you learn is reinforced with previous year VTU problems, each solved step by step with clear reasoning. This ensures you understand not only the <span className="italic text-text-primary">“how”</span> behind mathematical methods but also the <span className="italic text-text-primary">“why”</span> behind their application in real exam contexts — turning preparation into mastery.
                </p>
            </div>

            {/* Feature Highlight: Solved PYQ */}
            <GlassCard className="border-primary/20 bg-primary/5 p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-500" />

                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Zap className="text-primary" size={24} />
                    Solved PYQ–Integrated Learning
                </h3>

                <p className="text-text-secondary mb-6 leading-relaxed">
                    The Solved PYQ Section forms the foundation of this course. You’ll explore authentic VTU questions drawn from past exams, carefully organized module-wise and explained using the same methods taught in lectures. Selected supporting video lectures are included wherever needed to clarify key steps or concepts, helping you understand the solutions more effectively.
                </p>

                <div className="grid md:grid-cols-3 gap-4">
                    {[
                        { title: "Concept Mastery", desc: "Connecting theory to application" },
                        { title: "Exam Readiness", desc: "Familiarizing with question patterns" },
                        { title: "Confidence Building", desc: "Learning to approach & solve" }
                    ].map((item, i) => (
                        <div key={i} className="bg-bg-glass rounded-xl p-4 border border-border-glass flex flex-col gap-2 hover:bg-white/10 transition-colors">
                            <CheckCircle2 className="text-emerald-400" size={20} />
                            <div className="font-bold text-sm text-text-primary">{item.title}</div>
                            <div className="text-xs text-text-muted">{item.desc}</div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 pt-6 border-t border-border-glass text-sm text-text-secondary italic">
                    With Solved PYQs at its core, this program transforms learning from passive study to active problem-solving practice — a proven path to top performance in VTU exams.
                </div>
            </GlassCard>

            {/* What You'll Learn */}
            <div className="space-y-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <BookOpen className="text-violet-400" size={24} />
                    What You’ll Learn
                </h3>

                <div className="grid gap-4">
                    {[
                        {
                            module: "Module 1",
                            title: "Calculus",
                            desc: "Understand derivatives, polar coordinates, and Taylor series fundamental to mechanics and motion analysis."
                        },
                        {
                            module: "Module 2",
                            title: "Series Expansion & Multivariable Calculus",
                            desc: "Move from single-variable to multivariable functions. Learn the Jacobian and total derivatives, crucial in optimization and simulation."
                        },
                        {
                            module: "Module 3",
                            title: "Ordinary Differential Equations (1st Order)",
                            desc: "Formulate and solve first-order ODEs for modeling real-world mechanical systems."
                        },
                        {
                            module: "Module 4",
                            title: "Ordinary Differential Equations (Higher Order)",
                            desc: "Apply higher-order ODEs in vibration, heat transfer, and control system analysis."
                        },
                        {
                            module: "Module 5",
                            title: "Linear Algebra",
                            desc: "Study rank, eigenvalues, and eigenvectors, and apply them in structural and thermal analysis."
                        }
                    ].map((mod, i) => (
                        <div key={i} className="flex gap-4 p-4 rounded-xl bg-bg-glass border border-border-glass hover:bg-white/10 transition-colors">
                            <div className="shrink-0 w-12 h-12 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400 font-bold text-xs uppercase tracking-tighter text-center leading-tight">
                                {mod.module.replace('Module ', 'MOD\n')}
                            </div>
                            <div>
                                <h4 className="font-bold text-text-primary mb-1">{mod.title}</h4>
                                <p className="text-sm text-text-secondary leading-relaxed">{mod.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <p className="text-sm text-text-muted bg-bg-glass p-4 rounded-lg border border-border-glass">
                    Throughout each module, Solved PYQs are interwoven to demonstrate direct applications of these concepts in past VTU examinations. Selected video lectures are included wherever needed to make solutions clearer and learning easier.
                </p>
            </div>

            {/* Our Approach */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <Layers className="text-blue-400" size={24} />
                    Our Approach
                </h3>
                <p className="text-text-secondary leading-relaxed">
                    At Mathinova, we emphasize <span className="font-bold text-text-primary">“Learn through Practice.”</span> The program combines solved questions, selected video explanations, interactive 2D/3D visuals, and hands-on problem-solving — all designed to reinforce understanding and exam confidence.
                </p>
            </div>

            {/* Join Us CTA styling */}
            <div className="bg-gradient-to-r from-primary/10 to-violet-500/10 rounded-2xl p-8 border border-primary/20 text-center space-y-4">
                <Award className="mx-auto text-primary mb-2" size={32} />
                <h3 className="text-xl font-bold text-text-primary">Join Mathinova’s Engineering Mathematics Program</h3>
                <p className="text-text-secondary max-w-2xl mx-auto">
                    Make Solved PYQs your strongest learning ally. Experience a methodical, exam-oriented, and application-driven approach that helps you understand deeply, solve confidently, and excel consistently in your VTU journey.
                </p>
            </div>
        </div>
    );
};

export default CourseDescription;
