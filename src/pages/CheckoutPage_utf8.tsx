import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/client.js';
import { useAuth } from '../context/AuthContext.js';
import Input from '../components/Input.js';
import Button from '../components/Button.js';
import GlassCard from '../components/GlassCard.js';

const CheckoutPage: React.FC = () => {
    const { courseId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [step, setStep] = useState(user ? 2 : 1);
    const [email, setEmail] = useState(user?.email || '');
    const [couponCode, setCouponCode] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');

    // Hardening: Check if already enrolled
    useEffect(() => {
        if (user && courseId) {
            const checkEnrollment = async () => {
                try {
                    const { data } = await api.get('/student/courses');
                    const isEnrolled = data.some((e: any) => e.courseId === courseId);
                    if (isEnrolled) {
                        navigate(`/learn/${courseId}`);
                    }
                } catch (err) {
                    console.error('Eligibility check failed', err);
                }
            };
            checkEnrollment();
        }
    }, [user, courseId, navigate]);

    const handleNext = () => {
        if (!email) return setError('Email is required');
        setStep(2);
    };

    const handleCheckout = async () => {
        setIsProcessing(true);
        setError('');

        try {
            // Step 1: Create Order
            const { data: order } = await api.post('/commerce/checkout', {
                courseId,
                email,
                couponCode: couponCode || undefined,
                tempUserId: !user ? `guest_${Date.now()}` : undefined
            });

            // Step 2: Simulate Payment Success via Webhook
            const txnId = `txn_${Date.now()}`;
            await api.post('/commerce/webhook', {
                orderId: order.id,
                gatewayReference: txnId,
                amount: Number(order.total),
                method: 'mock_card',
                status: 'success'
            });

            // Hardening: Post-payment redirect to dashboard
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Checkout failed');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="container" style={{ padding: '4rem 0', display: 'flex', justifyContent: 'center' }}>
            <GlassCard style={{ maxWidth: '600px', width: '100%' }}>
                <h2 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '2rem' }}>Secure Checkout</h2>

                {step === 1 && (
                    <div>
                        <h3 style={{ marginBottom: '1rem' }}>1. Identity</h3>
                        <p className="text-sm text-text-secondary mb-4">Enter your email to proceed as a guest or login.</p>
                        <Input
                            label="Email"
                            placeholder="john@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Button className="w-full mt-4" onClick={handleNext}>Continue to Payment</Button>
                    </div>
                )}

                {step === 2 && (
                    <div>
                        <h3 style={{ marginBottom: '1.5rem' }}>2. Order Summary</h3>
                        <div className="bg-bg-glass p-4 rounded-lg mb-6 border border-border-glass">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span className="text-text-secondary">Course ID</span>
                                <span className="font-bold">{courseId}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span className="text-text-secondary">Customer</span>
                                <span className="font-bold">{email}</span>
                            </div>
                        </div>

                        <Input
                            label="Coupon Code (Optional)"
                            placeholder="DISCOUNT10"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                        />

                        {error && <p className="text-xs text-red-400 mb-4">{error}</p>}

                        <Button className="w-full mt-4" isLoading={isProcessing} onClick={handleCheckout}>
                            Confirm & Pay
                        </Button>
                        <Button variant="glass" className="w-full mt-3" onClick={() => setStep(1)} disabled={!!user}>
                            Back
                        </Button>
                    </div>
                )}
            </GlassCard>
        </div>
    );
};

export default CheckoutPage;
