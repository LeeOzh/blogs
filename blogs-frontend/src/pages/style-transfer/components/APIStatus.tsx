import { checkAPIStatus } from '@/services/aiService';

const APIStatus = () => {
  const status = checkAPIStatus();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        🔧 API配置状态
      </h3>
      
      <div className="space-y-3">
        {/* Hugging Face状态 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${status.huggingFace ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <span className="text-gray-700 dark:text-gray-300">Hugging Face</span>
          </div>
          <span className={`text-sm font-medium ${status.huggingFace ? 'text-green-600' : 'text-gray-500'}`}>
            {status.huggingFace ? '已配置' : '未配置'}
          </span>
        </div>

        {/* Replicate状态 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${status.replicate ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <span className="text-gray-700 dark:text-gray-300">Replicate</span>
          </div>
          <span className={`text-sm font-medium ${status.replicate ? 'text-green-600' : 'text-gray-500'}`}>
            {status.replicate ? '已配置' : '未配置'}
          </span>
        </div>
      </div>

      {/* 配置提示 */}
      {!status.hasAnyProvider && (
        <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <p className="text-yellow-800 dark:text-yellow-200 font-medium text-sm">
                需要配置API密钥
              </p>
              <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-1">
                请在 .env 文件中配置 VITE_HUGGINGFACE_TOKEN 或 VITE_REPLICATE_TOKEN
              </p>
              <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-1">
                查看 HUGGINGFACE_SETUP.md 获取详细配置指南
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 当前使用的服务 */}
      {status.hasAnyProvider && (
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-green-800 dark:text-green-200 font-medium text-sm">
              当前使用: {status.replicate ? 'Replicate' : 'Hugging Face'}
            </p>
          </div>
          {/* {!status.replicate && status.huggingFace && (
            <p className="text-green-700 dark:text-green-300 text-sm mt-1">
              免费额度: 1000次/月 | 建议生产环境使用Replicate
            </p>
          )} */}
        </div>
      )}
    </div>
  );
};

export default APIStatus;