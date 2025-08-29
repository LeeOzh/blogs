import { useState, useRef } from "react";
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import './styles/simplebar-custom.css';
import { ResumeData } from './types';
import { ResumeEditor } from './components/ResumeEditor';
import { TemplateSelector } from './components/TemplateSelector';
import { EditablePreview } from './components/EditablePreview';
import { ModernTemplate } from './templates/ModernTemplate';
import { ClassicTemplate } from './templates/ClassicTemplate';
import { MinimalTemplate } from './templates/MinimalTemplate';

// 自定义 SimpleBar 样式
const simpleBarStyle = {
  height: '100%',
} as const;

const Resume = () => {
  const [currentTemplate, setCurrentTemplate] = useState<'modern' | 'classic' | 'minimal'>('modern');
  const [isExporting, setIsExporting] = useState(false);
  const [previewMode, setPreviewMode] = useState<'static' | 'editable'>('static');
  const resumeRef = useRef<HTMLDivElement>(null);
  
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      name: "黎子豪",
      title: "Web前端开发工程师",
      location: "广东广州",
      birth: "1995年9月",
      phone: "13247313874",
      email: "13247313874@163.com",
      avatar: "黎"
    },
    summary: "拥有6年前端开发经验，主攻 React 与 Vue3 技术栈，擅长前后端协同开发与中后台系统构建，熟悉跨平台小程序、SaaS系统、ERP平台、Web3 等多种业务场景。具备从需求分析到架构设计再到落地优化的全流程实战能力，能独立负责项目从0到1的搭建与迭代。关注工程化与性能提升，善用AI工具（ChatGPT、Cursor）提效。",
    skills: {
      languages: ["JavaScript", "TypeScript", "HTML5", "CSS3", "ES6+"],
      frameworks: ["React", "Redux", "Vue3", "Pinia", "Vite", "Taro"],
      ui: ["TailwindCSS", "Element Plus", "Ant Design", "VantUI", "SASS/Less"],
      tools: ["Webpack", "Vite", "Git", "npm", "yarn"],
      ai: ["ChatGPT", "Cursor"]
    },
    experience: [
      {
        company: "凯琦供应链",
        position: "前端开发工程师",
        period: "2023.10 - 至今",
        current: true,
        achievements: [
          "主导核心ERP系统中财务、权限、数据报表等模块的开发，基于RBAC模型实现前后端权限动态控制",
          "拆分通用业务组件20+，提升代码复用率与维护效率",
          "负责表格性能优化，替换为AG-Grid并进行二次封装，页面加载耗时从4.8s降至1.5s",
          "独立开发跨平台物流调度小程序，显著优化派单响应效率，减少50%调度投诉"
        ]
      },
      {
        company: "贝客科技",
        position: "前端工程师",
        period: "2023.03 - 2023.08",
        current: false,
        achievements: [
          "负责支付后台管理系统开发，基于芋道开源多租户SaaS系统进行二次开发",
          "组件封装复用率达80%，系统开发到上线周期缩短30%"
        ]
      }
    ],
    projects: [
      {
        name: "凯琦供应链 ERP 系统",
        period: "2023.10 - 至今",
        tech: "React + Umi + Antd + AG-Grid",
        background: "构建公司核心跨境物流 ERP 平台，涵盖财务、调度、权限、报表等核心模块，实现物流流程数字化与精细化管理",
        achievements: [
          "独立开发财务、用户认证、数据报表等核心模块，基于RBAC模型实现角色精细权限控制与动态路由渲染",
          "主导组件化重构，封装20+通用业务组件（表单、弹窗、权限按钮等），复用率达70%，显著提升团队开发效率",
          "针对报表模块在大数据下的卡顿问题，选型并接入 AG-Grid 替换原 ProTable，二次封装支持虚拟滚动与懒加载"
        ]
      }
    ]
  });

  const updateResumeData = (section: keyof ResumeData, data: unknown) => {
    setResumeData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  const updatePersonalInfo = (field: keyof ResumeData['personalInfo'], value: string) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  const exportToPDF = () => {
    setIsExporting(true);

    // 使用浏览器打印功能
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("请允许弹窗以导出PDF");
      setIsExporting(false);
      return;
    }

    const resumeContent = resumeRef.current?.innerHTML || "";

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${resumeData.personalInfo.name}-${resumeData.personalInfo.title}简历</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @media print {
              body { font-size: 12px; line-height: 1.4; }
              .shadow-lg { box-shadow: none; }
            }
          </style>
        </head>
        <body>
          <div class="max-w-4xl mx-auto p-4">
            ${resumeContent}
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => window.close(), 1000);
            }
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
    setIsExporting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">简历编辑器</h1>
          <div className="flex items-center gap-4">
            {/* Template Selector */}
            <TemplateSelector
              currentTemplate={currentTemplate}
              onTemplateChange={setCurrentTemplate}
            />

            {/* Preview Mode Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">预览模式：</span>
              <button
                onClick={() => setPreviewMode(previewMode === 'static' ? 'editable' : 'static')}
                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                  previewMode === 'editable'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                {previewMode === 'editable' ? '可编辑' : '静态预览'}
              </button>
            </div>
            
            {/* Export Button */}
            <button
              onClick={exportToPDF}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md shadow-sm transition-colors disabled:cursor-not-allowed"
            >
              {isExporting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>导出中...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>导出PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - Editor */}
        <div className="w-1/2 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
          <SimpleBar 
            style={simpleBarStyle}
            autoHide={true}
            className="resume-editor"
          >
            <ResumeEditor
              resumeData={resumeData}
              onUpdatePersonalInfo={updatePersonalInfo}
              onUpdateSummary={(summary) => updateResumeData('summary', summary)}
              onUpdateSkills={(skills) => updateResumeData('skills', skills)}
              onUpdateExperience={(experience) => updateResumeData('experience', experience)}
              onUpdateProjects={(projects) => updateResumeData('projects', projects)}
            />
          </SimpleBar>
        </div>

        {/* Right Panel - Preview */}
        <div className="w-1/2 bg-white dark:bg-gray-800">
          <SimpleBar 
            style={simpleBarStyle}
            autoHide={true}
            className="resume-preview"
          >
            <div ref={resumeRef} className="resume-content p-6">
              {previewMode === 'editable' && (
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium">可编辑模式</span>
                  </div>
                  <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                    点击任意文本即可直接编辑，Enter保存，Esc取消
                  </p>
                </div>
              )}
              
              {previewMode === 'editable' ? (
                <EditablePreview
                  data={resumeData}
                  onDataChange={setResumeData}
                  template={currentTemplate}
                />
              ) : (
                currentTemplate === 'modern' ? (
                  <ModernTemplate data={resumeData} />
                ) : currentTemplate === 'classic' ? (
                  <ClassicTemplate data={resumeData} />
                ) : (
                  <MinimalTemplate data={resumeData} />
                )
              )}
            </div>
          </SimpleBar>
        </div>
      </div>
    </div>
  );
};

export default Resume;