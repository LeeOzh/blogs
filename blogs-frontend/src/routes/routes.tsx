import {HashRouter as Router, Routes, Route, } from "react-router-dom";
import Home from "@/pages/home/index";
import Post from "@/pages/post/index";
import Layout from "@/components/Layout";
import CreatePost from "@/pages/create";
import Tools from "@/pages/tools";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />} >
          <Route index element={<Home />} />
          <Route path="/post/:id" element={<Post />} />
          <Route path="/add" element={<CreatePost />} />
          <Route path="/tools" element={<Tools />} />
        </Route>
      </Routes>
    </Router>
    
  );
};

export default AppRoutes;
