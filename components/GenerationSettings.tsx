import React from 'react';
import type { Dispatch } from 'react';
import { RadioPill } from './ui/RadioPill';
import type { AppState, AppAction, AspectRatio, GenerationStyle, CameraShotType, CameraLensType } from '../types';

interface GenerationSettingsProps {
    state: AppState;
    dispatch: Dispatch<AppAction>;
}

const generationStyles: GenerationStyle[] = [
    'Fotorrealista',
    'Cinematic',
    'Fotografia de Rua',
    'Fotografia de Produto',
    'Arte Fantasia',
    'Arte Conceitual',
    'Arte de Pintura Digital',
    'Pintura a Óleo',
    'Aquarela',
    'Anime',
    'Estilo HQ de mangá',
    'Ghibli',
    'Desenho Animado',
    'Arte Steampunk',
    'Arte Cyberpunk',
    'Neo-Noir',
    'Dystopian',
    'Surrealismo',
    'Minimalista',
    'Arte Abstrata',
    'Abstrato Geométrico',
    'Ilustração Vetorial',
    'Pixel Art',
    'Pôster Retrô',
];

const cameraShotTypes: CameraShotType[] = [
    'Padrão',
    'Close-up Extremo',
    'Close-up',
    'Plano Médio',
    'Plano Americano',
    'Corpo Inteiro',
    'Plano Geral'
];

const cameraLensTypes: CameraLensType[] = [
    'Padrão',
    'Grande Angular (24mm)',
    'Padrão (50mm)',
    'Retrato (85mm)',
    'Teleobjetiva (200mm)'
];

export const GenerationSettings: React.FC<GenerationSettingsProps> = ({ state, dispatch }) => {
    return (
        <section>
            <h2 className="text-xl font-semibold mb-4 text-white tracking-tight">Configurações de Geração</h2>
            <div className="flex flex-col gap-6">
                {/* Aspect Ratio Section */}
                <div className="p-4 rounded-xl bg-zinc-800/50">
                    <label className="block text-sm font-medium text-zinc-400 mb-3">Proporção da Tela</label>
                    <div className="flex flex-wrap gap-3">
                        <RadioPill name="generationAspectRatio" value="1:1" label="Quadrado (1:1)" checked={state.generationAspectRatio === '1:1'} onChange={e => dispatch({ type: 'UPDATE_GENERATION_SETTINGS', payload: { generationAspectRatio: e.target.value as AspectRatio } })} />
                        <RadioPill name="generationAspectRatio" value="9:16" label="Retrato (9:16)" checked={state.generationAspectRatio === '9:16'} onChange={e => dispatch({ type: 'UPDATE_GENERATION_SETTINGS', payload: { generationAspectRatio: e.target.value as AspectRatio } })} />
                        <RadioPill name="generationAspectRatio" value="16:9" label="Paisagem (16:9)" checked={state.generationAspectRatio === '16:9'} onChange={e => dispatch({ type: 'UPDATE_GENERATION_SETTINGS', payload: { generationAspectRatio: e.target.value as AspectRatio } })} />
                    </div>
                </div>

                {/* Art Style Section */}
                <div className="p-4 rounded-xl bg-zinc-800/50">
                    <label htmlFor="generation-style-select" className="block text-sm font-medium text-zinc-400 mb-3">Estilo de Arte</label>
                    <div className="relative">
                        <select
                            id="generation-style-select"
                            name="generationStyle"
                            value={state.generationStyle}
                            onChange={e => dispatch({ type: 'UPDATE_GENERATION_SETTINGS', payload: { generationStyle: e.target.value as GenerationStyle } })}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white appearance-none cursor-pointer"
                        >
                            {generationStyles.map(style => (
                                <option key={style} value={style} className="bg-zinc-800 text-white">{style}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-zinc-400">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Camera Shot Type Section */}
                <div className="p-4 rounded-xl bg-zinc-800/50">
                    <label htmlFor="camera-shot-select" className="block text-sm font-medium text-zinc-400 mb-3">Tipo de Plano da Câmera</label>
                    <div className="relative">
                        <select
                            id="camera-shot-select"
                            name="cameraShotType"
                            value={state.cameraShotType}
                            onChange={e => dispatch({ type: 'UPDATE_GENERATION_SETTINGS', payload: { cameraShotType: e.target.value as CameraShotType } })}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white appearance-none cursor-pointer"
                        >
                            {cameraShotTypes.map(shot => (
                                <option key={shot} value={shot} className="bg-zinc-800 text-white">{shot}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-zinc-400">
                             <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Camera Lens Type Section */}
                <div className="p-4 rounded-xl bg-zinc-800/50">
                    <label htmlFor="camera-lens-select" className="block text-sm font-medium text-zinc-400 mb-3">Tipo de Lente/Zoom</label>
                    <div className="relative">
                        <select
                            id="camera-lens-select"
                            name="cameraLensType"
                            value={state.cameraLensType}
                            onChange={e => dispatch({ type: 'UPDATE_GENERATION_SETTINGS', payload: { cameraLensType: e.target.value as CameraLensType } })}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white appearance-none cursor-pointer"
                        >
                            {cameraLensTypes.map(lens => (
                                <option key={lens} value={lens} className="bg-zinc-800 text-white">{lens}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-zinc-400">
                             <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};