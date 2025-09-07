
import React from 'react';

interface RadioPillProps {
    name: string;
    value: string | number;
    label: string;
    checked: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const RadioPill: React.FC<RadioPillProps> = ({ name, value, label, checked, onChange }) => (
    <label className={`cursor-pointer px-3 py-1.5 text-sm rounded-full transition-colors font-semibold ${checked ? 'bg-purple-500 text-white' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'}`}>
        <input
            type="radio"
            name={name}
            value={value}
            checked={checked}
            onChange={onChange}
            className="hidden"
        />
        {label}
    </label>
);