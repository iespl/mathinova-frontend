import React, { useState, useEffect } from 'react';
import GlassCard from '../components/GlassCard';
import { ChevronDown, HelpCircle } from 'lucide-react';
import useTitle from '../hooks/useTitle';

const FAQPage: React.FC = () => {
    useTitle('FAQs | Mathinova');
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const faqs = [
        {
            q: "Why should the university/student pay for another platform when there are free sources like YouTube?",
            a: "Free sources often provide fragmented or inconsistent content, lack structured learning paths, and fail to address specific university requirements. Our program is delivered by academic and industry experts with over 20+ years of experience, ensuring a cohesive, distract-free, and comprehensive learning journey specifically aligned to your syllabus."
        },
        {
            q: "Quickly summarize the key highlights of the Engineering Math program?",
            a: "1. Comprehensive Curriculum aligned to VTU, KTU, Anna University, etc.\n2. Structured Learning from foundational to advanced concepts.\n3. Expert Instruction with practical industry relevance.\n4. Pedagogical Innovations including graphs, animations, and visualizations.\n5. Concept Testing for holistic reinforcement.\n6. Dedicated App/LMS experience."
        },
        {
            q: "What are the payment options available?",
            a: "Payments are facilitated by Razorpay, supporting Credit Cards, Debit Cards, and all major UPI handles like Google Pay and Paytm."
        },
        {
            q: "Who are these courses for?",
            a: "Our programs cater to Engineering Undergraduates across India. The courses are customized and aligned to all major universities for ease of absorption."
        },
        {
            q: "How do I raise tickets in case of doubts in the subject matter?",
            a: "The LMS platform provides a dedicated forum for discussions. Doubts are captured weekly and addressed via dedicated doubt-clarification videos. For technical support, email us at support@mathinova.com."
        },
        {
            q: "Will I have access beyond the license period?",
            a: "Access duration depends on your chosen subscription. Please refer to your specific course license for exact validity days (e.g., 180 days, 365 days)."
        },
        {
            q: "Is Engineering Mathematics available for CS, EEE, and other branches?",
            a: "Yes! We are constantly expanding. Updates regarding new programs for various branches are pushed to all registered users via app notifications and email."
        }
    ];

    return (
        <div className="min-h-screen bg-bg-obsidian pt-32 pb-20">
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 center w-full h-1/2 bg-blue-500/5 blur-[150px] rounded-full" />
            </div>

            <div className="container relative z-10">
                <div className="max-w-3xl mx-auto space-y-12">
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-4">
                            <HelpCircle size={14} /> Help Center
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-text-primary">
                            Frequently Asked <span className="gradient-text">Questions</span>
                        </h1>
                        <p className="text-text-secondary">
                            Everything you need to know about our learning platform.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, idx) => {
                            const isOpen = openIndex === idx;
                            return (
                                <GlassCard
                                    key={idx}
                                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                                    className={`rounded-3xl overflow-hidden transition-all duration-300 border-white/5 ${isOpen ? 'bg-white/[0.08] ring-1 ring-primary/30' : 'hover:bg-white/[0.04]'}`}
                                >
                                    <div className="p-6 flex items-center justify-between text-left cursor-pointer">
                                        <span className={`text-[17px] font-bold transition-colors ${isOpen ? 'text-primary' : 'text-text-primary group-hover:text-primary'}`}>
                                            {faq.q}
                                        </span>
                                        <ChevronDown
                                            size={20}
                                            className={`shrink-0 text-text-muted transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`}
                                        />
                                    </div>
                                    <div
                                        className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
                                        style={{ overflow: 'hidden' }}
                                    >
                                        <div className="px-6 pb-6 text-text-secondary leading-relaxed whitespace-pre-line border-t border-white/5 pt-4 font-medium">
                                            {faq.a}
                                        </div>
                                    </div>
                                </GlassCard>
                            );
                        })}
                    </div>

                    <GlassCard className="mt-[30px] p-8 text-center bg-primary/5 border-primary/20">
                        <h3 className="text-xl font-bold text-text-primary mb-2">Still have questions?</h3>
                        <p className="text-text-secondary mb-6">If you cannot find the answer you are looking for, please feel free to reach out.</p>
                        <a
                            href="mailto:support@mathinova.com"
                            className="inline-flex items-center gap-2 px-8 py-3 bg-primary hover:bg-primary-hover text-text-primary font-bold rounded-xl transition-all shadow-lg shadow-primary/20"
                        >
                            Email Support
                        </a>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
};

export default FAQPage;
