import Navbar from "@/components/Navbar";
import PostCard from "@/components/PostCard";
import Timeline from "@/components/Timeline";
import { useEffect, useState } from "react";
import { getPostList } from "../../services/post";
import Layout from "../../components/Layout";

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
      {/* <Navbar /> */}
        {/* {posts.map((post, index) => (
          <PostCard key={index} post={post} />
        ))} */}
        <Layout>
          <Timeline posts={posts} />
        </Layout>
    </div>
  );
};

export default Home;
