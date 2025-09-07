import React from 'react';
import type { Dispatch } from 'react';
import { RadioPill } from '../ui/RadioPill';
import type { AppState, AppAction } from '../../types';

interface CyberpunkCityOptionsProps {
    state: AppState;
    dispatch: Dispatch<AppAction>;
}

const neonColors = ['Ciano', 'Magenta', 'Lima', 'Amarelo', 'Laranja'];

export const CyberpunkCityOptions: React.FC<CyberpunkCityOptionsProps> = ({ state, dispatch }) => {
    return (
        <>
            <h3 className='text-xl font-semibold text-white'>Opções Cyberpunk</h3>
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-3">Cor Neon Principal</label>
                <div className="flex flex-wrap gap-3">
                    {neonColors.map(color => (
                         <RadioPill 
                            key={color}
                            name="neonColor" 
                            value={color} 
                            label={color} 
                            checked={state.cyberpunkCity.neonColor === color} 
                            onChange={e => dispatch({ type: 'UPDATE_CYBERPUNK_CITY_OPTIONS', payload: { neonColor: e.target.value } })} 
                        />
                    ))}
                </div>
            </div>
        </>
    );
};