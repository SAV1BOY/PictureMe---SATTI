
import React from 'react';

interface ErrorNotificationProps {
    message: string | null;
    onDismiss: () => void;
}

export const ErrorNotification: React.FC<ErrorNotificationProps> = ({ message, onDismiss }) => {
    if (!message) return null;

    return (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-full max-w-md p-4 bg-red-900/80 backdrop-blur-md border border-red-700 text-red-100 rounded-lg shadow-2xl flex items-center justify-between animate-fade-in-down">
            <span>{message}</span>
            <button onClick={onDismiss} className="p-1 rounded-full hover:bg-red-800 transition-colors ml-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-300"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
        </div>
    );
};

// Add this keyframes to your index.html style or a global stylesheet
/*
@keyframes fade-in-down {
  0% { opacity: 0; transform: translateY(-20px) translateX(-50%); }
  100% { opacity: 1; transform: translateY(0) translateX(-50%); }
}
.animate-fade-in-down { animation: fade-in-down 0.5s ease-out forwards; }
*/
