import { useEffect, useState } from "react";
import { getPostList } from "../../services/post";
import PostList from "./components/PostList";
import PostGrid from "./components/PostGrid";
import HeroSection from "./components/HeroSection";
import CategoryFilter from "./components/CategoryFilter";
import SearchBar from "./components/SearchBar";
import QuickActions from "./components/QuickActions";

interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  imgUrl?: string;
  like: number;
}

const Home = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [activeCategory, setActiveCategory] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'masonry' | 'grid'>('masonry');

  useEffect(() => {
    getPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [posts, activeCategory, searchQuery]);

  const getPosts = async () => {
    const res = await getPostList();
    setPosts(res.data);
  };

  const filterPosts = () => {
    let filtered = posts;

    // 搜索过滤
    if (searchQuery) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 分类过滤（暂时保留全部，后续可以根据实际分类字段调整）
    if (activeCategory !== '全部') {
      // 这里可以根据实际的分类字段进行过滤
      // filtered = filtered.filter(post => post.category === activeCategory);
    }

    setFilteredPosts(filtered);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  // 获取精选文章（点赞数最高的文章）
  const featuredPost = posts.length > 0 
    ? posts.reduce((prev, current) => (prev.like > current.like) ? prev : current)
    : undefined;

  // 模拟分类数据（后续可以从后端获取）
  const categories = ['技术', '生活', '思考', '工具'];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <HeroSection featuredPost={featuredPost} />
      
      {/* Quick Actions */}
      <QuickActions />
      
      {/* Search Bar */}
      <SearchBar onSearch={handleSearch} />
      
      {/* Category Filter */}
      <CategoryFilter 
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center border border-gray-100 dark:border-gray-700">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{posts.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">文章总数</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center border border-gray-100 dark:border-gray-700">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {posts.reduce((sum, post) => sum + post.like, 0)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">总点赞数</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center border border-gray-100 dark:border-gray-700">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{categories.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">分类数量</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center border border-gray-100 dark:border-gray-700">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {filteredPosts.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">当前显示</div>
        </div>
      </div>

      {/* Posts Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {searchQuery ? `搜索结果: "${searchQuery}"` : '最新文章'}
            </h2>
            {filteredPosts.length > 0 && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                共 {filteredPosts.length} 篇文章
              </span>
            )}
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('masonry')}
              className={`
                p-2 rounded-md transition-colors duration-200
                ${viewMode === 'masonry' 
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }
              `}
              title="瀑布流布局"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`
                p-2 rounded-md transition-colors duration-200
                ${viewMode === 'grid' 
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }
              `}
              title="网格布局"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 002 2m0 0v10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2z" />
              </svg>
            </button>
          </div>
        </div>
        
        {filteredPosts.length > 0 ? (
          viewMode === 'masonry' ? (
            <PostList posts={filteredPosts} callback={getPosts} />
          ) : (
            <PostGrid posts={filteredPosts} callback={getPosts} />
          )
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 6.5a7.966 7.966 0 00-6-2.962A7.966 7.966 0 003 6.5c0 .85.133 1.666.378 2.425m11.244 0C14.867 8.166 15 7.35 15 6.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchQuery ? '没有找到相关文章' : '暂无文章'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {searchQuery ? '尝试使用其他关键词搜索' : '开始创作你的第一篇文章吧'}
            </p>
            {!searchQuery && (
              <button 
                onClick={() => window.location.href = '#/add'}
                className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200"
              >
                创建文章
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
