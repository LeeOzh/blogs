import { useState, useEffect } from 'react';
import SalaryCalculator from './components/SalaryCalculator';
import { 
  getTools, 
  getWebsites, 
  recordToolClick, 
  recordWebsiteClick,
  ToolCategory, 
  WebsiteCategory, 
  Tool, 
  Website 
} from '../../services/toolService';
import './index.css';

type TabType = 'tools' | 'websites';

const Tools = () => {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('tools');
  const [toolCategories, setToolCategories] = useState<ToolCategory[]>([]);
  const [websiteCategories, setWebsiteCategories] = useState<WebsiteCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 组件映射
  const componentMap: { [key: string]: React.ComponentType } = {
    'SalaryCalculator': SalaryCalculator,
  };

  // 加载数据
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [toolsResponse, websitesResponse] = await Promise.all([
          getTools(),
          getWebsites(),
        ]);
        
        setToolCategories(toolsResponse.data || []);
        setWebsiteCategories(websitesResponse.data || []);
      } catch (err) {
        console.error('Failed to load data:', err);
        setError(err instanceof Error ? err.message : '加载数据失败');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleToolClick = async (tool: Tool) => {
    try {
      // 记录点击
      await recordToolClick(tool.id);
      
      if (tool.type === 'EXTERNAL' && tool.url) {
        // 外部链接
        window.open(tool.url, '_blank');
      } else if (tool.type === 'INTERNAL' && tool.componentName) {
        // 内部工具
        const Component = componentMap[tool.componentName];
        if (Component) {
          setSelectedTool(tool.id.toString());
        } else {
          alert('该工具正在开发中，敬请期待！');
        }
      } else if (tool.status === 'DEVELOPING') {
        alert('该工具正在开发中，敬请期待！');
      } else {
        alert('工具配置错误');
      }
    } catch (error) {
      console.error('Failed to record tool click:', error);
      // 即使记录失败也继续执行工具逻辑
      if (tool.type === 'EXTERNAL' && tool.url) {
        window.open(tool.url, '_blank');
      } else if (tool.componentName && componentMap[tool.componentName]) {
        setSelectedTool(tool.id.toString());
      } else {
        alert('该工具正在开发中，敬请期待！');
      }
    }
  };

  const handleWebsiteClick = async (website: Website) => {
    try {
      // 记录点击
      await recordWebsiteClick(website.id);
    } catch (error) {
      console.error('Failed to record website click:', error);
    }
    
    // 打开网站
    window.open(website.url, '_blank');
  };

  const handleBackToList = () => {
    setSelectedTool(null);
  };

  // 如果选择了工具，显示工具组件
  if (selectedTool) {
    // 从所有工具中查找选中的工具
    let tool: Tool | undefined;
    for (const category of toolCategories) {
      tool = category.tools.find(t => t.id.toString() === selectedTool);
      if (tool) break;
    }
    
    if (tool?.componentName && componentMap[tool.componentName]) {
      const ToolComponent = componentMap[tool.componentName];
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="max-w-6xl mx-auto px-4 py-8">
            {/* 返回按钮 */}
            <button
              onClick={handleBackToList}
              className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 mb-8 group"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>返回工具列表</span>
            </button>
            
            <ToolComponent />
          </div>
        </div>
      );
    }
  }

  // 加载状态
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">加载中...</p>
        </div>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">加载失败</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            重新加载
          </button>
        </div>
      </div>
    );
  }

  // 渲染工具卡片
  const renderToolCard = (tool: Tool) => (
    <div
      key={tool.id}
      onClick={() => handleToolClick(tool)}
      className="group cursor-pointer bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      {/* 工具图标和渐变背景 */}
      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${tool.color || 'from-gray-400 to-gray-600'} flex items-center justify-center text-xl mb-3 group-hover:scale-105 transition-transform duration-200`}>
        {tool.icon || '🔧'}
      </div>
      
      {/* 工具信息 */}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
        {tool.name}
      </h3>
      
      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-3 line-clamp-2">
        {tool.description}
      </p>
      
      {/* 状态标签 */}
      <div className="flex items-center justify-between">
        {tool.status === 'ACTIVE' ? (
          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs rounded-full">
            可用
          </span>
        ) : (
          <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 text-xs rounded-full">
            开发中
          </span>
        )}
        
        {/* 点击量显示 */}
        {tool.clickCount > 0 && (
          <span className="text-xs text-gray-400">
            {tool.clickCount} 次使用
          </span>
        )}
        
        {/* 悬停箭头 */}
        <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );

  // 渲染网站卡片
  const renderWebsiteCard = (website: Website) => (
    <div
      key={website.id}
      onClick={() => handleWebsiteClick(website)}
      className="group cursor-pointer bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      {/* 网站图标和渐变背景 */}
      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${website.color || 'from-gray-400 to-gray-600'} flex items-center justify-center text-xl mb-3 group-hover:scale-105 transition-transform duration-200`}>
        {website.icon || '🌐'}
      </div>
      
      {/* 网站信息 */}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
        {website.name}
      </h3>
      
      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-3 line-clamp-2">
        {website.description}
      </p>
      
      {/* 外链标识 */}
      <div className="flex items-center justify-between">
        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded-full">
          外链
        </span>
        
        {/* 点击量显示 */}
        {website.clickCount > 0 && (
          <span className="text-xs text-gray-400">
            {website.clickCount} 次访问
          </span>
        )}
        
        {/* 外链图标 */}
        <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </div>
    </div>
  );

  // 显示工具列表
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* 页面标题 */}
        

        {/* Tab 导航 */}
        <div className="flex justify-center mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('tools')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === 'tools'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              🛠️ 实用工具
            </button>
            <button
              onClick={() => setActiveTab('websites')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === 'websites'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              🌐 网站导航
            </button>
          </div>
        </div>

        {/* 内容区域 */}
        {activeTab === 'tools' ? (
          <>
            {/* 按分类显示工具 */}
            {toolCategories.map(category => (
              <div key={category.id} className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                  {category.icon && <span className="text-lg">{category.icon}</span>}
                  {category.name}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {category.tools.map(renderToolCard)}
                </div>
              </div>
            ))}

            {/* 底部提示 */}
            <div className="text-center mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                💡 更多工具正在路上
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                我们会持续添加更多实用工具，如果你有好的建议，欢迎反馈！
              </p>
            </div>
          </>
        ) : (
          <>
            {/* 按分类显示网站 */}
            {websiteCategories.map(category => (
              <div key={category.id} className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-green-500 rounded-full"></span>
                  {category.icon && <span className="text-lg">{category.icon}</span>}
                  {category.name}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {category.websites.map(renderWebsiteCard)}
                </div>
              </div>
            ))}

            {/* 底部提示 */}
            <div className="text-center mt-12 p-6 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
                🌟 精选优质网站
              </h3>
              <p className="text-sm text-green-700 dark:text-green-300">
                收录了开发、设计、学习等各个领域的优质网站，助力你的工作和学习！
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Tools;
