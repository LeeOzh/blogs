import { useState } from 'react';
import { checkAPIStatus } from '@/services/aiService';

const DebugPanel = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const status = checkAPIStatus();

  const testAPI = async () => {
    if (!status.hasAnyProvider) {
      setTestResult('❌ 没有可用的API配置');
      return;
    }

    setIsLoading(true);
    setTestResult('🔄 测试Flux模型连接...');

    try {
      const HF_TOKEN = import.meta.env.VITE_HUGGINGFACE_TOKEN;
      const fluxModel = 'black-forest-labs/FLUX.1-schnell';
      const apiUrl = `https://api-inference.huggingface.co/models/${fluxModel}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HF_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: 'a beautiful sunset, artistic style',
          parameters: {
            guidance_scale: 3.5,
            num_inference_steps: 4,
            max_sequence_length: 256,
            width: 1024,
            height: 1024
          }
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        if (blob.size > 0 && blob.type.startsWith('image/')) {
          setTestResult('✅ Flux API测试成功！模型可以正常生成图片');
        } else {
          setTestResult('⚠️ Flux API响应异常，返回的不是有效图片');
        }
      } else {
        const errorText = await response.text();
        let detailedError = `❌ Flux API测试失败 (${response.status}): `;
        
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.error) {
            detailedError += errorData.error;
            
            if (errorData.error.includes('loading')) {
              detailedError += '\n💡 建议: 模型正在加载，请等待几分钟后重试';
            } else if (errorData.error.includes('permission')) {
              detailedError += '\n💡 建议: 请确保使用Write权限的token';
            }
          } else {
            detailedError += errorText;
          }
        } catch {
          detailedError += errorText;
        }
        
        setTestResult(detailedError);
      }
    } catch (error) {
      setTestResult(`❌ 网络错误: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        🔍 调试面板
      </h3>
      
      <div className="space-y-4">
        {/* 环境变量检查 */}
        <div>
          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">环境变量状态:</h4>
          <div className="text-sm space-y-1">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${status.huggingFace ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span className="text-gray-600 dark:text-gray-400">
                VITE_HUGGINGFACE_TOKEN: {status.huggingFace ? '已配置' : '未配置'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${status.replicate ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span className="text-gray-600 dark:text-gray-400">
                VITE_REPLICATE_TOKEN: {status.replicate ? '已配置' : '未配置'}
              </span>
            </div>
          </div>
        </div>

        {/* API测试 */}
        <div>
          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">API连接测试:</h4>
          <button
            onClick={testAPI}
            disabled={!status.hasAnyProvider || isLoading}
            className="
              px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium
              hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed
              transition-colors duration-200
            "
          >
            {isLoading ? '测试中...' : '测试API连接'}
          </button>
          
          {testResult && (
            <div className="mt-2 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {testResult}
              </pre>
            </div>
          )}
        </div>

        {/* 配置建议 */}
        {!status.hasAnyProvider && (
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">配置建议:</h4>
            <ol className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1 list-decimal list-inside">
              <li>访问 <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noopener noreferrer" className="underline">Hugging Face Tokens</a></li>
              <li>创建一个 <strong>Write</strong> 权限的token</li>
              <li>在 .env 文件中设置 VITE_HUGGINGFACE_TOKEN</li>
              <li>重启开发服务器</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};

export default DebugPanel;