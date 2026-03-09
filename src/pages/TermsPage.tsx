import React, { useEffect } from 'react';
import GlassCard from '../components/GlassCard';
import useTitle from '../hooks/useTitle';

const TermsPage: React.FC = () => {
    useTitle('Terms & Conditions | Mathinova');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-bg-obsidian pt-32 pb-20">
            <div className="container">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-10 text-center">
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-text-primary mb-4">Terms & <span className="gradient-text">Conditions</span></h1>
                        <p className="text-text-muted font-medium">Please read these terms carefully before using our service.</p>
                    </div>

                    <GlassCard className="p-10 border-white/5 leading-relaxed">
                        <div className="prose-legal space-y-8 text-text-secondary">
                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold text-text-primary underline decoration-primary/30 underline-offset-8">General Terms</h2>
                                <p>The Terms and Conditions contained herein shall apply to any person (“User”) using the services of Mathinova for making payment through an online payment gateway service. Each User is therefore deemed to have read and accepted these Terms and Conditions.</p>
                                <p>Mathinova's rights and obligations shall be subject to the laws in force in India. Any disputes are subject to the exclusive jurisdiction of the courts in Bengaluru.</p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold text-text-primary">Online Payments</h2>
                                <p>Once a User has accepted these Terms and Conditions, he/she may register and avail the Services. Mathinova utilizes Razorpay for secure payment processing.</p>
                                <ul className="list-decimal pl-6 space-y-2">
                                    <li>Users are responsible for ensuring that the debit/credit card details provided are correct and accurate.</li>
                                    <li>The User warrants that they are fully and lawfully entitled to use the nominated bank account/card.</li>
                                    <li>Mathinova assumes no liability for technical failures or session timeouts during the payment process.</li>
                                </ul>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold text-text-primary">Refund Policy</h2>
                                <p>In the event of a duplicate or fraudulent transaction, the User shall immediately approach Mathinova for any claim details. No claims for refund shall be made to the Payment Service Provider directly.</p>
                                <p>Approved refunds are processed only via the original payment gateway or as deemed appropriate by Mathinova management.</p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold text-text-primary">Limitation of Liability</h2>
                                <p>Mathinova disclaims any claim or liability arising out of the provision of this Service. The User agrees that Mathinova or any of its employees will not be held liable for any loss or damages arising from the use of, or reliance upon the information contained on the Website.</p>
                            </section>

                            <section className="space-y-4 border-t border-white/10 pt-8">
                                <h2 className="text-xl font-bold text-text-primary">Contact Information</h2>
                                <p>Support Email: support@innoventengg.com</p>
                                <p>Phone: +91 9448485002</p>
                                <p>Address: Flat No. 003 / 004, Paramount Regency, No. 5 Hennur Main Road, Bengaluru - 560084.</p>
                            </section>
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
};

export default TermsPage;
