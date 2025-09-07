
import React from 'react';
import type { Dispatch } from 'react';
import { motion } from 'framer-motion';
import { RadioPill } from '../ui/RadioPill';
import { templates } from '../../constants';
import type { AppState, AppAction } from '../../types';

interface StyleLookbookOptionsProps {
    state: AppState;
    dispatch: Dispatch<AppAction>;
}

export const StyleLookbookOptions: React.FC<StyleLookbookOptionsProps> = ({ state, dispatch }) => {
    return (
        <>
            <h3 className='text-xl font-semibold text-white'>Escolha um Estilo de Moda</h3>
            <div>
                <div className="flex flex-wrap gap-3">
                    {(templates.styleLookbook.styles || []).map(style => (
                        <RadioPill key={style} name="style" value={style} label={style} checked={state.lookbook.style === style} onChange={e => dispatch({ type: 'UPDATE_LOOKBOOK_OPTIONS', payload: { style: e.target.value, customStyle: '' }})} />
                    ))}
                    <RadioPill name="style" value="Other" label="Outro..." checked={state.lookbook.style === 'Other'} onChange={e => dispatch({ type: 'UPDATE_LOOKBOOK_OPTIONS', payload: { style: e.target.value }})} />
                </div>
            </div>
            {state.lookbook.style === 'Other' && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} >
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Seu Estilo Personalizado</label>
                    <input
                        type="text"
                        placeholder="ex: Cyberpunk, Avant-garde"
                        value={state.lookbook.customStyle}
                        onChange={(e) => dispatch({ type: 'UPDATE_LOOKBOOK_OPTIONS', payload: { customStyle: e.target.value }})}
                        className="w-full bg-zinc-700 border border-zinc-600 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                    />
                </motion.div>
            )}
        </>
    );
};