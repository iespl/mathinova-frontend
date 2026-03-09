import React, { useState, useEffect } from 'react';
import api from '../api/client.js';
import GlassCard from '../components/GlassCard.js';
import Button from '../components/Button.js';
import Input from '../components/Input.js';

const AdminDashboard: React.FC = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refundReason, setRefundReason] = useState('');
    const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await api.get('/admin/orders');
                setOrders(data);
            } catch (err) {
                console.error('Failed to fetch orders', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const handleRefund = async (paymentId: string) => {
        if (!refundReason) return alert('Refund reason is required');
        setIsProcessing(true);
        try {
            await api.post(`/admin/refunds/${paymentId}`, { reason: refundReason });
            alert('Refund processed successfully');
            // Refresh orders
            const { data } = await api.get('/admin/orders');
            setOrders(data);
            setSelectedPaymentId(null);
            setRefundReason('');
        } catch (err: any) {
            alert(err.response?.data?.message || 'Refund failed');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div style={{ padding: '2rem 0' }}>
            <header style={{ marginBottom: '3rem' }}>
                <h1 className="gradient-text" style={{ fontSize: '3rem' }}>Admin Console</h1>
                <p className="text-text-secondary">System-wide order auditing and refund management.</p>
            </header>

            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '4rem' }}>Loading Audit Trail...</div>
            ) : (
                <GlassCard style={{ padding: '0', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: 'var(--bg-glass)', borderBottom: '1px solid var(--border-glass)' }}>
                            <tr>
                                <th style={{ padding: '1.25rem', textAlign: 'left', color: 'var(--text-secondary)' }}>ID</th>
                                <th style={{ padding: '1.25rem', textAlign: 'left', color: 'var(--text-secondary)' }}>Customer</th>
                                <th style={{ padding: '1.25rem', textAlign: 'left', color: 'var(--text-secondary)' }}>Status</th>
                                <th style={{ padding: '1.25rem', textAlign: 'right', color: 'var(--text-secondary)' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order: any) => (
                                <tr key={order.id} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                                    <td style={{ padding: '1.25rem' }}>{order.id.substring(0, 8)}...</td>
                                    <td style={{ padding: '1.25rem' }}>{order.email}</td>
                                    <td style={{ padding: '1.25rem' }}>
                                        <span style={{
                                            padding: '4px 10px',
                                            borderRadius: '12px',
                                            fontSize: '0.75rem',
                                            background: order.status === 'paid' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                            color: order.status === 'paid' ? '#10B981' : '#EF4444'
                                        }}>
                                            {order.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.25rem', textAlign: 'right' }}>
                                        {order.status === 'paid' && order.payments?.[0] && (
                                            <Button
                                                variant="glass"
                                                size="sm"
                                                onClick={() => setSelectedPaymentId(order.payments[0].id)}
                                            >
                                                Refund
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </GlassCard>
            )}

            {selectedPaymentId && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
                    zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <GlassCard style={{ maxWidth: '450px', width: '100%' }}>
                        <h3 className="gradient-text mb-4" style={{ fontSize: '1.5rem' }}>Process Refund</h3>
                        <p className="text-sm text-text-secondary mb-6">
                            This action is atomic and irreversible. It will revoke course access and log the transaction.
                        </p>
                        <Input
                            label="Reason for Refund"
                            placeholder="Student request / Accidental purchase"
                            value={refundReason}
                            onChange={(e) => setRefundReason(e.target.value)}
                            required
                        />
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                            <Button style={{ flex: 1 }} isLoading={isProcessing} onClick={() => handleRefund(selectedPaymentId)}>
                                Confirm Refund
                            </Button>
                            <Button variant="glass" style={{ flex: 1 }} onClick={() => setSelectedPaymentId(null)}>
                                Cancel
                            </Button>
                        </div>
                    </GlassCard>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
