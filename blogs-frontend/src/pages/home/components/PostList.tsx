import { Link } from "react-router-dom";
import { updatePostLike } from "@/services/post";

const PostList = ({
  posts,
  callback
}: {
  posts: {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    imgUrl?: string;
    like: number;
  }[];
  callback: () => void
}) => {
  const handleLike = async (id: number) => {
    let like = true;
    const likeLocal = localStorage.getItem("likeData");
    if (likeLocal) {
      const likeData = JSON.parse(likeLocal);
      if (likeData.includes(id)) {
        like = false;
      }
    }
    
    try {
      const res = await updatePostLike({
        id,
        like
      });
      
      if (res?.data === 'success') {
        const likeLocal = localStorage.getItem("likeData");
        if (likeLocal) {
          const likeData = JSON.parse(likeLocal);
          if (!like) {
            const index = likeData.indexOf(id);
            likeData.splice(index, 1);
          } else {
            likeData.push(id);
          }
          localStorage.setItem("likeData", JSON.stringify(likeData));
        } else {
          localStorage.setItem("likeData", JSON.stringify([id]));
        }
        callback();
      }
    } catch (error) {
      console.error('点赞失败:', error);
    }
  };

  const isLiked = (id: number) => {
    const likeLocal = localStorage.getItem("likeData");
    if (likeLocal) {
      const likeData = JSON.parse(likeLocal);
      return likeData.includes(id);
    }
    return false;
  };

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
        >
          <div className="flex gap-6">
            {/* 左侧内容 */}
            <div className="flex-1">
              {/* 标题 */}
              <Link to={`/post/${post.id}`}>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2">
                  {post.title}
                </h2>
              </Link>

              {/* 内容摘要 */}
              <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">
                {post.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
              </p>

              {/* 底部信息 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  {/* 作者信息 */}
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <img className="w-4 h-4" src="/nm.svg" alt="" />
                    </div>
                    <span>匿名牛马</span>
                  </div>

                  {/* 发布时间 */}
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>

                  {/* 阅读数 */}
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>{Math.floor(Math.random() * 1000) + 100}</span>
                  </div>
                </div>

                {/* 点赞按钮 */}
                <button
                  onClick={() => handleLike(post.id)}
                  className="flex items-center gap-2 px-3 py-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                >
                  {isLiked(post.id) ? (
                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  )}
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {post.like}
                  </span>
                </button>
              </div>
            </div>

            {/* 右侧缩略图 */}
            {post.imgUrl && (
              <Link to={`/post/${post.id}`} className="flex-shrink-0">
                <div className="w-32 h-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 group">
                  <img
                    src={post.imgUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
              </Link>
            )}
          </div>

          {/* 标签区域 */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                前端
              </span>
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs rounded-full">
                技术
              </span>
            </div>
            
            <Link
              to={`/post/${post.id}`}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors flex items-center gap-1"
            >
              <span>阅读全文</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostList;
