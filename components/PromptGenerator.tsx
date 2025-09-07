
import React from 'react';
import type { Dispatch } from 'react';
import { Button } from './ui/Button';
import { RadioPill } from './ui/RadioPill';
import { IconSparkles } from './ui/icons';
import type { AppState, AppAction } from '../types';

interface PromptGeneratorProps {
    state: AppState;
    dispatch: Dispatch<AppAction>;
    onGenerate: () => void;
}

export const PromptGenerator: React.FC<PromptGeneratorProps> = ({ state, dispatch, onGenerate }) => {
    const isLoading = state.status === 'prompt_loading';
    return (
        <div>
            <div className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800">
                <h3 className="text-xl font-semibold text-purple-400 mb-4">Gere com um Prompt</h3>
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-3">Número de Imagens</label>
                        <div className="flex flex-wrap gap-3">
                            {[1, 2, 3, 4].map(num => (
                                <RadioPill key={num} name="imageCount" value={num} label={`${num}`} checked={state.promptImageCount === num} onChange={e => dispatch({ type: 'UPDATE_GENERATION_SETTINGS', payload: { promptImageCount: Number(e.target.value) } })} />
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">Sua Ideia</label>
                        <p className="text-zinc-500 mb-4 text-xs">
                            {state.uploadedImage ? "(Sua foto será usada como referência para a transformação.)" : "(Nenhuma foto carregada. A imagem será criada do zero.)"}
                        </p>
                        <textarea
                            value={state.customPrompt}
                            onChange={(e) => dispatch({ type: 'UPDATE_GENERATION_SETTINGS', payload: { customPrompt: e.target.value } })}
                            placeholder="ex: um astronauta explorando marte, foto cinematográfica..."
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white min-h-[100px] resize-y"
                        />
                    </div>
                </div>
            </div>
            <div className="mt-8 text-center">
                <Button
                    onClick={onGenerate}
                    disabled={!state.customPrompt.trim() || isLoading}
                    primary
                    className="text-lg px-12 py-4"
                >
                    <div className="flex items-center justify-center gap-3">
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                <span>Gerando...</span>
                            </>
                        ) : (
                            <>
                                <IconSparkles />
                                Gerar por Prompt
                            </>
                        )}
                    </div>
                </Button>
            </div>
        </div>
    );
};