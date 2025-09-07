
import React from 'react';
import { TemplateCard } from './ui/TemplateCard';
import { templates } from '../constants';
import type { TemplateId } from '../types';

interface TemplateSelectorProps {
    selectedTemplate: TemplateId;
    onSelect: (id: TemplateId) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ selectedTemplate, onSelect }) => {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {Object.entries(templates).map(([key, data]) => (
                <TemplateCard
                    key={key}
                    id={key}
                    name={data.name}
                    icon={data.icon}
                    description={data.description}
                    isSelected={selectedTemplate === key}
                    onSelect={() => onSelect(key as TemplateId)}
                />
            ))}
        </div>
    );
};
