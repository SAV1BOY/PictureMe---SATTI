
import React, { useState } from 'react';
import type { Dispatch } from 'react';
import { applyFilterToImage } from '../services/imageUtils';
import type { AppAction, FilterType } from '../types';

interface ImageFilterSelectorProps {
    originalImage: string;
    activeFilter: FilterType;
    dispatch: Dispatch<AppAction>;
}

const filters: { id: FilterType; name: string }[] = [
    { id: 'none', name: 'Original' },
    { id: 'vintage', name: 'Vintage' },
    { id: 'bw', name: 'P&B' },
    { id: 'sepia', name: 'Sépia' },
    { id: 'warm', name: 'Quente' },
    { id: 'cool', name: 'Frio' },
];

export const ImageFilterSelector: React.FC<ImageFilterSelectorProps> = ({ originalImage, activeFilter, dispatch }) => {
    const [isFiltering, setIsFiltering] = useState(false);
    
    const handleFilterClick = async (filter: FilterType) => {
        if (isFiltering || filter === activeFilter) return;
        
        setIsFiltering(true);
        try {
            const filteredImage = await applyFilterToImage(originalImage, filter);
            dispatch({ type: 'APPLY_FILTER', payload: { filter, image: filteredImage } });
        } catch (error) {
            console.error("Failed to apply filter", error);
            dispatch({ type: 'UPLOAD_IMAGE_FAILURE', payload: 'Falha ao aplicar o filtro.' });
        } finally {
            setIsFiltering(false);
        }
    };

    return (
        <div className="mt-4">
            <label className="block text-sm font-medium text-zinc-400 mb-3">Aplicar Filtro</label>
            <div className="flex flex-wrap gap-3 relative">
                {isFiltering && (
                    <div className="absolute inset-0 bg-zinc-800/50 flex items-center justify-center rounded-lg z-10">
                         <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-purple-400"></div>
                    </div>
                )}
                {filters.map(({ id, name }) => (
                    <button
                        key={id}
                        onClick={() => handleFilterClick(id)}
                        disabled={isFiltering}
                        className={`cursor-pointer px-3 py-1.5 text-sm rounded-full transition-colors font-semibold disabled:opacity-70 disabled:cursor-wait
                            ${activeFilter === id ? 'bg-purple-500 text-white' : 'bg-zinc-700 hover:bg-zinc-600 text-zinc-300'}`}
                    >
                        {name}
                    </button>
                ))}
            </div>
        </div>
    );
};