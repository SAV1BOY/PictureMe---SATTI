
import React from 'react';
import type { Dispatch } from 'react';
import { HairStylerOptions } from './templateOptions/HairStylerOptions';
import { HeadshotsOptions } from './templateOptions/HeadshotsOptions';
import { StyleLookbookOptions } from './templateOptions/StyleLookbookOptions';
import { RetroPosterOptions } from './templateOptions/RetroPosterOptions';
import { CyberpunkCityOptions } from './templateOptions/CyberpunkCityOptions';
import type { AppState, AppAction } from '../types';

interface TemplateOptionsProps {
    state: AppState;
    dispatch: Dispatch<AppAction>;
}

export const TemplateOptions: React.FC<TemplateOptionsProps> = ({ state, dispatch }) => {
    if (!state.template) return null;

    let optionsComponent;
    switch (state.template) {
        case 'hairStyler':
            optionsComponent = <HairStylerOptions state={state} dispatch={dispatch} />;
            break;
        case 'headshots':
            optionsComponent = <HeadshotsOptions state={state} dispatch={dispatch} />;
            break;
        case 'styleLookbook':
            optionsComponent = <StyleLookbookOptions state={state} dispatch={dispatch} />;
            break;
        case 'retroPoster':
            optionsComponent = <RetroPosterOptions state={state} dispatch={dispatch} />;
            break;
        case 'cyberpunkCity':
            optionsComponent = <CyberpunkCityOptions state={state} dispatch={dispatch} />;
            break;
        default:
            return null; // No options for other templates yet
    }
    
    return (
         <div className="space-y-6">
            {optionsComponent}
        </div>
    );
};