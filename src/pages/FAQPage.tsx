import React, { useState, useEffect } from 'react';
import GlassCard from '../components/GlassCard';
import { ChevronDown, HelpCircle, Mail } from 'lucide-react';
import useTitle from '../hooks/useTitle';

const FAQPage: React.FC = () => {
    useTitle('FAQs | Mathinova');
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const faqs = [
        {
            q: "Besides curriculum, there are multiple free sources like YouTube. Why should I pay?",
            a: "Free sources often provide fragmented content, lack structured learning paths, and fail to address specific challenges of engineering students. Our program is delivered by experts with 20+ years of experience, providing depth, coherence, and professional pedagogical innovations like concept testing and visualization."
        },
        {
            q: "Quickly summarize the key highlights of the Engineering Math program?",
            a: "• Comprehensive Curriculum aligned to Universities (VTU, KTU, Anna, JNTU, etc.)\n• Structured Learning paths\n• Expert Instruction with practical relevance\n• Pedagogical Innovations (Graphs, Animations)\n• Concept Testing & Verification\n• Dedicated LMS & App experience\n• Scientifically designed assessments (20+ Model papers, 300+ checks)"
        },
        {
            q: "What are the payment options available?",
            a: "Payments are facilitated by Razorpay, including Credit Cards, Debit Cards, and UPI (Google Pay, Paytm, PhonePe, etc.)."
        },
        {
            q: "Who are these courses for?",
            a: "Our Engineering Mathematics programs cater to Engineering Undergraduates. The courses are customized and aligned to all major universities across India."
        },
        {
            q: "Is the discount a limited period offer?",
            a: "Yes, the special discount is made available only for the first 30,000 customers, after which actual prices will apply."
        },
        {
            q: "Are the prices fixed for individual buyers and businesses alike?",
            a: "Prices are fixed for individual buyers. Bulk purchases over 500 licenses are negotiable."
        },
        {
            q: "Will I be able to have access to the product beyond the license period?",
            a: "Access duration depends on the subscription option chosen. Please refer to the pricing sheet for specific durations."
        },
        {
            q: "Will I get any freebies with the product?",
            a: "Yes! You get access to live webinars, updated lectures, discount coupons for future purchases, and doubt clarification sessions."
        },
        {
            q: "How do I raise tickets for doubts or technical issues?",
            a: "The LMS provides a forum for discussions. Doubts are addressed weekly via dedicated videos. For technical issues, email: support@mathinova.com."
        },
        {
            q: "How many universities are the programs currently aligned to?",
            a: "Currently aligned to VTU (Karnataka) for Mechanical and allied branches. Expansion to major Indian universities is ongoing."
        },
        {
            q: "Is Engineering Mathematics available for CS, EEE, EC, IT branches?",
            a: "Updates regarding future programs for more branches will reach registered users via the mobile app and email as they become ready."
        },
        {
            q: "Can I audit the course?",
            a: "Yes, many free videos have been made available for review to help you understand our value proposition."
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
                            Everything you need to know about Mathinova.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, idx) => {
                            const isOpen = openIndex === idx;
                            return (
                                <GlassCard
                                    key={idx}
                                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                                    className={`rounded-2xl overflow-hidden transition-all duration-300 border-white/5 ${isOpen ? 'bg-white/[0.08] ring-1 ring-primary/30' : 'hover:bg-white/[0.04]'}`}
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
                        <p className="text-text-secondary mb-6">Reach out to us if you need more information.</p>
                        <a
                            href="mailto:support@mathinova.com"
                            className="inline-flex items-center gap-2 px-8 py-3 bg-primary hover:bg-primary-hover text-text-primary font-bold rounded-xl transition-all"
                        >
                            <Mail size={18} /> Email Support
                        </a>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
};

export default FAQPage;
