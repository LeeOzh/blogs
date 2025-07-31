import { updatePostLike } from "@/services/post";
import { Link } from "react-router-dom";

type PostCardProps = {imgUrl:string,title:string,id:number,height: number, createdAt: string;like:number,callBack:() => void, content?: string}

const PostCard = (data:PostCardProps) => {

 const handleLike = async (id:number) => {
  let like = true;
  const likeLocal = localStorage.getItem("likeData");
  if(likeLocal) {
    const likeData = JSON.parse(likeLocal);
    if(likeData.includes(id)) {
      like = false;
    }
  }
  const res = await updatePostLike({
      id,
      like
    });
    if(res) {
      console.log(res);
      if(res?.data === 'success') {
        const likeLocal = localStorage.getItem("likeData");
        if(likeLocal) {
          const likeData = JSON.parse(likeLocal);
          if(!like) {
            const index = likeData.indexOf(id);
            likeData.splice(index, 1);
            console.log(likeData);
          }else {
            likeData.push(id);
          }
          localStorage.setItem("likeData", JSON.stringify(likeData));
        } else {
          localStorage.setItem("likeData", JSON.stringify([id]));
        }
        data?.callBack();
      }
    }
  };

  const isLiked = () => {
    const likeLocal = localStorage.getItem("likeData");
    if(likeLocal) {
      const likeData = JSON.parse(likeLocal);
      if(likeData.includes(data.id)) {
        return true;
      }
    }
    return false;
  };

  return (
     <div className="group rounded-xl w-full overflow-hidden bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center pl-3 py-3">
        <div className="rounded-full overflow-hidden w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 flex justify-center items-center">
          <img className="w-5 h-5" src="/nm.svg" alt="" />
        </div>
       <div className="ml-3 flex-1">
         <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">匿名牛马</span>
         <div className="text-xs text-gray-500 dark:text-gray-400">
           {new Date(data.createdAt).toLocaleDateString()}
         </div>
       </div>
      </div>
       <Link to={`/post/${data.id}`} className="block">
          <div className="relative overflow-hidden">
            <div className="w-full" style={{height: data.height}}>
              <img 
                src={data.imgUrl} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                alt={data.title}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <div className="p-4">
            <h3 className="text-gray-900 dark:text-white font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {data.title}
            </h3>
            {data.content && (
              <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-3">
                {data.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
              </p>
            )}
          </div>
        </Link>
        <div className="flex items-center justify-between px-4 pb-4">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <button 
              onClick={() => handleLike(data.id)}
              className="flex items-center gap-1 hover:text-red-500 transition-colors group/like"
            >
              {isLiked() ? (
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 group-hover/like:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              )}
              <span className="text-sm font-medium">{data?.like}</span>
            </button>
          </div>
          <div className="text-xs text-gray-400">
            阅读更多 →
          </div>
        </div>
     </div>
  );
};

export default PostCard;
