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
    id:number
    imgUrl:string
    like: number
    createdAt: string
  }>({
    title: '',
    content: '',
    id:0,
    imgUrl:'',
    like:0,
    createdAt:''
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
    return <div className="prose dark:prose-invert w-full max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  };

  return (
    <div className="max-w-3xl mx-auto p-4" >
      <div className="w-full h-full overflow-hidden max-h-[200px]">
        <img src={data.imgUrl} className="h-full object-cover " />
      </div>
      <p className="text-3xl font-bold mb-[10px] text-gray-900 dark:text-white">{data?.title}</p>
      <p className="text-xl text-gray-600 dark:text-gray-400 font-[500] mb-[20px]">匿名牛马 - {new Date(data.createdAt).toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      })}</p>
      <MarkdownRenderer content={data?.content} />
    </div>
  );
};

export default Post;
