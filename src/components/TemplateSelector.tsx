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
        {/* Simple visual representation of the layout */}
        <div className="grid grid-cols-12 gap-1 w-full h-full">
          {template.layout.map((item) => (
            <div
              key={item.i}
              className="bg-blue-500 rounded"
              style={{
                gridColumn: `span ${item.w}`,
                gridRow: `span ${item.h}`,
                gridColumnStart: item.x + 1,
                gridRowStart: item.y + 1,
              }}
            />
          ))}
        </div>
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
      <div className="max-w-6xl mx-auto px-4">
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