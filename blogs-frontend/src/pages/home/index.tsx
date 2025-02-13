import Navbar from "@/components/Navbar";
import PostCard from "@/components/PostCard";

const Home = () => {
  // 假数据，后面可以用 API 获取
  const posts = [
    { title: "第一篇文章", summary: "这是文章摘要..." },
    { title: "第二篇文章", summary: "这是一篇很棒的博客..." },
  ];

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post, index) => (
          <PostCard key={index} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Home;
