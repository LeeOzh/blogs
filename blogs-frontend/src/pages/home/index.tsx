import Timeline from "@/components/Timeline";
import { useEffect, useState } from "react";
import { getPostList } from "../../services/post";
import PostList from "./components/PostList";

const Home = () => {
  // 假数据，后面可以用 API 获取
  const [posts, setPosts] = useState<[]>([])  

  useEffect(() => {
    getPosts()
  },[])

  const getPosts = async () => {
    const res = await getPostList()
    setPosts(res.data)
  }
  
  return (
    <div>
        <PostList posts={posts} callback={() => {getPosts()}} />
        {/* <Timeline posts={posts} /> */}
    </div>
  );
};

export default Home;
