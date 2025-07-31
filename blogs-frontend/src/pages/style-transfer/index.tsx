import { useState, useRef } from 'react';
import { processStyleTransfer, checkAPIStatus } from '@/services/aiService';
import APIStatus from './components/APIStatus';
import DebugPanel from './components/DebugPanel';
import './styles.css';

interface StyleOption {
  id: string;
  name: string;
  description: string;
  preview: string;
  prompt: string;
}

const StyleTransfer = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [selectedMode, setSelectedMode] = useState<'recreate' | 'transfer'>('recreate');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultImage, setResultImage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [processingTime, setProcessingTime] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 检查API状态
  const apiStatus = checkAPIStatus();

  // 预定义的风格选项（专门为Flux模型优化）
  const styleOptions: StyleOption[] = [
    {
      id: 'anime',
      name: '动漫风格',
      description: '将图片转换为日式动漫风格',
      preview: '/style-previews/anime.jpg',
      prompt: 'anime style, manga art, japanese animation, cel shading, vibrant colors, detailed character design'
    },
    {
      id: 'oil-painting',
      name: '油画风格',
      description: '经典油画艺术风格',
      preview: '/style-previews/oil-painting.jpg',
      prompt: 'oil painting style, classical art, thick impasto brush strokes, renaissance masterpiece, rich textures, museum quality'
    },
    {
      id: 'watercolor',
      name: '水彩画',
      description: '清新的水彩画风格',
      preview: '/style-previews/watercolor.jpg',
      prompt: 'watercolor painting, soft flowing colors, artistic, transparent layers, paper texture, delicate brushwork'
    },
    {
      id: 'cyberpunk',
      name: '赛博朋克',
      description: '未来科技感风格',
      preview: '/style-previews/cyberpunk.jpg',
      prompt: 'cyberpunk style, neon lights, futuristic cityscape, dark atmosphere, high tech, digital art, blade runner aesthetic'
    },
    {
      id: 'vintage',
      name: '复古风格',
      description: '怀旧复古的视觉效果',
      preview: '/style-previews/vintage.jpg',
      prompt: 'vintage photography, retro style, aged paper, sepia tones, nostalgic atmosphere, film grain, classic composition'
    },
    {
      id: 'sketch',
      name: '素描风格',
      description: '黑白素描艺术风格',
      preview: '/style-previews/sketch.jpg',
      prompt: 'detailed pencil sketch, black and white drawing, artistic shading, fine linework, graphite texture, realistic rendering'
    }
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setResultImage(''); // 清除之前的结果
    }
  };

  const handleStyleSelect = (styleId: string) => {
    setSelectedStyle(styleId);
  };

  const handleProcess = async () => {
    // 根据模式验证不同的输入
    if (selectedMode !== 'recreate') {
      if (!selectedImage || !selectedStyle) {
        alert('请上传图片并选择风格');
        return;
      }
    } else {
      if (!customPrompt.trim()) {
        alert('请选择图片描述');
        return;
      }
    }

    if (!apiStatus.hasAnyProvider) {
      setError('AI服务未配置，请检查API密钥设置');
      return;
    }

    setIsProcessing(true);
    setError('');
    setResultImage('');
    
    try {
      let stylePrompt = '';
      
      if (selectedMode === 'recreate') {
        // 艺术重创模式：使用用户输入的描述
        stylePrompt = customPrompt.trim();
      } else {
        // 真实风格转换模式：使用预设风格
        const selectedStyleOption = styleOptions.find(s => s.id === selectedStyle);
        if (!selectedStyleOption) {
          throw new Error('未找到选中的风格');
        }
        stylePrompt = selectedStyleOption.prompt;
      }

      const result = await processStyleTransfer({
        image: selectedImage,
        style: selectedMode === 'recreate' ? 'custom' : selectedStyle,
        stylePrompt: stylePrompt,
        mode: selectedMode
      });

      if (result.success && result.imageUrl) {
        setResultImage(result.imageUrl);
        setProcessingTime(result.processingTime || 0);
      } else {
        setError(result.error || '处理失败，请重试');
      }
    } catch (error) {
      console.error('Style processing error:', error);
      setError(error instanceof Error ? error.message : '处理过程中发生错误');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (resultImage) {
      const link = document.createElement('a');
      link.href = resultImage;
      link.download = `styled-image-${selectedStyle}.jpg`;
      link.click();
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setPreviewUrl('');
    setSelectedStyle('');
    setCustomPrompt('');
    setSelectedMode('recreate');
    setResultImage('');
    setError('');
    setProcessingTime(0);
    setIsProcessing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          AI图片风格转换
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          上传你的图片，选择喜欢的艺术风格，让AI为你创造独特的艺术作品
        </p>
        
        {/* API状态指示 */}
        <div className="mt-4 flex justify-center">
          <div className={`
            inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
            ${apiStatus.hasAnyProvider 
              ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200' 
              : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200'
            }
          `}>
            <div className={`w-2 h-2 rounded-full ${apiStatus.hasAnyProvider ? 'bg-green-500' : 'bg-red-500'}`}></div>
            {apiStatus.hasAnyProvider ? (
              <span>AI服务已就绪 ({apiStatus.huggingFace ? 'Hugging Face' : 'Replicate'})</span>
            ) : (
              <span>AI服务未配置，请设置API密钥</span>
            )}
          </div>
        </div>
      </div>

      {/* API状态面板 */}
      <APIStatus />
      
      {/* 调试面板 */}
      <DebugPanel />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 左侧：图片上传和风格选择 */}
        <div className="space-y-6">

            {/* 模式选择区域 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              1. 选择处理模式
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className={`
                  cursor-pointer rounded-lg border-2 p-4 transition-all duration-200
                  ${selectedMode === 'recreate' 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }
                `}
                onClick={() => setSelectedMode('recreate')}
              >
                <div className="flex items-start gap-3">
                  <div className={`
                    w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5
                    ${selectedMode === 'recreate' ? 'border-blue-500' : 'border-gray-300'}
                  `}>
                    {selectedMode === 'recreate' && (
                      <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      🎨 AI艺术创作模式
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      基于上传的图片和您的文字描述，创作全新的艺术作品。完全的创意自由。
                    </p>
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                      ✓ 自由描述 ✓ 创意无限 ✓ 稳定可用
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`
                  cursor-pointer rounded-lg border-2 p-4 transition-all duration-200
                  ${selectedMode === 'transfer' 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }
                `}
                onClick={() => setSelectedMode('transfer')}
              >
                <div className="flex items-start gap-3">
                  <div className={`
                    w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5
                    ${selectedMode === 'transfer' ? 'border-blue-500' : 'border-gray-300'}
                  `}>
                    {selectedMode === 'transfer' && (
                      <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      🔄 真实风格转换
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      保持原图构图和内容，仅改变艺术风格。更接近传统的风格转换效果。
                    </p>
                    <div className="mt-2 text-xs text-orange-600 dark:text-orange-400">
                      ⚠️ 实验性功能，可能不稳定
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 图片上传区域 */}
          {selectedMode !== "recreate" && <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              2. 上传图片
            </h2>
            
            <div 
              className="upload-area border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              {previewUrl ? (
                <div className="space-y-4">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="max-w-full max-h-64 mx-auto rounded-lg shadow-md"
                  />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    点击重新选择图片
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      点击上传图片
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      支持 JPG、PNG、WebP 格式，最大 10MB
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>}

          

          {/* 根据模式显示不同的输入界面 */}
          {selectedMode === 'recreate' ? (
            /* 艺术创作模式：文字描述输入 */
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                2. 描述您想要的艺术效果
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    创作描述
                  </label>
                  <textarea
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="例如：将这张图片转换为梵高风格的油画，色彩鲜艳，笔触明显，星空背景..."
                    className="
                      w-full h-32 px-4 py-3 border border-gray-300 dark:border-gray-600 
                      rounded-lg bg-white dark:bg-gray-700 
                      text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
                      focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                      resize-none transition-colors duration-200
                    "
                  />
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                    💡 描述建议
                  </h4>
                  <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <p>• 描述想要的艺术风格：油画、水彩、动漫、素描等</p>
                    <p>• 指定色彩特点：鲜艳、柔和、黑白、复古色调等</p>
                    <p>• 添加环境元素：背景、光线、氛围等</p>
                    <p>• 越详细的描述，生成效果越精准</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* 风格转换模式：预设风格选择 */
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                3. 选择艺术风格
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                {styleOptions.map((style) => (
                  <div
                    key={style.id}
                    className={`
                      style-card relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200
                      ${selectedStyle === style.id 
                        ? 'border-blue-500 ring-2 ring-blue-500/20' 
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }
                    `}
                    onClick={() => handleStyleSelect(style.id)}
                  >
                    <div className="aspect-square bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <div className="text-4xl">🎨</div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                        {style.name}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {style.description}
                      </p>
                    </div>
                    
                    {selectedStyle === style.id && (
                      <div className="absolute top-2 right-2">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 错误提示 */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-800 dark:text-red-200 font-medium">处理失败</span>
              </div>
              <p className="text-red-700 dark:text-red-300 text-sm mt-1">{error}</p>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex gap-4">
            <button
              onClick={handleProcess}
              disabled={(selectedMode !== 'recreate' && !selectedImage) ||(selectedMode !== 'recreate' && !selectedStyle ) || isProcessing || !apiStatus.hasAnyProvider}
              className="
                flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium
                hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed
                transition-colors duration-200
              "
            >
              {isProcessing ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>AI处理中...</span>
                </div>
              ) : (
                '开始转换'
              )}
            </button>
            
            <button
              onClick={handleReset}
              className="
                px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 
                rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600
                transition-colors duration-200
              "
            >
              重置
            </button>
          </div>
        </div>

        {/* 右侧：结果展示 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            4. 处理结果
          </h2>
          
          <div className="aspect-square bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            {isProcessing ? (
              <div className="text-center processing-animation">
                <div className="w-16 h-16 mx-auto mb-4">
                  <svg className="w-full h-full animate-spin text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <p className="text-gray-600 dark:text-gray-400 font-medium">
                  AI正在处理您的图片...
                </p>
                <div className="mt-3 space-y-1 text-sm text-gray-500 dark:text-gray-500">
                  {selectedMode === 'recreate' ? (
                    <>
                      <p>🔍 分析上传的图片内容</p>
                      <p>📝 理解您的创作描述</p>
                      <p>🎨 融合创作全新艺术作品</p>
                    </>
                  ) : (
                    <>
                      <p>🔄 保持原图构图结构</p>
                      <p>🎨 应用风格转换算法</p>
                      <p>✨ 生成风格转换结果</p>
                    </>
                  )}
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-600 mt-4">
                  {selectedMode === 'recreate' 
                    ? 'AI艺术创作模式，预计需要30-120秒' 
                    : '真实转换模式，预计需要60-180秒'
                  }
                </p>
              </div>
            ) : resultImage ? (
              <div className="w-full h-full result-image">
                <img 
                  src={resultImage} 
                  alt="Result" 
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
            ) : (
              <div className="text-center">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-600 dark:text-gray-400">
                  转换结果将在这里显示
                </p>
              </div>
            )}
          </div>

          {resultImage && (
            <div className="mt-6 space-y-4">
              <button
                onClick={handleDownload}
                className="
                  w-full px-6 py-3 bg-green-600 text-white rounded-lg font-medium
                  hover:bg-green-700 transition-colors duration-200
                "
              >
                下载结果图片
              </button>
              
              <div className="text-center">
                {processingTime > 0 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    处理时间: {(processingTime / 1000).toFixed(1)}秒
                  </p>
                )}
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  满意这个结果吗？可以尝试其他风格或上传新图片
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 使用说明 */}
      <div className="mt-12 space-y-6">
        {/* 模式对比说明 */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            🎯 两种模式对比
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">
                🎨 AI艺术创作模式
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• 基于图片和文字描述创作</li>
                <li>• 完全的创意自由和表达</li>
                <li>• 可能与原图差异较大</li>
                <li>• 稳定可靠，推荐使用</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <h4 className="font-semibold text-purple-600 dark:text-purple-400 mb-2">
                🔄 真实风格转换
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• 保持原图构图和内容</li>
                <li>• 仅改变艺术风格表现</li>
                <li>• 更接近传统风格转换</li>
                <li>• 实验性功能，可能不稳定</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 使用提示 */}
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-4">
            💡 使用建议
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-800 dark:text-green-200">
            <div className="flex items-start gap-2">
              <span className="text-green-500">•</span>
              <span>新手推荐使用AI艺术创作模式</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-500">•</span>
              <span>人物照片建议选择动漫或油画风格</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-500">•</span>
              <span>风景照片适合水彩画或复古风格</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-500">•</span>
              <span>上传清晰度高的图片效果更好</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-500">•</span>
              <span>真实转换模式处理时间较长</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-500">•</span>
              <span>详细的描述能获得更好的创作效果</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StyleTransfer;