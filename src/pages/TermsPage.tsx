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
                        <p className="text-text-muted font-medium">Please read these terms and conditions carefully before using Our Service.</p>
                    </div>

                    <GlassCard className="p-8 md:p-12 border-white/5 leading-relaxed">
                        <div className="prose-legal space-y-10 text-text-secondary">
                            <p>
                                The Terms and Conditions contained herein shall apply to any person (“User”) using the services of Mathinova 
                                for making payment through an online payment gateway service (“Service”) offered by Payment Gateway Service provider, 
                                through Mathinova website https://mathinova.com.
                            </p>

                            <section className="space-y-6">
                                <h2 className="text-2xl font-bold text-text-primary border-b border-white/10 pb-2">General Terms</h2>
                                <div className="space-y-4">
                                    <ul className="list-decimal pl-6 space-y-4">
                                        <li>Once a User has accepted these Terms and Conditions, he/ she may register and avail the Services.</li>
                                        <li>Mathinova’ rights, obligations, undertakings shall be subject to the laws in force in India. Each User accepts and agrees that the provision of details of his/ her use of the Website to regulators or police or to any other third party in order to resolve disputes or complaints which relate to the Website shall be at the absolute discretion of Mathinova.</li>
                                        <li>If any part of these Terms and Conditions are determined to be invalid or unenforceable pursuant to applicable law then the invalid provision will be deemed superseded by a valid provision that most closely matches the intent of the original provision.</li>
                                        <li>The entries in the books of Mathinova and/or the Payment Service Providers regard to transactions covered under these Terms and Conditions shall be binding on the User.</li>
                                    </ul>
                                </div>
                            </section>

                            <section className="space-y-6">
                                <h2 className="text-2xl font-bold text-text-primary border-b border-white/10 pb-2">Refund & Chargeback</h2>
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-text-primary/90">Refund for Charge Back Transaction</h3>
                                    <p>
                                        In the event there is any claim for charge back by the User, such User shall immediately approach 
                                        Mathinova alone. No claims for refund shall be made to the Payment Service Provider(s).
                                    </p>
                                    <h3 className="text-xl font-bold text-text-primary/90 mt-6">Refund for fraudulent/duplicate transaction(s)</h3>
                                    <p>
                                        The User shall directly contact Mathinova for any fraudulent transaction(s) on account of misuse 
                                        of Card/ Bank details. Issue shall be addressed by Mathinova alone in line with their policies.
                                    </p>
                                </div>
                            </section>

                            <section className="space-y-6">
                                <h2 className="text-2xl font-bold text-text-primary border-b border-white/10 pb-2">Limitation of Liability</h2>
                                <p>
                                    Mathinova has made this Service available as a matter of convenience. Mathinova and/or the Payment Service 
                                    Providers shall not be liable for any inaccuracy, error or delay in, or omission of any data, information or message.
                                </p>
                            </section>

                            <section className="space-y-6">
                                <h2 className="text-2xl font-bold text-text-primary border-b border-white/10 pb-2">Ownership & Intellectual Property</h2>
                                <p>
                                    All Training Material is owned by Mathinova. When you are given access to the Training Material, 
                                    you are granted a non-exclusive, non-transferable, revocable license to use the Training Material. 
                                    No Training Material may be copied, reproduced, or displayed in any way without Mathinova’ prior permission.
                                </p>
                            </section>

                            <section className="space-y-6">
                                <h2 className="text-2xl font-bold text-text-primary border-b border-white/10 pb-2">Contact Details</h2>
                                <div className="bg-white/5 p-6 rounded-2xl border border-white/5 space-y-2">
                                    <p><strong>Email:</strong> support@innoventengg.com</p>
                                    <p><strong>Phone:</strong> 9448485002</p>
                                    <p><strong>Address:</strong> Flat No. 003 / 004, paramount regency, No. 5 Hennur Main Road, Bengaluru - 560084.</p>
                                </div>
                            </section>
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
};

export default TermsPage;
