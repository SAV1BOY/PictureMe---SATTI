import React from 'react';
import type { GenerationSession } from '../types';
import { IconHistory, IconTrash } from './ui/icons';

interface HistoryPanelProps {
    history: GenerationSession[];
    onLoadSession: (sessionId: string) => void;
    onClearHistory: () => void;
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onLoadSession, onClearHistory }) => {
    
    const getThumbnail = (session: GenerationSession): string | null => {
        const firstThemeImage = session.generatedImages.find(img => img.status === 'success' && img.imageUrl);
        if (firstThemeImage) return firstThemeImage.imageUrl;

        const firstPromptImage = session.promptGeneratedImages.find(img => img.status === 'success' && img.imageUrl);
        if (firstPromptImage) return firstPromptImage.imageUrl;

        return session.originalUploadedImage; // Fallback to original image
    };
    
    return (
        <section>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white tracking-tight flex items-center gap-3">
                    <IconHistory />
                    Histórico
                </h2>
                {history.length > 0 && (
                     <button 
                        onClick={onClearHistory} 
                        className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-800 hover:text-red-400 transition-colors"
                        aria-label="Limpar Histórico"
                     >
                        <IconTrash />
                    </button>
                )}
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {history.length === 0 ? (
                    <div className="text-center py-8 px-4 bg-zinc-800/50 rounded-lg">
                        <p className="text-zinc-500 text-sm">Suas sessões geradas aparecerão aqui.</p>
                    </div>
                ) : (
                    history.map(session => (
                        <button 
                            key={session.id} 
                            onClick={() => onLoadSession(session.id)}
                            className="w-full text-left p-3 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors flex items-center gap-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <div className="w-16 h-16 rounded-md bg-zinc-900 flex-shrink-0 overflow-hidden">
                                {getThumbnail(session) ? (
                                    <img src={getThumbnail(session)!} alt={`Thumbnail for ${session.name}`} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-zinc-700"></div>
                                )}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-semibold text-zinc-200 truncate">{session.name}</p>
                                <p className="text-xs text-zinc-400">{formatDate(session.timestamp)}</p>
                            </div>
                        </button>
                    ))
                )}
            </div>
        </section>
    );
};
