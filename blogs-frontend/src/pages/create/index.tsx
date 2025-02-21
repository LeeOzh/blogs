import { useState } from "react";
import MDEditor from "@uiw/react-md-editor";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState<string | undefined>("");

  const handleSubmit = async () => {
    if (!title || !content) {
      alert("标题和内容不能为空！");
      return;
    }

    const response = await fetch("http://localhost:3000/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });

    if (response.ok) {
      alert("文章发布成功！");
      setTitle("");
      setContent("");
    } else {
      alert("发布失败，请重试！");
    }
  };

  return (
    <div className="md:w-[100%] lg:w-[80%] mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">发布新文章</h1>
      <input
        type="text"
        className="w-full p-2 border rounded mb-4"
        placeholder="文章标题"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <MDEditor
        value={content}
        onChange={setContent}
        height={400}
        className="border rounded"
      />
      <button
        onClick={handleSubmit}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        发布文章
      </button>
    </div>
  );
};

export default CreatePost;
