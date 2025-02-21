import { Link, Outlet } from 'react-router-dom';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';

const  MeunItem = ({text, to}:{text: string, to: string}) => {
  return <span className=' transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:text-gray-500 hover:cursor-pointer'><Link to={to}>{text}</Link></span>
};
const Layout = () => {
  
  return (
    <div className="h-screen w-screen grid grid-rows-[80px_1fr] grid-cols-[80px_1fr_80px] text-white">
      
      {/* 顶部 - HOME */}
      <header className="col-span-3 flex items-center justify-center bg-gray-200 text-2xl font-bold">
        <MeunItem text="HOME" to='/' />
      </header>

      {/* 左侧 - ABOUT */}
      <aside className="row-span-2 flex items-center justify-center bg-gray-300  writing-mode-vertical-lr">
        <MeunItem text="ABOUT" to='/about' />
      </aside>

      {/* 主要内容区（可以滚动） */}
      <main className="h-full w-full overflow-hidden bg-gray-100 p-10">
        <SimpleBar style={{maxHeight: '100%'}}>
          <Outlet />
        </SimpleBar>
      </main>

      {/* 右侧 - CONTACT */}
      <aside className="row-span-2 flex items-center justify-center bg-gray-300 writing-mode-vertical-lr">
        <MeunItem text="ADD" to='/add' />
      </aside>

      {/* 底部 - PROJECTS（调整高度） */}
      <footer className="col-span-3 flex items-center justify-center bg-gray-200 h-[60px]">
        <MeunItem text="PROJECTS" to='/projects' />
      </footer>
    </div>
  );
};

export default Layout;
