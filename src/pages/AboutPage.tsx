import React, { useEffect } from 'react';
import GlassCard from '../components/GlassCard';
import { Target, Lightbulb, Users, Phone, Mail, MapPin, Gauge, ShieldCheck, Zap } from 'lucide-react';
import useTitle from '../hooks/useTitle';

const AboutPage: React.FC = () => {
    useTitle('About Us | Mathinova');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-bg-obsidian pt-32 pb-20">
            {/* Background Decor */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px]" />
            </div>

            <div className="container relative z-10">
                <div className="max-w-4xl mx-auto space-y-16">
                    {/* Header */}
                    <div className="text-center space-y-6">
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-text-primary">
                            About <span className="gradient-text">Mathinova</span>
                        </h1>
                        <p className="text-lg text-text-secondary leading-relaxed max-w-3xl mx-auto">
                            Welcome to Mathinova, the dynamic nexus of knowledge and innovation in the world of engineering mathematics. 
                            As the content creation and deployment wing of Innovent Engineering Solution, Mathinova is committed to reshaping 
                            the landscape of undergraduate engineering education.
                        </p>
                    </div>

                    {/* Mission / Legacy */}
                    <GlassCard className="p-8 md:p-12 border-white/5">
                        <p className="text-xl text-text-primary/90 leading-relaxed text-center font-medium">
                            With a legacy of over <span className="text-primary font-black">20+ years</span> in both Industry and Academic teaching, 
                            Innovent is on a mission to revolutionize engineering learning through inventive pedagogical approaches, 
                            fostering a stronger engineering culture from the grassroots level.
                        </p>
                    </GlassCard>

                    {/* Vision & Program */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <GlassCard className="p-8 space-y-4 border-white/5">
                            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                                <Target size={24} />
                            </div>
                            <h2 className="text-2xl font-bold text-text-primary">Our Vision</h2>
                            <p className="text-text-secondary leading-relaxed">
                                We envision a future where engineering education transcends traditional boundaries, where mathematical proficiency 
                                becomes not just a requirement, but a transformative foundation. Our goal is to nurture individuals who possess 
                                not only a deep understanding of mathematical concepts but also the ability to apply them creatively and critically.
                            </p>
                        </GlassCard>

                        <GlassCard className="p-8 space-y-4 border-white/5">
                            <div className="w-12 h-12 rounded-xl bg-amber-400/20 flex items-center justify-center text-amber-400">
                                <Lightbulb size={24} />
                            </div>
                            <h2 className="text-2xl font-bold text-text-primary">The Math Program</h2>
                            <p className="text-text-secondary leading-relaxed">
                                Central to our endeavour is our comprehensive "Engineering Math Program," meticulously designed to go beyond 
                                the confines of textbooks. This program is a testament to our commitment to academic rigor and the 
                                cultivation of mathematical thinking – a skill that lies at the core of modern sciences.
                            </p>
                        </GlassCard>
                    </div>

                    {/* Why Mathinova - Detailed Sections */}
                    <div className="space-y-8">
                        <h2 className="text-3xl font-black text-text-primary text-center">Why Mathinova?</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                {
                                    title: "Experience and Expertise",
                                    desc: "With a combined experience of over 20+ years, Innovent Engineering Solution boasts a wealth of knowledge that spans both Industry and Academia.",
                                    icon: ShieldCheck,
                                    color: "text-emerald-400"
                                },
                                {
                                    title: "Holistic Approach",
                                    desc: "We recognize that engineering education isn't just about passing exams; it's about nurturing a mindset that can navigate complex challenges.",
                                    icon: Zap,
                                    color: "text-blue-400"
                                },
                                {
                                    title: "Real-world Relevance",
                                    desc: "We equip students with mathematical prowess needed to craft physics-based models, interpret data, optimize solutions, and conduct design iterations.",
                                    icon: Gauge,
                                    color: "text-violet-400"
                                },
                                {
                                    title: "Engineering Culture Upliftment",
                                    desc: "Mathinova isn't just about teaching formulas; it's about instilling a passion for engineering and uplifting the culture at its grassroots.",
                                    icon: Users,
                                    color: "text-amber-400"
                                }
                            ].map((item, i) => (
                                <GlassCard key={i} className="p-6 border-white/5 group hover:bg-white/[0.04] transition-all">
                                    <div className="flex gap-5">
                                        <div className={`shrink-0 w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center ${item.color}`}>
                                            <item.icon size={20} />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="font-bold text-text-primary">{item.title}</h3>
                                            <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                </GlassCard>
                            ))}
                        </div>
                    </div>

                    {/* Contact Grid */}
                    <div className="pt-8">
                        <h2 className="text-3xl font-bold text-text-primary mb-8 text-center">Contact Us</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <GlassCard className="p-6 text-center space-y-4 border-white/5">
                                <Mail className="mx-auto text-primary" size={32} />
                                <div>
                                    <h3 className="font-bold text-text-primary">Email Support</h3>
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
                                    <h3 className="font-bold text-text-primary">Office</h3>
                                    <p className="text-text-secondary text-xs leading-tight">
                                        Flat No. 003 / 004, Paramount Regency, No. 5 Hennur Main Road, Bengaluru - 560084.
                                    </p>
                                </div>
                            </GlassCard>
                        </div>
                    </div>

                    {/* Footer Tagline */}
                    <div className="text-center pt-10">
                        <p className="text-text-muted font-black uppercase tracking-[0.3em] text-xs">
                            Ignite the Mathematician, Engineer the Future!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
