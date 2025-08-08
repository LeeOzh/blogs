import { getPostById, updatePostLike } from "@/services/post";
import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';
import './post.css';

interface PostData {
  title: string;
  content: string;
  id: number;
  imgUrl: string;
  like: number;
  createdAt: string;
}

const Post = () => {
  const { id } = useParams<string>();
  const navigate = useNavigate();
  const [data, setData] = useState<PostData>({
    title: '',
    content: '',
    id: 0,
    imgUrl: '',
    like: 0,
    createdAt: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isLiking, setIsLiking] = useState(false);

  const getDetails = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await getPostById(+id as number);
      if (res) {
        setData(res.data);
      }
    } catch (error) {
      console.error('获取文章详情失败:', error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    getDetails();
  }, [id, getDetails]);

  const handleLike = async () => {
    if (isLiking) return;
    
    setIsLiking(true);
    let like = true;
    const likeLocal = localStorage.getItem("likeData");
    if (likeLocal) {
      const likeData = JSON.parse(likeLocal);
      if (likeData.includes(data.id)) {
        like = false;
      }
    }
    
    try {
      const res = await updatePostLike({
        id: data.id,
        like
      });
      
      if (res?.data === 'success') {
        const likeLocal = localStorage.getItem("likeData");
        if (likeLocal) {
          const likeData = JSON.parse(likeLocal);
          if (!like) {
            const index = likeData.indexOf(data.id);
            likeData.splice(index, 1);
          } else {
            likeData.push(data.id);
          }
          localStorage.setItem("likeData", JSON.stringify(likeData));
        } else {
          localStorage.setItem("likeData", JSON.stringify([data.id]));
        }
        
        // 更新本地状态
        setData(prev => ({
          ...prev,
          like: like ? prev.like + 1 : prev.like - 1
        }));
      }
    } catch (error) {
      console.error('点赞失败:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const isLiked = () => {
    const likeLocal = localStorage.getItem("likeData");
    if (likeLocal) {
      const likeData = JSON.parse(likeLocal);
      return likeData.includes(data.id);
    }
    return false;
  };

  const MarkdownRenderer = ({ content }: { content: string }) => {
    // 自定义组件
    const components: Components = {
      // 自定义代码块
      code: ({ node, inline, className, children, ...props }) => {
        const match = /language-(\w+)/.exec(className || '');
        const language = match ? match[1] : '';
        
        if (inline) {
          return (
            <code 
              className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-pink-600 dark:text-pink-400 rounded text-sm font-mono"
              {...props}
            >
              {children}
            </code>
          );
        }

        return (
          <div className="relative group">
            {language && (
              <div className="absolute top-0 right-0 px-3 py-1 bg-gray-700 text-gray-300 text-xs rounded-bl-md rounded-tr-lg font-mono">
                {language}
              </div>
            )}
            <pre className="bg-gray-900 dark:bg-gray-950 text-gray-100 p-4 rounded-lg overflow-x-auto border border-gray-200 dark:border-gray-700">
              <code className="font-mono text-sm" {...props}>
                {children}
              </code>
            </pre>
          </div>
        );
      },

      // 自定义引用块
      blockquote: ({ children }) => (
        <blockquote className="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 pl-6 pr-4 py-4 my-6 italic text-gray-700 dark:text-gray-300 rounded-r-lg">
          {children}
        </blockquote>
      ),

      // 自定义表格
      table: ({ children }) => (
        <div className="overflow-x-auto my-6">
          <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            {children}
          </table>
        </div>
      ),

      // 自定义表头
      thead: ({ children }) => (
        <thead className="bg-gray-50 dark:bg-gray-800">
          {children}
        </thead>
      ),

      // 自定义表格单元格
      th: ({ children }) => (
        <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">
          {children}
        </th>
      ),

      td: ({ children }) => (
        <td className="px-4 py-3 text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
          {children}
        </td>
      ),

      // 自定义链接
      a: ({ href, children }) => (
        <a 
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline decoration-2 underline-offset-2 hover:decoration-blue-600 dark:hover:decoration-blue-400 transition-colors"
        >
          {children}
        </a>
      ),

      // 自定义图片
      img: ({ src, alt }) => (
        <div className="my-8 text-center">
          <img 
            src={src} 
            alt={alt}
            className="max-w-full h-auto rounded-lg shadow-lg mx-auto border border-gray-200 dark:border-gray-700"
            loading="lazy"
          />
          {alt && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 italic">
              {alt}
            </p>
          )}
        </div>
      ),

      // 自定义标题
      h1: ({ children }) => (
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-8 mb-4 pb-2 border-b-2 border-gray-200 dark:border-gray-700">
          {children}
        </h1>
      ),

      h2: ({ children }) => (
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
          {children}
        </h2>
      ),

      h3: ({ children }) => (
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
          {children}
        </h3>
      ),

      // 自定义列表
      ul: ({ children }) => (
        <ul className="list-disc list-inside space-y-2 my-4 text-gray-700 dark:text-gray-300">
          {children}
        </ul>
      ),

      ol: ({ children }) => (
        <ol className="list-decimal list-inside space-y-2 my-4 text-gray-700 dark:text-gray-300">
          {children}
        </ol>
      ),

      li: ({ children }) => (
        <li className="leading-relaxed">
          {children}
        </li>
      ),

      // 自定义段落
      p: ({ children }) => (
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 text-justify">
          {children}
        </p>
      ),

      // 自定义分割线
      hr: () => (
        <hr className="my-8 border-t-2 border-gray-200 dark:border-gray-700" />
      ),
    };

    return (
      <div className="prose-container">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={components}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            {/* 返回按钮骨架 */}
            <div className="h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-8"></div>
            
            {/* 图片骨架 */}
            <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-xl mb-8"></div>
            
            {/* 标题骨架 */}
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="h-6 w-1/3 bg-gray-200 dark:bg-gray-700 rounded mb-8"></div>
            
            {/* 内容骨架 */}
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 返回按钮 */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 mb-8 group"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>返回</span>
        </button>

        {/* 文章内容容器 */}
        <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* 文章头图 */}
          {data.imgUrl && (
            <div className="w-full h-64 md:h-80 overflow-hidden">
              <img 
                src={data.imgUrl} 
                alt={data.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          )}

          {/* 文章内容 */}
          <div className="p-8 md:p-12">
            {/* 文章标题 */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              {data.title}
            </h1>

            {/* 文章元信息 */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4">
                {/* 作者信息 */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <img className="w-6 h-6" src="/nm.svg" alt="作者头像" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">匿名牛马</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(data.createdAt).toLocaleDateString('zh-CN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                {/* 阅读时间估算 */}
                <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{Math.ceil(data.content.length / 500)} 分钟阅读</span>
                </div>
              </div>

              {/* 点赞按钮 */}
              <button
                onClick={handleLike}
                disabled={isLiking}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200
                  ${isLiked() 
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }
                  ${isLiking ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
                `}
              >
                {isLiked() ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                )}
                <span className="font-medium">{data.like}</span>
              </button>
            </div>

            {/* 文章正文 */}
            <div className="prose-container">
              <MarkdownRenderer content={data.content} />
            </div>
          </div>
        </article>

        {/* 底部操作栏 */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-gray-600 dark:text-gray-400">喜欢这篇文章吗？</span>
              <button
                onClick={handleLike}
                disabled={isLiking}
                className={`
                  flex items-center gap-2 px-6 py-2 rounded-full font-medium transition-all duration-200
                  ${isLiked() 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                  }
                  ${isLiking ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 shadow-lg'}
                `}
              >
                {isLiked() ? '已点赞' : '点赞支持'}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
