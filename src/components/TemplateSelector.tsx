import React, { memo } from 'react';
import { LayoutTemplate } from '../types/dashboard';
import { layoutTemplates } from '../lib/layoutTemplates';

interface TemplateSelectorProps {
  onTemplateSelect: (template: LayoutTemplate) => void;
}

// Memoized template card component for better performance
const TemplateCard = memo(({ template, onSelect }: { template: LayoutTemplate, onSelect: () => void }) => (
  <div
    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200 dark:border-gray-700 transform hover:scale-105"
    onClick={onSelect}
  >
    {/* Template Preview */}
    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
      <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 h-32 flex items-center justify-center">
        {/* Wireframe SVG preview for each layout */}
        {template.id === 'single-column' && (
          <svg width="80" height="80" viewBox="0 0 80 80">
            <rect x="10" y="8" width="60" height="12" rx="3" fill="#3B82F6" fillOpacity="0.15" />
            <rect x="10" y="24" width="60" height="12" rx="3" fill="#3B82F6" fillOpacity="0.15" />
            <rect x="10" y="40" width="60" height="12" rx="3" fill="#3B82F6" fillOpacity="0.15" />
            <rect x="10" y="56" width="60" height="12" rx="3" fill="#3B82F6" fillOpacity="0.15" />
          </svg>
        )}
        {template.id === 'two-column' && (
          <svg width="80" height="80" viewBox="0 0 80 80">
            <rect x="10" y="10" width="28" height="22" rx="3" fill="#3B82F6" fillOpacity="0.15" />
            <rect x="42" y="10" width="28" height="22" rx="3" fill="#3B82F6" fillOpacity="0.15" />
            <rect x="10" y="44" width="28" height="22" rx="3" fill="#3B82F6" fillOpacity="0.15" />
            <rect x="42" y="44" width="28" height="22" rx="3" fill="#3B82F6" fillOpacity="0.15" />
          </svg>
        )}
        {template.id === 'three-column' && (
          <svg width="80" height="80" viewBox="0 0 80 80">
            <rect x="6" y="10" width="20" height="18" rx="3" fill="#3B82F6" fillOpacity="0.15" />
            <rect x="30" y="10" width="20" height="18" rx="3" fill="#3B82F6" fillOpacity="0.15" />
            <rect x="54" y="10" width="20" height="18" rx="3" fill="#3B82F6" fillOpacity="0.15" />
            <rect x="16" y="40" width="22" height="18" rx="3" fill="#3B82F6" fillOpacity="0.15" />
            <rect x="42" y="40" width="22" height="18" rx="3" fill="#3B82F6" fillOpacity="0.15" />
          </svg>
        )}
        {template.id === 'hero-layout' && (
          <svg width="80" height="80" viewBox="0 0 80 80">
            <rect x="10" y="8" width="60" height="22" rx="3" fill="#3B82F6" fillOpacity="0.15" />
            <rect x="10" y="40" width="18" height="16" rx="3" fill="#3B82F6" fillOpacity="0.15" />
            <rect x="31" y="40" width="18" height="16" rx="3" fill="#3B82F6" fillOpacity="0.15" />
            <rect x="52" y="40" width="18" height="16" rx="3" fill="#3B82F6" fillOpacity="0.15" />
          </svg>
        )}
        {template.id === 'grid-layout' && (
          <svg width="80" height="80" viewBox="0 0 80 80">
            <rect x="10" y="10" width="26" height="18" rx="3" fill="#3B82F6" fillOpacity="0.15" />
            <rect x="44" y="10" width="26" height="18" rx="3" fill="#3B82F6" fillOpacity="0.15" />
            <rect x="10" y="32" width="26" height="18" rx="3" fill="#3B82F6" fillOpacity="0.15" />
            <rect x="44" y="32" width="26" height="18" rx="3" fill="#3B82F6" fillOpacity="0.15" />
            <rect x="10" y="54" width="26" height="18" rx="3" fill="#3B82F6" fillOpacity="0.15" />
            <rect x="44" y="54" width="26" height="18" rx="3" fill="#3B82F6" fillOpacity="0.15" />
          </svg>
        )}
      </div>
    </div>

    {/* Template Info */}
    <div className="p-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {template.name}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
        {template.description}
      </p>
      
      {/* Layout Stats */}
      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <span>{template.layout.length} chart slots</span>
        <span>{template.cols} columns</span>
      </div>
    </div>
  </div>
));

TemplateCard.displayName = 'TemplateCard';

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onTemplateSelect }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Dashboard Layout
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Select a template to get started, then customize it with your charts
          </p>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {layoutTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onSelect={() => onTemplateSelect(template)}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            You can customize the layout after selecting a template
          </p>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector; 