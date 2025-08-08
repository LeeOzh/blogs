import {HashRouter as Router, Routes, Route, } from "react-router-dom";
import Home from "@/pages/home/index";
import Post from "@/pages/post/index";
import Layout from "@/components/Layout";
import Tools from "@/pages/tools";
import StyleTransfer from "@/pages/style-transfer";
import Resume from "@/pages/resume";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />} >
          <Route index element={<Home />} />
          <Route path="/post/:id" element={<Post />} />

          <Route path="/tools" element={<Tools />} />
          <Route path="/style-transfer" element={<StyleTransfer />} />
          <Route path="/resume" element={<Resume />} />
        </Route>
      </Routes>
    </Router>
    
  );
};

export default AppRoutes;
