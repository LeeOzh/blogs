import { useState } from 'react';
import { TemplateType } from '../types';

interface TemplateSelectorProps {
  currentTemplate: TemplateType;
  onTemplateChange: (template: TemplateType) => void;
}

export const TemplateSelector = ({ currentTemplate, onTemplateChange }: TemplateSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const templates = [
    {
      id: 'modern' as TemplateType,
      name: '现代风格',
      description: '彩色卡片设计，视觉效果丰富',
      preview: (
        <div className="w-full h-32 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-2 text-xs">
          <div className="bg-white rounded-md p-2 mb-2 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full"></div>
              <div>
                <div className="w-12 h-1.5 bg-gray-800 rounded mb-0.5"></div>
                <div className="w-16 h-1 bg-blue-600 rounded"></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1 text-[6px]">
              <div className="w-8 h-0.5 bg-gray-400 rounded"></div>
              <div className="w-6 h-0.5 bg-gray-400 rounded"></div>
            </div>
          </div>
          <div className="bg-white rounded-md p-2 shadow-sm">
            <div className="w-10 h-1 bg-gray-800 rounded mb-1"></div>
            <div className="space-y-0.5">
              <div className="w-full h-0.5 bg-gray-300 rounded"></div>
              <div className="w-3/4 h-0.5 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'classic' as TemplateType,
      name: '经典风格',
      description: '传统简历布局，专业简洁',
      preview: (
        <div className="w-full h-32 bg-white border rounded-lg p-2 text-xs">
          <div className="text-center border-b border-gray-200 pb-2 mb-2">
            <div className="w-16 h-1.5 bg-gray-900 rounded mx-auto mb-1"></div>
            <div className="w-12 h-1 bg-gray-600 rounded mx-auto mb-1"></div>
            <div className="flex justify-center gap-1">
              <div className="w-4 h-0.5 bg-gray-400 rounded"></div>
              <div className="w-1 h-0.5 bg-gray-400 rounded"></div>
              <div className="w-4 h-0.5 bg-gray-400 rounded"></div>
            </div>
          </div>
          <div className="space-y-1">
            <div className="border-b border-gray-900 pb-0.5">
              <div className="w-8 h-1 bg-gray-900 rounded uppercase"></div>
            </div>
            <div className="space-y-0.5">
              <div className="w-full h-0.5 bg-gray-400 rounded"></div>
              <div className="w-4/5 h-0.5 bg-gray-400 rounded"></div>
              <div className="w-3/4 h-0.5 bg-gray-400 rounded"></div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'minimal' as TemplateType,
      name: '极简风格',
      description: '简洁优雅，突出内容',
      preview: (
        <div className="w-full h-32 bg-white border rounded-lg p-2 text-xs">
          <div className="text-center border-b border-gray-200 pb-2 mb-2">
            <div className="w-16 h-1.5 bg-gray-900 rounded mx-auto mb-1"></div>
            <div className="w-12 h-1 bg-gray-600 rounded mx-auto mb-1"></div>
            <div className="flex justify-center gap-1">
              <div className="w-4 h-0.5 bg-gray-400 rounded"></div>
              <div className="w-1 h-0.5 bg-gray-400 rounded"></div>
              <div className="w-4 h-0.5 bg-gray-400 rounded"></div>
            </div>
          </div>
          <div className="space-y-1">
            <div className="w-8 h-1 bg-gray-900 rounded uppercase"></div>
            <div className="space-y-0.5">
              <div className="w-full h-0.5 bg-gray-400 rounded"></div>
              <div className="w-4/5 h-0.5 bg-gray-400 rounded"></div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {templates.find(t => t.id === currentTemplate)?.name}
        </span>
        <svg 
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-96 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">选择模板</h3>
            <div className="grid grid-cols-3 gap-3">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => {
                    onTemplateChange(template.id);
                    setIsOpen(false);
                  }}
                  className={`p-3 rounded-lg border-2 transition-all hover:shadow-md ${
                    currentTemplate === template.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="mb-3">
                    {template.preview}
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                      {template.name}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {template.description}
                    </p>
                  </div>
                  {currentTemplate === template.id && (
                    <div className="mt-2 flex items-center justify-center">
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};