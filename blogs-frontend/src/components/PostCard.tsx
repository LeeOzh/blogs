import { Link } from "react-router-dom";

const PostCard = ({ post }: { post: { id: number; title: string; summary: string } }) => {
  return (
    <div className="bg-white p-4 rounded shadow-md hover:shadow-lg transition">
      <h2 className="text-xl font-semibold">{post.title}</h2>
      <p className="text-gray-600 mt-2">{post.summary}</p>
      <Link to={`/post/${post.id}`} className="text-blue-500 mt-2 hover:underline">
        阅读更多
      </Link>
    </div>
  );
};

export default PostCard;
