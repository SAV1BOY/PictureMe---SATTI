import React, { useState, useLayoutEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/Button';

export interface TourStep {
    targetSelector: string;
    title: string;
    content: string;
    position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

interface OnboardingTourProps {
    steps: TourStep[];
    isOpen: boolean;
    onClose: () => void;
}

const PADDING = 8;

export const OnboardingTour: React.FC<OnboardingTourProps> = ({ steps, isOpen, onClose }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

    const activeStep = steps[currentStep];

    const updateTargetRect = useCallback(() => {
        if (!activeStep) return;
        
        if (activeStep.targetSelector === 'body') {
            setTargetRect(null); // Center mode
            return;
        }

        try {
            const element = document.querySelector(activeStep.targetSelector);
            if (element) {
                setTargetRect(element.getBoundingClientRect());
            } else {
                // If element not found, try to recover or end tour
                console.warn(`Tour target not found: ${activeStep.targetSelector}`);
                if (currentStep < steps.length - 1) {
                    setCurrentStep(currentStep + 1);
                } else {
                    onClose();
                }
            }
        } catch(e) {
            console.error("Error finding tour target:", e);
            onClose();
        }
    }, [activeStep, currentStep, steps.length, onClose]);

    useLayoutEffect(() => {
        if (isOpen) {
            updateTargetRect();
            window.addEventListener('resize', updateTargetRect);
            window.addEventListener('scroll', updateTargetRect, true);
        }
        return () => {
            window.removeEventListener('resize', updateTargetRect);
            window.removeEventListener('scroll', updateTargetRect, true);
        };
    }, [isOpen, updateTargetRect]);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            onClose();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };
    
    const getTooltipPosition = () => {
        if (!targetRect || activeStep.position === 'center') {
             return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
        }

        const pos = activeStep.position || 'bottom';
        switch (pos) {
            case 'top':
                return { top: targetRect.top - PADDING, left: targetRect.left + targetRect.width / 2, transform: 'translate(-50%, -100%)' };
            case 'bottom':
                return { top: targetRect.bottom + PADDING, left: targetRect.left + targetRect.width / 2, transform: 'translateX(-50%)' };
            case 'left':
                return { top: targetRect.top + targetRect.height / 2, left: targetRect.left - PADDING, transform: 'translate(-100%, -50%)' };
            case 'right':
                return { top: targetRect.top + targetRect.height / 2, left: targetRect.right + PADDING, transform: 'translateY(-50%)' };
            default:
                 return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[1000]">
                    {/* Spotlight effect */}
                    <motion.div
                        key={`highlight-${currentStep}`}
                        className="absolute rounded-lg pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ 
                            opacity: 1,
                            boxShadow: '0 0 0 9999px rgba(12, 10, 9, 0.8)',
                            border: targetRect ? '2px dashed #a855f7' : 'none'
                        }}
                        exit={{ opacity: 0 }}
                        style={{
                            transition: 'top 0.3s, left 0.3s, width 0.3s, height 0.3s',
                            width: targetRect ? targetRect.width + PADDING * 2 : '0px',
                            height: targetRect ? targetRect.height + PADDING * 2 : '0px',
                            top: targetRect ? targetRect.top - PADDING : '50vh',
                            left: targetRect ? targetRect.left - PADDING : '50vw',
                        }}
                    />

                    {/* Tooltip */}
                    <motion.div
                        key={`tooltip-${currentStep}`}
                        className="absolute bg-zinc-900 rounded-xl p-6 border border-zinc-700 shadow-2xl w-full max-w-sm text-white"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1, ...getTooltipPosition() }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h3 className="text-xl font-bold text-purple-400 mb-3">{activeStep.title}</h3>
                        <p className="text-zinc-300 mb-6">{activeStep.content}</p>
                        
                        <div className="flex justify-between items-center">
                            <button onClick={onClose} className="text-sm text-zinc-500 hover:text-white transition-colors">Pular Tour</button>
                            
                            <div className="flex items-center gap-3">
                                {currentStep > 0 && <Button onClick={handlePrev}>Anterior</Button>}
                                <Button onClick={handleNext} primary>
                                    {currentStep === steps.length - 1 ? 'Concluir' : 'Próximo'}
                                </Button>
                            </div>
                        </div>
                         <div className="flex justify-center gap-2 mt-6">
                            {steps.map((_, index) => (
                                <div key={index} className={`w-2.5 h-2.5 rounded-full transition-colors ${index === currentStep ? 'bg-purple-500' : 'bg-zinc-700'}`}></div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};