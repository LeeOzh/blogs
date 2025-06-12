import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import clsx from 'clsx';

const MeunItem = ({ text, to, onClick }: { text: string; to: string; onClick?: () => void }) => (
  <span
    className="transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:text-gray-500 hover:cursor-pointer"
    onClick={onClick}
  >
    <Link to={to}>{text}</Link>
  </span>
);

const Layout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(prev => !prev);
  const closeMenu = () => setMenuOpen(false);

  return (
      // md:grid-rows-[80px_1fr_60px] 
    <div
      className="
        h-screen w-screen grid 
        grid-rows-[80px_1fr] 
        grid-cols-1 
        md:grid-cols-[80px_1fr_80px] 
        text-black relative
      "
    >
      {/* 顶部导航 */}
      <header className="col-span-3 flex items-center md:justify-center justify-between  bg-gray-200 text-2xl font-bold px-4">
        <MeunItem text="HOME" to="/" onClick={closeMenu} />
        <button className="md:hidden text-3xl" onClick={toggleMenu}>
          ☰
        </button>
      </header>

      {/* 折叠菜单（仅小屏显示） */}
      <div
        className={clsx(
          "absolute top-[80px] left-0 w-full bg-white shadow-md z-50 flex-col items-center gap-4 py-4 md:hidden transition-all duration-300 ease-in-out",
          menuOpen
            ? "opacity-100 translate-y-0 flex"
            : "opacity-0 -translate-y-4 pointer-events-none hidden"
        )}
      >
        <MeunItem text="Tools" to="/tools" onClick={closeMenu} />
        <MeunItem text="ADD" to="/add" onClick={closeMenu} />
        <MeunItem text="DRAW" to="/draw" onClick={closeMenu} />
      </div>

      {/* 左侧菜单（仅大屏显示） */}
      <aside className="hidden md:flex row-span-2 items-center justify-center bg-gray-300 writing-mode-vertical-lr">
        <MeunItem text="Tools" to="/tools" />
      </aside>

      {/* 主内容区 */}
      <main className="h-full w-full overflow-hidden bg-gray-100">
        <SimpleBar style={{ maxHeight: '100%' }}>
          <Outlet />
        </SimpleBar>
      </main>

      {/* 右侧菜单（仅大屏显示） */}
      <aside className="hidden md:flex row-span-2 items-center justify-center bg-gray-300 writing-mode-vertical-lr">
        <MeunItem text="ADD" to="/add" />
      </aside>

      {/* 底部菜单（仅大屏显示） */}
      <footer className="hidden md:flex col-span-3 items-center justify-center bg-gray-200 h-[60px]">
        <MeunItem text="DRAW" to="/draw" />
      </footer>
    </div>
  );
};

export default Layout;
