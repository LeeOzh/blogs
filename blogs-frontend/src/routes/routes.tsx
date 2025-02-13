import { Routes, Route } from "react-router-dom";
import Home from "@/pages/home/index";
import Post from "@/pages/post/index";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/post/:id" element={<Post />} />
    </Routes>
  );
};

export default AppRoutes;
