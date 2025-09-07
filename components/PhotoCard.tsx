import React from 'react';
import { PhotoDisplay } from './ui/PhotoDisplay';
import { Button } from './ui/Button';
import type { GeneratedImage, TemplateId } from '../types';

const SkeletonLoader: React.FC<{ className: string }> = ({ className }) => (
    <div className={`animate-pulse bg-zinc-800 ${className}`}></div>
);

const LoadingCard: React.FC<{ label: string; isPolaroid?: boolean; showLabel?: boolean }> = ({ label, isPolaroid = true, showLabel = true }) => {
    const containerClass = isPolaroid ? 'relative bg-gray-100 p-3 pb-12 shadow-md' : 'pb-4 bg-zinc-900 rounded-xl shadow-md';
    const loaderClass = isPolaroid ? 'aspect-square' : 'aspect-[3/4] rounded-t-xl';
    const textColor = isPolaroid ? 'text-zinc-600' : 'text-zinc-400';

    return (
        <div className={containerClass}>
            <SkeletonLoader className={loaderClass} />
            {isPolaroid && showLabel && (
                <div className="absolute bottom-3 left-0 right-0 flex justify-center">
                    <SkeletonLoader className="h-6 w-3/4 rounded-md bg-gray-300" />
                </div>
            )}
            {!isPolaroid && showLabel && (
                <div className="mt-3 flex justify-center">
                    <SkeletonLoader className="h-5 w-1/2 rounded-md" />
                </div>
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-400"></div>
                <p className={`mt-4 font-semibold ${textColor}`}>Gerando...</p>
            </div>
        </div>
    );
};

const ErrorCard: React.FC<{ label: string; onRegenerate: () => void; isPolaroid?: boolean; showLabel?: boolean }> = ({ label, onRegenerate, isPolaroid = true, showLabel = true }) => {
    const containerClass = isPolaroid ? 'relative group bg-gray-100 p-3 pb-12 shadow-md' : 'pb-4 bg-zinc-900 rounded-xl shadow-md';
    const errorContainerClass = isPolaroid ? 'aspect-square bg-gray-200 border-2 border-dashed border-red-500/50' : 'rounded-t-xl bg-zinc-800 border-2 border-dashed border-red-500/50 aspect-[3/4]';
    const textClass = isPolaroid ? 'text-center mt-4 font-caveat text-3xl text-gray-900 absolute bottom-3 left-0 right-0' : 'text-center mt-3 text-lg font-semibold text-gray-300 px-3';

    return (
        <div className={`relative transition-all duration-500 ease-in-out group ${containerClass}`}>
            <div className={`flex flex-col items-center justify-center text-center p-4 ${errorContainerClass}`}>
                <p className="text-red-400 font-medium mb-4">Falha na geração</p>
                <Button onClick={onRegenerate} primary>Tentar Novamente</Button>
            </div>
            {showLabel && <p className={textClass}>{label}</p>}
        </div>
    );
};

interface PhotoCardProps {
    image: GeneratedImage;
    index: number;
    isPolaroid?: boolean;
    showLabel?: boolean;
    onRegenerate: (index: number, source: 'theme' | 'prompt') => void;
    onCreateVariations: (index: number, source: 'theme' | 'prompt', baseImageUrl?: string) => void;
    onUseAsBase: (imageUrl: string) => void;
    onDownload: (imageUrl: string, label: string, ratio: string, template: TemplateId) => void;
    onEdit: (index: number, source: 'theme' | 'prompt', variationIndex?: number) => void;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({ image, index, isPolaroid, showLabel, ...actions }) => {
    let content;
    switch (image.status) {
        case 'success':
            content = (
                <PhotoDisplay
                    label={image.id}
                    imageUrl={image.imageUrl!}
                    onRegenerate={() => actions.onRegenerate(index, image.source)}
                    onCreateVariations={() => actions.onCreateVariations(index, image.source)}
                    onUseAsBase={actions.onUseAsBase}
                    onDownload={actions.onDownload}
                    onEdit={() => actions.onEdit(index, image.source)}
                    isEditing={image.isEditing}
                    isPolaroid={isPolaroid}
                    showLabel={showLabel}
                    index={index}
                    template={image.template || null}
                />
            );
            break;
        case 'failed':
            content = (
                <ErrorCard
                    label={image.id}
                    onRegenerate={() => actions.onRegenerate(index, image.source)}
                    isPolaroid={isPolaroid}
                    showLabel={showLabel}
                />
            );
            break;
        case 'pending':
        default:
            content = (
                <LoadingCard
                    label={image.id}
                    isPolaroid={isPolaroid}
                    showLabel={showLabel}
                />
            );
            break;
    }

    return (
        <div key={`${image.id}-${index}-wrapper`} className="space-y-4">
            {content}
            {(image.variations?.length > 0 || image.isGeneratingVariations) && (
                <div className="ml-8 pl-4 border-l-2 border-purple-800/50">
                    <h4 className="text-sm font-bold text-gray-400 mb-2">Variações</h4>
                    <div className="grid grid-cols-2 gap-4">
                        {image.isGeneratingVariations && (!image.variations || image.variations.length === 0) && (
                            <>
                                <LoadingCard isPolaroid={false} showLabel={false} label="variation 1"/>
                                <LoadingCard isPolaroid={false} showLabel={false} label="variation 2"/>
                            </>
                        )}
                        {image.variations?.map((variation, vIndex) => (
                             <PhotoDisplay
                                key={`variation-${index}-${vIndex}`}
                                label={variation.id}
                                imageUrl={variation.imageUrl!}
                                onDownload={actions.onDownload}
                                onRegenerate={() => {}} // Variations cannot be regenerated from here.
                                onUseAsBase={actions.onUseAsBase}
                                onCreateVariations={() => actions.onCreateVariations(index, image.source, variation.imageUrl!)}
                                onEdit={() => actions.onEdit(index, image.source, vIndex)}
                                isEditing={variation.isEditing}
                                isPolaroid={false}
                                index={vIndex}
                                showLabel={true}
                                isVariation={true}
                                template={image.template || null}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};