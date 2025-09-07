
import React from 'react';

interface TemplateCardProps {
    id: string;
    name: string;
    icon: string;
    description: string;
    isSelected: boolean;
    onSelect: (id: string) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({ id, name, icon, description, isSelected, onSelect }) => (
    <div
        onClick={() => onSelect(id)}
        className={`cursor-pointer p-5 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 shadow-lg ${isSelected ? 'border-purple-500 bg-purple-900/30 ring-2 ring-purple-500' : 'border-zinc-800 bg-zinc-900 hover:border-purple-500'}`}
    >
        <div className="text-3xl mb-3">{icon}</div>
        <h3 className="text-lg font-semibold text-white">{name}</h3>
        <p className="text-sm text-zinc-400 mt-1">{description}</p>
    </div>
);