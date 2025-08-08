import { Link } from 'react-router-dom';

interface HeroPost {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  imgUrl?: string;
  like: number;
}

interface HeroSectionProps {
  featuredPost?: HeroPost;
}

const HeroSection = ({ featuredPost }: HeroSectionProps) => {
  if (!featuredPost) {
    return (
      <div className="relative h-96 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl overflow-hidden mb-12">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative h-full flex items-center justify-center text-center text-white px-6">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">欢迎来到我的博客</h1>
            <p className="text-xl md:text-2xl opacity-90 mb-8">分享技术、生活与思考</p>
            <Link 
              to="/tools" 
              className="inline-block px-8 py-3 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-200"
            >
              探索工具
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden mb-12 group cursor-pointer">
      <Link to={`/post/${featuredPost.id}`}>
        <div className="absolute inset-0">
          <img 
            src={featuredPost.imgUrl || '/placeholder.jpg'} 
            alt={featuredPost.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
        </div>
        
        <div className="relative h-full flex items-end p-6 md:p-8">
          <div className="text-white">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 bg-blue-600 rounded-full text-sm font-medium">
                精选文章
              </span>
              <span className="text-sm opacity-80">
                {new Date(featuredPost.createdAt).toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-bold mb-3 line-clamp-2">
              {featuredPost.title}
            </h1>
            <p className="text-lg opacity-90 line-clamp-2 max-w-2xl">
              {featuredPost.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
            </p>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                </svg>
                <span>{featuredPost.like}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default HeroSection;