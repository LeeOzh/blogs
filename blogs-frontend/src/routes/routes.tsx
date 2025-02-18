import {HashRouter as Router, Routes, Route, } from "react-router-dom";
import Home from "@/pages/home/index";
import Post from "@/pages/post/index";
import Layout from "../components/Layout";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />} >
          <Route index element={<Home />} />
          <Route path="/post/:id" element={<Post />} />
        </Route>
      </Routes>
    </Router>
    
  );
};

export default AppRoutes;
