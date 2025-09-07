
import React from 'react';

interface ButtonProps {
    children: React.ReactNode;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
    primary?: boolean;
    className?: string;
    id?: string;
}

export const Button: React.FC<ButtonProps> = ({ children, onClick, disabled = false, primary = false, className = '', id }) => {
    const baseClass = "px-6 py-2 rounded-lg font-semibold tracking-wide transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-zinc-900";
    const themeClass = primary
        ? "bg-purple-500 text-white hover:bg-purple-600 shadow-lg shadow-purple-500/20"
        : "bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:border-zinc-600";

    return (
        <button
            // FIX: Pass the id prop to the button element.
            id={id}
            onClick={onClick}
            disabled={disabled}
            className={`${baseClass} ${themeClass} ${className}`}
        >
            {children}
        </button>
    );
};