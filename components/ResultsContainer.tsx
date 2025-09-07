import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { PhotoCard } from './PhotoCard';
import type { GeneratedImage, AppStatus, Template, TemplateId } from '../types';

interface ResultsContainerProps {
    title: string;
    images: GeneratedImage[];
    status: AppStatus;
    progress?: number;
    isPromptResult?: boolean;
    onRegenerate: (index: number, source: 'theme' | 'prompt') => void;
    onCreateVariations: (index: number, source: 'theme' | 'prompt', baseImageUrl?: string) => void;
    onUseAsBase: (imageUrl: string) => void;
    onDownload: (imageUrl: string, label: string, ratio: string, template: TemplateId) => void;
    onEdit: (index: number, source: 'theme' | 'prompt', variationIndex?: number) => void;
}

export const ResultsContainer = forwardRef<HTMLDivElement, ResultsContainerProps>(({ title, images, status, progress, isPromptResult = false, ...actions }, ref) => {
    
    const isLoading = isPromptResult ? status === 'prompt_loading' : status === 'loading';
    
    if (!isLoading && images.length === 0) {
        if (isPromptResult && status === 'loading') return null; // Hide prompt results if theme generation is happening
        if (!isPromptResult && status === 'prompt_loading') return null; // Hide theme results if prompt generation is happening
        if (status === 'setting_up') return null;
        return null;
    }

    return (
        <div className="mt-16" ref={ref}>
            <h2 className="text-3xl font-bold text-white mb-8">{title}</h2>
            
            {status === 'setting_up' && !isPromptResult && (
                 <div className="text-center my-20 flex flex-col items-center p-10 bg-zinc-900/70 rounded-2xl">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mb-6"></div>
                    <p className="text-2xl text-purple-400 font-semibold tracking-wider italic">Arrumando o cabelo e ligando os lasers...</p>
                    <p className="text-zinc-400 mt-2">Gerando um estilo de sessão de fotos dos anos 80 totalmente tubular!</p>
                </div>
            )}
            
            {isLoading && (
                <div className="w-full max-w-4xl mx-auto mb-8 text-center">
                    <div className="bg-zinc-800 rounded-full h-3 overflow-hidden shadow-md">
                        <motion.div
                            className="bg-purple-500 h-3 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                    <p className="text-zinc-400 mt-4 text-sm">Por favor, mantenha esta janela aberta enquanto suas fotos são geradas.</p>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8">
                {images.map((img, index) => {
                     const isPolaroid = ['decades'].includes(img.template || '');
                     const showLabel = !['headshots', 'eightiesMall', 'styleLookbook', 'figurines'].includes(img.template || '') && !isPromptResult;
                    return (
                        <PhotoCard
                            key={`${img.id}-${index}`}
                            image={img}
                            index={index}
                            isPolaroid={isPolaroid}
                            showLabel={showLabel}
                            {...actions}
                        />
                    );
                })}
            </div>
        </div>
    );
});