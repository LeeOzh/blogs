import { updatePostLike } from "@/services/post";
import { Link } from "react-router-dom";

type PostCardProps = {imgUrl:string,title:string,id:number,height: number, createdAt: string;like:number,callBack:() => void}

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
     <div className="rounded-xl w-full overflow-hidden bg-white">
      <div className="flex items-center pl-2.5 h-[50px]">
        <div className="rounded-[50%] overflow-hidden w-[30px] h-[30px] bg-gray-200 flex justify-between items-center ">
          <img className="w-3/4 h-3/4" src="../../public/nm.svg" alt="" />
        </div>
       <span className="ml-2"> 匿名牛马 - {new Date(data.createdAt).toLocaleDateString()}</span>
      </div>
       <Link to={`/post/${data.id}`} className="w-full flex justify-center flex-col cursor-default">
          <div className="w-full h-full flex justify-center items-center flex-col">
            <div className="w-full" style={{height: data.height}}>
              <img src={data.imgUrl} className="w-full h-full object-cover" />
            </div>
            <p className="text-gray-600 mt-2">{data.title}</p>
          </div>
        </Link>
        <div className="flex h-[40px] justify-center items-center">
            {isLiked() == true && <img src="../../public/gooded.svg" className="w-[20px] cursor-pointer" onClick={() => {handleLike(data.id)}} />}
            {isLiked() == false && <img src="../../public/good.svg" className="w-[20px] cursor-pointer" onClick={() => {handleLike(data.id)}} />}
             {data?.like }
          </div>
     </div>
  );
};

export default PostCard;
