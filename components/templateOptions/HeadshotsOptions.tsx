import React from 'react';
import type { Dispatch } from 'react';
import { RadioPill } from '../ui/RadioPill';
import type { AppState, AppAction, BackgroundBlur } from '../../types';

interface HeadshotsOptionsProps {
    state: AppState;
    dispatch: Dispatch<AppAction>;
}

export const HeadshotsOptions: React.FC<HeadshotsOptionsProps> = ({ state, dispatch }) => {
    return (
        <>
            <h3 className='text-xl font-semibold text-white'>Personalizar Retrato</h3>
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-3">Expressão Facial</label>
                <div className="flex flex-wrap gap-3">
                    <RadioPill name="expression" value="Friendly Smile" label="Sorriso Amigável" checked={state.headshots.expression === 'Friendly Smile'} onChange={e => dispatch({ type: 'UPDATE_HEADSHOT_OPTIONS', payload: { expression: e.target.value } })} />
                    <RadioPill name="expression" value="Confident Look" label="Olhar Confiante" checked={state.headshots.expression === 'Confident Look'} onChange={e => dispatch({ type: 'UPDATE_HEADSHOT_OPTIONS', payload: { expression: e.target.value } })} />
                    <RadioPill name="expression" value="Thoughtful Gaze" label="Olhar Pensativo" checked={state.headshots.expression === 'Thoughtful Gaze'} onChange={e => dispatch({ type: 'UPDATE_HEADSHOT_OPTIONS', payload: { expression: e.target.value } })} />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-3">Pose</label>
                <div className="flex flex-wrap gap-3">
                    <RadioPill name="pose" value="Forward" label="Virado para a Frente" checked={state.headshots.pose === 'Forward'} onChange={e => dispatch({ type: 'UPDATE_HEADSHOT_OPTIONS', payload: { pose: e.target.value } })} />
                    <RadioPill name="pose" value="Angle" label="Ângulo Ligeiro" checked={state.headshots.pose === 'Angle'} onChange={e => dispatch({ type: 'UPDATE_HEADSHOT_OPTIONS', payload: { pose: e.target.value } })} />
                </div>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-400 mb-3">Desfoque de Fundo</label>
                <div className="flex flex-wrap gap-3">
                    <RadioPill name="backgroundBlur" value="Nenhum" label="Nenhum" checked={state.headshots.backgroundBlur === 'Nenhum'} onChange={e => dispatch({ type: 'UPDATE_HEADSHOT_OPTIONS', payload: { backgroundBlur: e.target.value as BackgroundBlur } })} />
                    <RadioPill name="backgroundBlur" value="Baixo" label="Baixo" checked={state.headshots.backgroundBlur === 'Baixo'} onChange={e => dispatch({ type: 'UPDATE_HEADSHOT_OPTIONS', payload: { backgroundBlur: e.target.value as BackgroundBlur } })} />
                    <RadioPill name="backgroundBlur" value="Médio" label="Médio" checked={state.headshots.backgroundBlur === 'Médio'} onChange={e => dispatch({ type: 'UPDATE_HEADSHOT_OPTIONS', payload: { backgroundBlur: e.target.value as BackgroundBlur } })} />
                    <RadioPill name="backgroundBlur" value="Alto" label="Alto" checked={state.headshots.backgroundBlur === 'Alto'} onChange={e => dispatch({ type: 'UPDATE_HEADSHOT_OPTIONS', payload: { backgroundBlur: e.target.value as BackgroundBlur } })} />
                </div>
            </div>
        </>
    );
};