import { useState, useRef } from "react";

const Resume = () => {
  const [activeSection, setActiveSection] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);

  const handleSectionClick = (section: string) => {
    setActiveSection(activeSection === section ? "" : section);
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
          <title>黎子豪-前端开发工程师简历</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              background: white;
              padding: 20px;
            }
            
            .max-w-4xl {
              max-width: 56rem;
              margin: 0 auto;
            }
            
            .bg-white {
              background: white !important;
            }
            
            .rounded-2xl {
              border-radius: 1rem;
              border: 1px solid #e5e7eb;
            }
            
            .shadow-lg {
              box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            }
            
            .p-8 {
              padding: 1rem;
            }
            
            .mb-8 {
              margin-bottom: 1rem;
            }
            
            .mb-6 {
              margin-bottom: 0.75rem;
            }
            
            .mb-4 {
              margin-bottom: 0.5rem;
            }
            
            .mb-3 {
              margin-bottom: 0.375rem;
            }
            
            .mb-2 {
              margin-bottom: 0.25rem;
            }
            
            .flex {
              display: flex;
            }
            
            .items-center {
              align-items: center;
            }
            
            .gap-6 {
              gap: 1.5rem;
            }
            
            .gap-4 {
              gap: 1rem;
            }
            
            .gap-2 {
              gap: 0.5rem;
            }
            
            .w-24 {
              width: 6rem;
            }
            
            .h-24 {
              height: 6rem;
            }
            
            .rounded-full {
              border-radius: 9999px;
            }
            
            .bg-gradient-to-br {
              background: linear-gradient(to bottom right, #3b82f6, #8b5cf6);
            }
            
            .text-white {
              color: white;
            }
            
            .text-2xl {
              font-size: 1.5rem;
            }
            
            .text-3xl {
              font-size: 1.875rem;
            }
            
            .text-xl {
              font-size: 1.25rem;
            }
            
            .text-lg {
              font-size: 1.125rem;
            }
            
            .text-sm {
              font-size: 0.875rem;
            }
            
            .font-bold {
              font-weight: 700;
            }
            
            .font-semibold {
              font-weight: 600;
            }
            
            .font-medium {
              font-weight: 500;
            }
            
            .text-gray-900 {
              color: #111827;
            }
            
            .text-gray-700 {
              color: #374151;
            }
            
            .text-gray-600 {
              color: #4b5563;
            }
            
            .text-blue-600 {
              color: #2563eb;
            }
            
            .grid {
              display: grid;
            }
            
            .grid-cols-2 {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }
            
            .space-y-8 > * + * {
              margin-top: 1rem;
            }
            
            .space-y-6 > * + * {
              margin-top: 0.75rem;
            }
            
            .space-y-4 > * + * {
              margin-top: 0.5rem;
            }
            
            .space-y-2 > * + * {
              margin-top: 0.25rem;
            }
            
            .border-l-4 {
              border-left-width: 4px;
            }
            
            .border-blue-500 {
              border-color: #3b82f6;
            }
            
            .border-gray-300 {
              border-color: #d1d5db;
            }
            
            .pl-6 {
              padding-left: 1.5rem;
            }
            
            .leading-relaxed {
              line-height: 1.625;
            }
            
            .flex-wrap {
              flex-wrap: wrap;
            }
            
            .px-3 {
              padding-left: 0.75rem;
              padding-right: 0.75rem;
            }
            
            .py-1 {
              padding-top: 0.25rem;
              padding-bottom: 0.25rem;
            }
            
            .bg-blue-100 {
              background-color: #dbeafe;
            }
            
            .bg-green-100 {
              background-color: #dcfce7;
            }
            
            .bg-purple-100 {
              background-color: #f3e8ff;
            }
            
            .bg-orange-100 {
              background-color: #fed7aa;
            }
            
            .bg-pink-100 {
              background-color: #fce7f3;
            }
            
            .bg-yellow-100 {
              background-color: #fef3c7;
            }
            
            .text-blue-800 {
              color: #1e40af;
            }
            
            .text-green-800 {
              color: #166534;
            }
            
            .text-purple-800 {
              color: #6b21a8;
            }
            
            .text-orange-800 {
              color: #9a3412;
            }
            
            .text-pink-800 {
              color: #be185d;
            }
            
            .text-yellow-800 {
              color: #92400e;
            }
            
            .border {
              border-width: 1px;
              border-color: #e5e7eb;
            }
            
            .rounded-xl {
              border-radius: 0.75rem;
            }
            
            .p-6 {
              padding: 0.75rem;
            }
            
            .bg-gradient-to-r {
              background: #f8fafc;
            }
            
            .text-center {
              text-align: center;
            }
            
            .py-8 {
              padding-top: 1rem;
              padding-bottom: 1rem;
            }
            
            @media print {
              body {
                padding: 0;
                font-size: 12px;
                line-height: 1.4;
              }
              
              .shadow-lg {
                box-shadow: none;
              }
              
              .mb-8 {
                margin-bottom: 0.5rem;
              }
              
              .mb-6 {
                margin-bottom: 0.375rem;
              }
              
              .mb-4 {
                margin-bottom: 0.25rem;
              }
              
              .p-8 {
                padding: 0.5rem;
              }
              
              .p-6 {
                padding: 0.5rem;
              }
              
              .space-y-8 > * + * {
                margin-top: 0.5rem;
              }
              
              .space-y-6 > * + * {
                margin-top: 0.375rem;
              }
              
              .space-y-4 > * + * {
                margin-top: 0.25rem;
              }
              
              .text-3xl {
                font-size: 1.5rem;
              }
              
              .text-2xl {
                font-size: 1.25rem;
              }
              
              .text-xl {
                font-size: 1.125rem;
              }
              
              .py-8 {
                padding-top: 0.5rem;
                padding-bottom: 0.5rem;
              }
            }
          </style>
        </head>
        <body>
          <div class="max-w-4xl">
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Export Button */}
        <div className="fixed top-24 right-6 z-50">
          <button
            onClick={exportToPDF}
            disabled={isExporting}
            className="
              flex items-center gap-2 px-4 py-2 
              bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400
              text-white rounded-full shadow-lg
              transition-all duration-200
              hover:shadow-xl hover:scale-105
              disabled:cursor-not-allowed disabled:scale-100
            "
          >
            {isExporting ? (
              <>
                <svg
                  className="w-4 h-4 animate-spin"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span>导出中...</span>
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span>导出PDF</span>
              </>
            )}
          </button>
        </div>

        {/* Resume Content */}
        <div ref={resumeRef} className="resume-content">
          {/* Header Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8 border border-gray-100 dark:border-gray-700">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                黎
              </div>
              <div className="text-center md:text-left flex-1">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  黎子豪
                </h1>
                <p className="text-xl text-blue-600 dark:text-blue-400 mb-4">
                  Web前端开发工程师
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <span>📍</span>
                    <span>广东广州</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🎂</span>
                    <span>1995年9月</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📱</span>
                    <span>13247313874</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📧</span>
                    <span>13247313874@163.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8 border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span>🧠</span>
              个人简介
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              拥有6年前端开发经验，主攻 React 与 Vue3
              技术栈，擅长前后端协同开发与中后台系统构建，熟悉跨平台小程序、SaaS系统、ERP平台、Web3
              等多种业务场景。具备从需求分析到架构设计再到落地优化的全流程实战能力，能独立负责项目从0到1的搭建与迭代。关注工程化与性能提升，善用AI工具（ChatGPT、Cursor）提效。
            </p>
            {/* <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg"> */}
            {/* <p className="text-blue-800 dark:text-blue-300 font-medium">
              近期专注于：大数据场景下的表格性能优化、权限系统抽象、跨端架构设计
            </p> */}
            {/* </div> */}
          </div>

          {/* Technical Skills */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8 border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <span>🛠</span>
              技术技能
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                  <span>👉</span>
                  主力技术栈
                </h3>
                <div className="grid gap-4">
                  <div>
                    <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                      语言基础
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "JavaScript",
                        "TypeScript",
                        "HTML5",
                        "CSS3",
                        "ES6+",
                      ].map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                      前端框架
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {["React", "Redux", "Vue3", "Pinia", "Vite", "Taro"].map(
                        (skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                      UI/样式框架
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "TailwindCSS",
                        "Element Plus",
                        "Ant Design",
                        "VantUI",
                        "SASS/Less",
                      ].map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                      工程化工具
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {["Webpack", "Vite", "Git", "npm", "yarn"].map(
                        (skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                      AI开发助手
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {["ChatGPT", "Cursor"].map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Work Experience */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8 border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <span>💼</span>
              工作经历
            </h2>

            <div className="space-y-8">
              {/* Current Job */}
              <div className="border-l-4 border-blue-500 pl-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    凯琦供应链 | 前端开发工程师
                  </h3>
                  <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                    2023.10 - 至今（在职）
                  </span>
                </div>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>
                      主导核心ERP系统中财务、权限、数据报表等模块的开发，基于RBAC模型实现前后端权限动态控制
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>拆分通用业务组件20+，提升代码复用率与维护效率</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>
                      负责表格性能优化，替换为AG-Grid并进行二次封装，页面加载耗时从4.8s降至1.5s
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>
                      独立开发跨平台物流调度小程序，显著优化派单响应效率，减少50%调度投诉
                    </span>
                  </li>
                </ul>
              </div>

              {/* Previous Jobs */}
              <div className="border-l-4 border-gray-300 pl-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    贝客科技 | 前端工程师
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    2023.03 - 2023.08
                  </span>
                </div>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>
                      负责支付后台管理系统开发，基于芋道开源多租户SaaS系统进行二次开发
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>组件封装复用率达80%，系统开发到上线周期缩短30%</span>
                  </li>
                </ul>
              </div>

              <div className="border-l-4 border-gray-300 pl-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    广州司南科技 | 前端开发工程师
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    2021.07 - 2022.07
                  </span>
                </div>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>
                      参与公司主站商城与社区模块开发，主导链上智能合约数据交互功能开发
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>
                      封装 sinan.js SDK 调用层，参与智能合约开发（基于星云链
                      Nebulas JS SDK）
                    </span>
                  </li>
                </ul>
              </div>

              <div className="border-l-4 border-gray-300 pl-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    YY游戏（9377）| Web前端工程师
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    2019.08 - 2021.05
                  </span>
                </div>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>负责游戏运营平台多个活动站与官网模块开发</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>完成IE9+老浏览器兼容改造，稳定支持老用户端</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Project Experience */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8 border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <span>💼</span>
              项目经历
            </h2>

            <div className="space-y-8">
              {/* 凯琦供应链 ERP 系统 */}
              <div className="border border-gray-200 dark:border-gray-600 rounded-xl p-6 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">🧾</span>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    凯琦供应链 ERP 系统
                  </h3>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      时间：
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      2023.10 - 至今
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      技术栈：
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      React + Umi + Antd + AG-Grid
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    项目背景
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    构建公司核心跨境物流 ERP
                    平台，涵盖财务、调度、权限、报表等核心模块，实现物流流程数字化与精细化管理
                  </p>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    关键贡献
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>
                        独立开发财务、用户认证、数据报表等核心模块，基于RBAC模型实现角色精细权限控制与动态路由渲染
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>
                        主导组件化重构，封装20+通用业务组件（表单、弹窗、权限按钮等），复用率达70%，显著提升团队开发效率
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>
                        针对报表模块在大数据下的卡顿问题，选型并接入 AG-Grid
                        替换原 ProTable，二次封装支持虚拟滚动与懒加载
                      </span>
                    </li>
                  </ul>
                </div>

                {/* <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <span>📈</span>
                  <span className="font-semibold text-green-800 dark:text-green-300">
                    成果：
                  </span>
                  <span className="text-green-700 dark:text-green-400 text-sm">
                    页面加载速度提升超60%，低端设备页面流畅度提升2倍，客户操作满意度显著提升
                  </span>
                </div>
              </div> */}
              </div>

              {/* 凯琦供应链 小程序调度系统 */}
              <div className="border border-gray-200 dark:border-gray-600 rounded-xl p-6 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/10 dark:to-pink-900/10">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">📦</span>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    凯琦供应链 小程序调度系统
                  </h3>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      时间：
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      2023.10 - 至今
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      技术栈：
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      Taro + NutUI + 微信开发者平台
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    项目背景
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    设计调度-司机双端物流小程序，实现订单分发、流程闭环及运营通知自动化
                  </p>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    关键贡献
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-500 mt-1">•</span>
                      <span>
                        主导项目架构设计与技术选型，采用 Taro
                        实现跨端开发，支持角色差异化界面与逻辑适配
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-500 mt-1">•</span>
                      <span>
                        设计微信消息订阅权限绑定机制，累计推送次数计数，突破平台推送频次限制
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-500 mt-1">•</span>
                      <span>
                        深度集成微信生态，配置菜单跳转 +
                        公众号关联，优化业务人员使用链路
                      </span>
                    </li>
                  </ul>
                </div>

                {/* <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <span>📈</span>
                  <span className="font-semibold text-green-800 dark:text-green-300">
                    成果：
                  </span>
                  <span className="text-green-700 dark:text-green-400 text-sm">
                    调度响应时间提升约40%，推送成功率由68%提升至98%，项目如期上线并稳定运行
                  </span>
                </div>
              </div> */}
              </div>

              {/* PayNow 多租户三方支付后台管理系统 */}
              <div className="border border-gray-200 dark:border-gray-600 rounded-xl p-6 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-900/10 dark:to-emerald-900/10">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">💳</span>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    PayNow 多租户三方支付后台管理系统
                  </h3>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      时间：
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      2023.03 - 2023.08
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      技术栈：
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      Vue3 + Pinia + ElementPlus + VXE-Table + Windicss + AWS
                      SDK
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    项目背景
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    基于芋道开源 SaaS
                    架构，打造支持多租户的支付管理系统，包含商户、渠道、订单、任务等模块
                  </p>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    关键贡献
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>
                        独立完成全模块页面搭建与业务逻辑实现，涉及增删改查、状态流转、权限控制等
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>
                        接入 MinIO（via
                        AWS-SDK）实现商户资质文件上传管理，并封装通用上传组件
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>
                        封装高复用组件（搜索栏、分页表格、状态标签等），提高整体开发效率与一致性
                      </span>
                    </li>
                  </ul>
                </div>

                {/* <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <span>📈</span>
                  <span className="font-semibold text-green-800 dark:text-green-300">
                    成果：
                  </span>
                  <span className="text-green-700 dark:text-green-400 text-sm">
                    开发周期缩短30%，上线后稳定运行，未出现重大故障
                  </span>
                </div>
              </div> */}
              </div>

              {/* 司南官网 */}
              <div className="border border-gray-200 dark:border-gray-600 rounded-xl p-6 bg-gradient-to-r from-orange-50/50 to-red-50/50 dark:from-orange-900/10 dark:to-red-900/10">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">🌐</span>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    司南官网（含链上社区/商城）
                  </h3>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      时间：
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      2021.07 - 2022.07
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      技术栈：
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      React + Redux + Sass + 星云链 Nebulas SDK
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    项目背景
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    公司 Web3
                    平台门户，用户可在商城交易、参与社区互动，部分功能集成链上交互
                  </p>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    关键贡献
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500 mt-1">•</span>
                      <span>
                        负责商城、登录、社区模块前端开发，基于公司内部 sinan.js
                        SDK 实现链上数据访问
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500 mt-1">•</span>
                      <span>
                        参与部分星云链智能合约开发与部署（基于 JavaScript
                        SDK），涵盖商品上链、积分兑换逻辑
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500 mt-1">•</span>
                      <span>
                        统一链上交互数据格式封装，提升前后端对接稳定性
                      </span>
                    </li>
                  </ul>
                </div>

                {/* <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <span>📈</span>
                  <span className="font-semibold text-green-800 dark:text-green-300">
                    成果：
                  </span>
                  <span className="text-green-700 dark:text-green-400 text-sm">
                    链上模块稳定运行，未发生严重交互失败，社区活跃用户增长40%
                  </span>
                </div>
              </div> */}
              </div>

              {/* YY游戏系列平台项目 */}
              <div className="border border-gray-200 dark:border-gray-600 rounded-xl p-6 bg-gradient-to-r from-yellow-50/50 to-amber-50/50 dark:from-yellow-900/10 dark:to-amber-900/10">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">🎮</span>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    YY游戏系列平台项目（含活动、充值、会员系统）
                  </h3>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      时间：
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      2019.08 - 2021.05
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      技术栈：
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      React + Webpack + Babel + jQuery（旧系统）
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      主要项目1：诸神之战 拍卖活动
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400 ml-4">
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-500 mt-1">•</span>
                        <span>
                          独立完成项目从0到1开发，涵盖拍卖、排行、兑换、任务展示等四大模块
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-500 mt-1">•</span>
                        <span>
                          使用 Webpack 插件生成雪碧图，优化加载性能；集成 f2eSDK
                          快速联调数据
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-500 mt-1">•</span>
                        <span>
                          项目链接：http://f2e.yy.com/s/activity/gods-auction/index.html
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      主要项目2：超玩俱乐部官网 & GPay充值系统
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400 ml-4">
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-500 mt-1">•</span>
                        <span>
                          负责 VIP 用户成长、等级、特权模块开发，兼容 IE9
                          以上版本
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-500 mt-1">•</span>
                        <span>
                          在 GPay
                          中新增"超玩金币"支付模块，完成扫码/银行卡支付流程改造
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-500 mt-1">•</span>
                        <span>
                          项目链接：http://gamevip.yy.com |
                          https://gpay.yy.com/s/
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 mt-4">
                <div className="flex items-center gap-2">
                  <span>📈</span>
                  <span className="font-semibold text-green-800 dark:text-green-300">
                    成果：
                  </span>
                  <span className="text-green-700 dark:text-green-400 text-sm">
                    多个活动项目按期交付，全年未发生重大线上事故，活动期间UV提升约2.5倍
                  </span>
                </div>
              </div> */}
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8 border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span>📚</span>
              教育背景
            </h2>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  广东创新科技职业学院 | 软件技术
                </h3>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                2015.09 - 2018.06
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              感谢您的阅读，期待与您的进一步交流
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resume;
