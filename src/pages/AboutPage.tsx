import React, { useEffect } from 'react';
import GlassCard from '../components/GlassCard';
import { Target, Lightbulb, Users, Phone, Mail, MapPin } from 'lucide-react';
import useTitle from '../hooks/useTitle';

const AboutPage: React.FC = () => {
    useTitle('About Us | Mathinova');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const sections = [
        {
            title: "Our Vision",
            icon: Target,
            content: "At Mathinova, we envision a future where engineering education transcends traditional boundaries, where mathematical proficiency becomes not just a requirement, but a transformative foundation. With an unwavering dedication to engineering excellence, we strive to empower students with the tools they need to thrive in a rapidly evolving technological world.",
            color: "text-blue-400"
        },
        {
            title: "The Math Program",
            icon: Lightbulb,
            content: "Central to our endeavour is our comprehensive \"Engineering Math Program,\" meticulously designed to go beyond the confines of textbooks. This program is a testament to our commitment to academic rigor and the cultivation of mathematical thinking – a skill that lies at the core of modern sciences and product development.",
            color: "text-amber-400"
        },
        {
            title: "Why Mathinova?",
            icon: Users,
            content: "Mathinova stands as a beacon of transformation in the realm of engineering mathematics. With over 20+ years of combined experience, we bridge the gap between Industry and Academia. We foster critical thinking, problem-solving, and creative application, equipping students with the prowess needed to craft physics-based models and optimize solutions.",
            color: "text-emerald-400"
        }
    ];

    return (
        <div className="min-h-screen bg-bg-obsidian pt-32 pb-20">
            {/* Background Decor */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px]" />
            </div>

            <div className="container relative z-10">
                <div className="max-w-4xl mx-auto space-y-12">
                    {/* Header */}
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-text-primary">
                            Innovating <span className="gradient-text">Engineering Math</span>
                        </h1>
                        <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                            Ignite the Mathematician, Engineer the Future.
                        </p>
                    </div>

                    {/* Core Sections */}
                    <div className="grid gap-6">
                        {sections.map((sec, idx) => (
                            <GlassCard key={idx} className="p-8 group hover:bg-white/[0.04] transition-all duration-300 border-white/5">
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 ${sec.color}`}>
                                        <sec.icon size={28} />
                                    </div>
                                    <div className="space-y-3">
                                        <h2 className="text-2xl font-bold text-text-primary">{sec.title}</h2>
                                        <p className="text-text-secondary leading-relaxed text-lg">
                                            {sec.content}
                                        </p>
                                    </div>
                                </div>
                            </GlassCard>
                        ))}
                    </div>

                    {/* Contact Grid */}
                    <div className="pt-8">
                        <h2 className="text-3xl font-bold text-text-primary mb-8 text-center">Get in Touch</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <GlassCard className="p-6 text-center space-y-4 border-white/5">
                                <Mail className="mx-auto text-primary" size={32} />
                                <div>
                                    <h3 className="font-bold text-text-primary">Email Us</h3>
                                    <p className="text-text-secondary text-sm">support@mathinova.com</p>
                                </div>
                            </GlassCard>
                            <GlassCard className="p-6 text-center space-y-4 border-white/5">
                                <Phone className="mx-auto text-emerald-400" size={32} />
                                <div>
                                    <h3 className="font-bold text-text-primary">Call Us</h3>
                                    <p className="text-text-secondary text-sm">+91 9448485002</p>
                                </div>
                            </GlassCard>
                            <GlassCard className="p-6 text-center space-y-4 border-white/5">
                                <MapPin className="mx-auto text-amber-400" size={32} />
                                <div>
                                    <h3 className="font-bold text-text-primary">Location</h3>
                                    <p className="text-text-secondary text-sm">Bengaluru, Karnataka - 560084</p>
                                </div>
                            </GlassCard>
                        </div>
                    </div>

                    {/* Footer Tagline */}
                    <div className="text-center pt-10">
                        <div className="inline-block px-6 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-black uppercase tracking-widest text-xs">
                            Since 2023
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
