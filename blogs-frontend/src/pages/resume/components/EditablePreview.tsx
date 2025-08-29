import { useState } from 'react';
import { ResumeData } from '../types';

interface EditablePreviewProps {
  data: ResumeData;
  onDataChange: (data: ResumeData) => void;
  template: 'modern' | 'classic' | 'minimal';
}

export const EditablePreview = ({ data, onDataChange, template }: EditablePreviewProps) => {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState('');

  const handleEdit = (field: string, currentValue: string) => {
    setEditingField(field);
    setTempValue(currentValue);
  };

  const handleSave = (field: string) => {
    const fieldPath = field.split('.');
    const newData = { ...data };
    
    if (fieldPath.length === 2) {
      // 处理嵌套字段如 personalInfo.name
      const [section, key] = fieldPath;
      if (section === 'personalInfo') {
        newData.personalInfo = {
          ...newData.personalInfo,
          [key]: tempValue
        };
      }
    } else if (fieldPath.length === 1) {
      // 处理顶级字段如 summary
      (newData as unknown)[field] = tempValue;
    }
    
    onDataChange(newData);
    setEditingField(null);
  };

  const handleCancel = () => {
    setEditingField(null);
    setTempValue('');
  };

  const EditableText = ({ 
    field, 
    value, 
    className, 
    multiline = false,
    placeholder = "点击编辑..."
  }: {
    field: string;
    value: string;
    className?: string;
    multiline?: boolean;
    placeholder?: string;
  }) => {
    const isEditing = editingField === field;

    if (isEditing) {
      return (
        <div className="relative">
          {multiline ? (
            <textarea
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className={`${className} border-2 border-blue-500 bg-white dark:bg-gray-800 rounded px-2 py-1 resize-none`}
              rows={3}
              autoFocus
              onBlur={() => handleSave(field)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  handleSave(field);
                } else if (e.key === 'Escape') {
                  handleCancel();
                }
              }}
            />
          ) : (
            <input
              type="text"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className={`${className} border-2 border-blue-500 bg-white dark:bg-gray-800 rounded px-2 py-1`}
              autoFocus
              onBlur={() => handleSave(field)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSave(field);
                } else if (e.key === 'Escape') {
                  handleCancel();
                }
              }}
            />
          )}
          <div className="absolute -bottom-6 left-0 text-xs text-gray-500 dark:text-gray-400">
            {multiline ? 'Ctrl+Enter保存，Esc取消' : 'Enter保存，Esc取消'}
          </div>
        </div>
      );
    }

    return (
      <div
        className={`${className} cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded px-2 py-1 transition-colors group relative`}
        onClick={() => handleEdit(field, value)}
      >
        {value || <span className="text-gray-400 italic">{placeholder}</span>}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="absolute top-1 right-1">
            <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </div>
        </div>
      </div>
    );
  };

  if (template === 'modern') {
    return (
      <div className="space-y-8">
        {/* Header Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {data.personalInfo.avatar}
            </div>
            <div className="text-center md:text-left flex-1">
              <EditableText
                field="personalInfo.name"
                value={data.personalInfo.name}
                className="text-3xl font-bold text-gray-900 dark:text-white mb-2 block"
                placeholder="输入姓名"
              />
              <EditableText
                field="personalInfo.title"
                value={data.personalInfo.title}
                className="text-xl text-blue-600 dark:text-blue-400 mb-4 block"
                placeholder="输入职位"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <span>📍</span>
                  <EditableText
                    field="personalInfo.location"
                    value={data.personalInfo.location}
                    className="flex-1"
                    placeholder="输入地址"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span>🎂</span>
                  <EditableText
                    field="personalInfo.birth"
                    value={data.personalInfo.birth}
                    className="flex-1"
                    placeholder="输入出生年月"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span>📱</span>
                  <EditableText
                    field="personalInfo.phone"
                    value={data.personalInfo.phone}
                    className="flex-1"
                    placeholder="输入电话"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span>📧</span>
                  <EditableText
                    field="personalInfo.email"
                    value={data.personalInfo.email}
                    className="flex-1"
                    placeholder="输入邮箱"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span>🧠</span>
            个人简介
          </h2>
          <EditableText
            field="summary"
            value={data.summary}
            className="text-gray-700 dark:text-gray-300 leading-relaxed block w-full"
            multiline={true}
            placeholder="输入个人简介..."
          />
        </div>

        {/* 其他部分保持不可编辑，或者可以继续扩展 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <span>🛠</span>
            技术技能
          </h2>
          <div className="text-sm text-gray-500 dark:text-gray-400 italic">
            技能部分请在左侧编辑器中修改
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <span>💼</span>
            工作经历
          </h2>
          <div className="text-sm text-gray-500 dark:text-gray-400 italic">
            工作经历请在左侧编辑器中修改
          </div>
        </div>
      </div>
    );
  }

  if (template === 'minimal') {
    return (
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 space-y-6">
        {/* Header */}
        <div className="text-center border-b border-gray-200 dark:border-gray-700 pb-6">
          <EditableText
            field="personalInfo.name"
            value={data.personalInfo.name}
            className="text-4xl font-light text-gray-900 dark:text-white mb-2 block"
            placeholder="输入姓名"
          />
          <EditableText
            field="personalInfo.title"
            value={data.personalInfo.title}
            className="text-lg text-gray-600 dark:text-gray-400 mb-4 block"
            placeholder="输入职位"
          />
          <div className="flex justify-center items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <EditableText
              field="personalInfo.location"
              value={data.personalInfo.location}
              placeholder="输入地址"
            />
            <span>•</span>
            <EditableText
              field="personalInfo.phone"
              value={data.personalInfo.phone}
              placeholder="输入电话"
            />
            <span>•</span>
            <EditableText
              field="personalInfo.email"
              value={data.personalInfo.email}
              placeholder="输入邮箱"
            />
          </div>
        </div>

        {/* Summary */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-3 uppercase tracking-wide">
            Summary
          </h2>
          <EditableText
            field="summary"
            value={data.summary}
            className="text-gray-700 dark:text-gray-300 leading-relaxed block w-full"
            multiline={true}
            placeholder="输入个人简介..."
          />
        </div>

        {/* 其他部分保持不可编辑 */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-3 uppercase tracking-wide">
            Experience
          </h2>
          <div className="text-sm text-gray-500 dark:text-gray-400 italic">
            工作经历请在左侧编辑器中修改
          </div>
        </div>
      </div>
    );
  }

  // Classic template 的可编辑版本
  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="text-center border-b border-gray-200 dark:border-gray-700 p-8">
        <EditableText
          field="personalInfo.name"
          value={data.personalInfo.name}
          className="text-4xl font-bold text-gray-900 dark:text-white mb-2 block"
          placeholder="输入姓名"
        />
        <EditableText
          field="personalInfo.title"
          value={data.personalInfo.title}
          className="text-xl text-gray-600 dark:text-gray-400 mb-6 block"
          placeholder="输入职位"
        />
        <div className="flex justify-center items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
          <EditableText
            field="personalInfo.location"
            value={data.personalInfo.location}
            placeholder="输入地址"
          />
          <span>•</span>
          <EditableText
            field="personalInfo.birth"
            value={data.personalInfo.birth}
            placeholder="输入出生年月"
          />
          <span>•</span>
          <EditableText
            field="personalInfo.phone"
            value={data.personalInfo.phone}
            placeholder="输入电话"
          />
          <span>•</span>
          <EditableText
            field="personalInfo.email"
            value={data.personalInfo.email}
            placeholder="输入邮箱"
          />
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* Summary */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b-2 border-gray-900 dark:border-gray-300">
            个人简介
          </h2>
          <EditableText
            field="summary"
            value={data.summary}
            className="text-gray-700 dark:text-gray-300 leading-relaxed text-justify block w-full"
            multiline={true}
            placeholder="输入个人简介..."
          />
        </section>

        {/* 其他部分 */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b-2 border-gray-900 dark:border-gray-300">
            技术技能
          </h2>
          <div className="text-sm text-gray-500 dark:text-gray-400 italic">
            技能部分请在左侧编辑器中修改
          </div>
        </section>
      </div>
    </div>
  );
};