const PostCard = ({ post }: { post: { title: string; summary: string } }) => {
  return (
    <div className="bg-white p-4 rounded shadow-md hover:shadow-lg transition">
      <h2 className="text-xl font-semibold">{post.title}</h2>
      <p className="text-gray-600 mt-8">{post.summary}</p>
      <button className="text-blue-500 mt-2 hover:underline">阅读更多</button>
    </div>
  );
};

export default PostCard;
