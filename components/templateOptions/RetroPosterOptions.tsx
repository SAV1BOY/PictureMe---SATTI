
import React from 'react';
import type { Dispatch } from 'react';
import type { AppState, AppAction } from '../../types';

interface RetroPosterOptionsProps {
    state: AppState;
    dispatch: Dispatch<AppAction>;
}

export const RetroPosterOptions: React.FC<RetroPosterOptionsProps> = ({ state, dispatch }) => {
    return (
        <>
            <h3 className='text-xl font-semibold text-white'>Opções do Pôster</h3>
            <div>
                <label htmlFor="poster-title" className="block text-sm font-medium text-zinc-400 mb-2">Título do Pôster (opcional)</label>
                <input
                    id="poster-title"
                    type="text"
                    placeholder="ex: O Último Aventureiro"
                    value={state.retroPoster.title}
                    onChange={(e) => dispatch({ type: 'UPDATE_RETRO_POSTER_OPTIONS', payload: { title: e.target.value } })}
                    className="w-full bg-zinc-700 border border-zinc-600 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                />
            </div>
        </>
    );
};