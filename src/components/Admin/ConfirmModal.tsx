import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import Button from '../Button.js';
import TrashIcon from '../../assets/trash.svg';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    confirmVariant?: 'primary' | 'secondary' | 'glass' | 'outline' | 'ghost';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Delete',
    confirmVariant = 'primary'
}) => {
    // Render nothing on SSR or if not open
    if (typeof document === 'undefined') return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        style={{ backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
                    />

                    {/* Modal Container */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
                        style={{
                            backgroundColor: '#ffffff',
                            background: '#ffffff',
                            opacity: 1,
                            zIndex: 100001,
                            border: '1px solid #e2e8f0'
                        }}
                    >
                        <div className="p-8 text-center" style={{ backgroundColor: '#ffffff' }}>
                            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <img src={TrashIcon} alt="" style={{ width: '24px', height: '24px' }} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2 underline decoration-red-500/50 underline-offset-8">{title}</h3>
                            <p className="text-slate-700 font-medium mb-8 leading-relaxed text-lg">
                                {message}
                            </p>
                            <div className="flex gap-4 justify-center">
                                <Button
                                    variant="glass"
                                    onClick={onClose}
                                    className="min-w-[130px] !bg-slate-100 !text-slate-900 border border-slate-200 shadow-sm"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant={confirmVariant}
                                    onClick={() => {
                                        onConfirm();
                                        onClose();
                                    }}
                                    className="min-w-[130px]"
                                    style={{
                                        background: confirmVariant === 'primary' ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : undefined,
                                        boxShadow: confirmVariant === 'primary' ? '0 4px 15px 0 rgba(239, 68, 68, 0.4)' : undefined
                                    }}
                                >
                                    {confirmText}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default ConfirmModal;
