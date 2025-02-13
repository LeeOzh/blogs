import { useParams } from "react-router-dom";

const Post = () => {
  const { id } = useParams(); // 获取 URL 中的 id 参数

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold">文章标题 {id}</h1>
      <p className="mt-4 text-gray-600">这里是文章内容...</p>
    </div>
  );
};

export default Post;
