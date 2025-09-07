
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { IconOptions, IconBranch, IconRegenerate, IconPencil } from './icons';
import type { TemplateId } from '../../types';

interface PhotoDisplayProps {
    label: string;
    imageUrl: string;
    onDownload: (imageUrl: string, label: string, ratio: string, template: TemplateId) => void;
    onRegenerate: () => void;
    onUseAsBase: (imageUrl: string) => void;
    onCreateVariations: () => void;
    onEdit: () => void;
    isEditing?: boolean;
    isPolaroid?: boolean;
    isVariation?: boolean;
    showLabel?: boolean;
    index?: number;
    template: TemplateId;
}

export const PhotoDisplay: React.FC<PhotoDisplayProps> = ({ label, imageUrl, onDownload, onRegenerate, onUseAsBase, onCreateVariations, onEdit, isEditing, isPolaroid = true, isVariation = false, showLabel = true, index = 0, template }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const rotation = useMemo(() => {
        if (!isPolaroid) return 'rotate-0';
        const rotations = ['rotate-1', '-rotate-1', 'rotate-0.5', '-rotate-1.5'];
        return rotations[index % rotations.length];
    }, [index, isPolaroid]);

    const containerClass = isVariation
        ? 'relative group pb-4 bg-zinc-900 rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 w-full'
        : isPolaroid
        ? `relative group bg-gray-100 p-3 pb-12 shadow-xl transform transition-all duration-300 hover:shadow-2xl hover:scale-105 ${rotation}`
        : 'relative group pb-4 bg-zinc-900 rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105';

    const imageContainerClass = isPolaroid ? 'aspect-square bg-gray-200' : 'rounded-t-xl overflow-hidden';
    const textClass = isPolaroid
        ? 'text-center mt-4 font-caveat text-3xl text-gray-900 absolute bottom-3 left-0 right-0'
        : 'text-center mt-3 text-lg font-semibold text-gray-300 px-3';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={containerClass}
        >
            <div className={`${imageContainerClass} relative`}>
                <img src={imageUrl} alt={`Imagem gerada: ${label}`} className={`w-full ${isPolaroid ? 'h-full object-cover' : 'h-auto'}`} />
                {isEditing && (
                    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-400"></div>
                        <p className="text-white mt-4 text-sm font-semibold">Editando...</p>
                    </div>
                )}
            </div>
            {showLabel && <p className={textClass}>{label}</p>}

            <div className="absolute top-3 right-3 z-10" ref={menuRef}>
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors backdrop-blur-sm shadow-lg"
                    aria-label="Options"
                >
                    <IconOptions />
                </button>

                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.1 }}
                        className="absolute right-0 top-12 mt-2 w-52 origin-top-right bg-zinc-900/80 backdrop-blur-md rounded-lg shadow-2xl ring-1 ring-zinc-700 text-white text-sm flex flex-col p-1 z-20"
                    >
                        <span className="w-full text-left px-3 pt-2 pb-1 text-xs text-zinc-500 uppercase tracking-wider">Ações</span>
                        <button onClick={() => { onEdit(); setIsMenuOpen(false); }} className="flex items-center gap-3 w-full text-left px-3 py-2 hover:bg-purple-500/20 rounded-md transition-colors"><IconPencil /> Editar</button>
                        <button onClick={() => { onUseAsBase(imageUrl); setIsMenuOpen(false); }} className="flex items-center gap-3 w-full text-left px-3 py-2 hover:bg-purple-500/20 rounded-md transition-colors">Usar como Base</button>
                        <button onClick={() => { onCreateVariations(); setIsMenuOpen(false); }} className="flex items-center gap-3 w-full text-left px-3 py-2 hover:bg-purple-500/20 rounded-md transition-colors"><IconBranch /> Criar Variações</button>
                        <button onClick={() => { onRegenerate(); setIsMenuOpen(false); }} className="flex items-center gap-3 w-full text-left px-3 py-2 hover:bg-purple-500/20 rounded-md transition-colors"><IconRegenerate /> Recriar</button>
                        <div className="my-1 h-px bg-white/10"></div>
                        <span className="w-full text-left px-3 pt-1 pb-1 text-xs text-zinc-500 uppercase tracking-wider">Baixar</span>
                        <button onClick={() => { onDownload(imageUrl, label, '1:1', template); setIsMenuOpen(false); }} className="w-full text-left px-3 py-2 hover:bg-purple-500/20 rounded-md transition-colors">Quadrado (1:1)</button>
                        <button onClick={() => { onDownload(imageUrl, label, '9:16', template); setIsMenuOpen(false); }} className="w-full text-left px-3 py-2 hover:bg-purple-500/20 rounded-md transition-colors">Retrato (9:16)</button>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};
