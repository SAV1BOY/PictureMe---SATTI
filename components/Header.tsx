
import React from 'react';
import { ErrorNotification } from './ui/ErrorNotification';

interface HeaderProps {
    error: string | null;
    onDismiss: () => void;
}

export const Header: React.FC<HeaderProps> = ({ error, onDismiss }) => {
    return (
        <header className="w-full max-w-7xl mx-auto text-left mb-8">
            <ErrorNotification message={error} onDismiss={onDismiss} />
            <h2 className="text-4xl font-bold text-white tracking-tight">
                Estúdio de Criação
            </h2>
            <p className="mt-2 text-lg text-zinc-400">Transforme suas fotos com o poder da IA Gemini.</p>
        </header>
    );
};