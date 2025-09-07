
import React from 'react';
import type { Dispatch } from 'react';
import { motion } from 'framer-motion';
import { IconPlus, IconX } from '../ui/icons';
import { templates } from '../../constants';
import type { AppState, AppAction } from '../../types';

interface HairStylerOptionsProps {
    state: AppState;
    dispatch: Dispatch<AppAction>;
}

export const HairStylerOptions: React.FC<HairStylerOptionsProps> = ({ state, dispatch }) => {
    const totalSelectedStyles = state.hair.selectedStyles.length + (state.hair.isCustomActive ? 1 : 0);

    const handleHairStyleSelect = (styleId: string) => {
        if (styleId === 'Other') {
            const isActivating = !state.hair.isCustomActive;
            if (isActivating && state.hair.selectedStyles.length >= 6) {
                dispatch({ type: 'GENERATION_FAILURE', payload: "Você pode selecionar no máximo 6 estilos." });
                return;
            }
            dispatch({ type: 'UPDATE_HAIR_OPTIONS', payload: { isCustomActive: isActivating, customStyle: isActivating ? state.hair.customStyle : '' }});
            return;
        }

        const isSelected = state.hair.selectedStyles.includes(styleId);
        if (isSelected) {
            dispatch({ type: 'UPDATE_HAIR_OPTIONS', payload: { selectedStyles: state.hair.selectedStyles.filter(s => s !== styleId) }});
        } else {
            if (totalSelectedStyles < 6) {
                dispatch({ type: 'UPDATE_HAIR_OPTIONS', payload: { selectedStyles: [...state.hair.selectedStyles, styleId] }});
            } else {
                dispatch({ type: 'GENERATION_FAILURE', payload: "Você pode selecionar no máximo 6 estilos." });
            }
        }
    };
    
    const addHairColor = () => {
        if (state.hair.colors.length < 2) {
            dispatch({ type: 'UPDATE_HAIR_OPTIONS', payload: { colors: [...state.hair.colors, '#4a2c20'] } });
        }
    };

    const removeHairColor = (index: number) => {
        dispatch({ type: 'UPDATE_HAIR_OPTIONS', payload: { colors: state.hair.colors.filter((_, i) => i !== index) } });
    };

    const handleColorChange = (index: number, newColor: string) => {
        const newColors = [...state.hair.colors];
        newColors[index] = newColor;
        dispatch({ type: 'UPDATE_HAIR_OPTIONS', payload: { colors: newColors } });
    };

    return (
        <>
            <div className="flex justify-between items-center">
                <h3 className='text-xl font-semibold text-white'>Personalizar Penteado</h3>
                <span className={`text-sm font-bold ${totalSelectedStyles >= 6 ? 'text-purple-400' : 'text-zinc-500'}`}>{totalSelectedStyles} / 6</span>
            </div>
            <div>
                <label className="block text-sm font-medium text-zinc-400 mb-3">Estilo (selecione até 6)</label>
                <div className="flex flex-wrap gap-3">
                    {templates.hairStyler.prompts.map(prompt => (
                        <button
                            key={prompt.id}
                            onClick={() => handleHairStyleSelect(prompt.id)}
                            className={`cursor-pointer px-3 py-1.5 text-sm rounded-full transition-colors font-semibold ${state.hair.selectedStyles.includes(prompt.id) ? 'bg-purple-500 text-white' : 'bg-zinc-700 hover:bg-zinc-600 text-zinc-300'}`}
                        >
                            {prompt.id === 'Short' ? 'Curto' : prompt.id === 'Medium' ? 'Médio' : prompt.id === 'Long' ? 'Longo' : prompt.id === 'Straight' ? 'Liso' : prompt.id === 'Wavy' ? 'Ondulado' : 'Cacheado'}
                        </button>
                    ))}
                    <button
                        onClick={() => handleHairStyleSelect('Other')}
                        className={`cursor-pointer px-3 py-1.5 text-sm rounded-full transition-colors font-semibold ${state.hair.isCustomActive ? 'bg-purple-500 text-white' : 'bg-zinc-700 hover:bg-zinc-600 text-zinc-300'}`}
                    >
                        Outro...
                    </button>
                </div>
            </div>

            {state.hair.isCustomActive && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Seu Estilo Personalizado</label>
                    <input
                        type="text"
                        placeholder="ex: Um moicano rosa vibrante"
                        value={state.hair.customStyle}
                        onChange={(e) => dispatch({ type: 'UPDATE_HAIR_OPTIONS', payload: { customStyle: e.target.value } })}
                        className="w-full bg-zinc-700 border border-zinc-600 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                    />
                </motion.div>
            )}

            <div>
                <label className="block text-sm font-medium text-zinc-400 mb-3">Cor do Cabelo</label>
                <div className="flex items-center gap-4 flex-wrap">
                    {state.hair.colors.map((color, index) => (
                        <motion.div key={index} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-2 p-2 bg-zinc-700/50 rounded-lg border border-zinc-600">
                            <div className="relative w-10 h-10 rounded-md overflow-hidden" style={{ backgroundColor: color }}>
                                <input type="color" value={color} onChange={(e) => handleColorChange(index, e.target.value)} className="absolute inset-0 w-full h-full cursor-pointer opacity-0" />
                            </div>
                            <span className="font-mono text-sm text-zinc-300 uppercase">{color}</span>
                            <button onClick={() => removeHairColor(index)} className="p-1 rounded-full text-zinc-500 hover:bg-zinc-600 hover:text-red-400 transition-colors" aria-label="Remove color">
                                <IconX />
                            </button>
                        </motion.div>
                    ))}
                    {state.hair.colors.length < 2 && (
                        <button onClick={addHairColor} className="flex items-center justify-center gap-2 h-[68px] px-4 rounded-lg border-2 border-dashed border-zinc-600 hover:border-purple-500 text-zinc-400 hover:text-purple-400 transition-colors bg-zinc-700/30">
                            <IconPlus />
                            <span>{state.hair.colors.length === 0 ? 'Adicionar Cor' : 'Adicionar Mecha'}</span>
                        </button>
                    )}
                </div>
                 {state.hair.colors.length > 0 && (<button onClick={() => dispatch({type: 'UPDATE_HAIR_OPTIONS', payload: {colors: []}})} className="text-xs text-zinc-500 hover:text-white transition-colors mt-3"> Limpar todas as cores </button>)}
            </div>
        </>
    );
};