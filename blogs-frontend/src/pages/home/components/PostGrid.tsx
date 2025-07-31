import PostCard from "@/components/PostCard";

interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  imgUrl?: string;
  like: number;
}

interface PostGridProps {
  posts: Post[];
  callback: () => void;
}

const PostGrid = ({ posts, callback }: PostGridProps) => {
  // 给每个 post 添加随机高度（模拟不同内容高度）
  const enrichWithHeight = (data: Post[]) =>
    data.map((item) => ({
      ...item,
      estimatedHeight: 200 + Math.floor(Math.random() * 200), // 200~400 px
    }));

  const enrichedPosts = enrichWithHeight(posts);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {enrichedPosts.map((post) => (
        <div key={post.id} className="h-fit">
          <PostCard
            {...post}
            height={post.estimatedHeight}
            callBack={callback}
          />
        </div>
      ))}
    </div>
  );
};

export default PostGrid;