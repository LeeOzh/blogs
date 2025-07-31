import { useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import { createPost } from "@/services/post";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [content, setContent] = useState<string | undefined>("");

  const handleSubmit = async () => {
    if (!title || !content) {
      alert("标题和内容不能为空！");
      return;
    }
    console.log(title,content)
    const response = await createPost({ title, content, imgUrl });

    if (response?.data) {
      alert("留言成功");
      setTitle("");
      setContent("");
    } else {
      alert("留言失败，请重试！");
    }
  };

  return (
    <div className="md:w-[100%] lg:w-[80%] mx-auto p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">留言</h1>
      <input
        type="text"
        className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded mb-4"
        placeholder="留言标题"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded mb-4"
        placeholder="头图链接"
        value={imgUrl}
        onChange={(e) => setImgUrl(e.target.value)}
      />
      <MDEditor
        value={content}
        onChange={setContent}
        height={400}
        className="border rounded"
      />
      <button
        onClick={handleSubmit}
        className="mt-4 bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
      >
        发送留言
      </button>
    </div>
  );
};

export default CreatePost;
