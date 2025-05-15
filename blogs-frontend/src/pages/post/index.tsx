import { getPostById } from "@/services/post";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const Post = () => {
  const { id } = useParams<string>(); // 获取 URL 中的 id 参数
  const [data, setData] = useState<{
    title: string;
    content: string;
  }>({
    title: '',
    content: ''
  });

  useEffect(() => {
    if(!id) return;
    getDetails();
  }, []);

  const getDetails = async () => {
    const res = await getPostById(+id as number);
    if(res) {
      setData(res.data);
    }
  }

  const MarkdownRenderer = ({ content }) => {
    return <div className="prose">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  };

  return (
    <div className="max-w-3xl mx-auto p-4" >
      <h1 className="text-3xl font-bold">{data?.title}</h1>
      <MarkdownRenderer content={data?.content} />
    </div>
  );
};

export default Post;
