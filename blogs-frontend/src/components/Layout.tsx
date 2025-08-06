import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import clsx from 'clsx';
import ThemeToggle from './ThemeToggle';

const MenuItem = ({ text, to, onClick }: { text: string; to: string; onClick?: () => void }) => (
  <Link
    to={to}
    onClick={onClick}
    className="
      px-4 py-2 rounded-full
      text-gray-700 dark:text-white
      hover:text-gray-900 dark:hover:text-gray-100
      hover:bg-gray-100 dark:hover:bg-gray-700
      transition-all duration-200
      font-medium
    "
  >
    {text}
  </Link>
);

const Layout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(prev => !prev);
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* 移动端顶部导航 */}
      <header className="md:hidden absolute top-4 left-4 right-4 z-50">
        <div className="flex items-center justify-between">
          {/* 移动端菜单按钮 */}
          <button
            onClick={toggleMenu}
            className="
              flex items-center gap-2 px-4 py-2 rounded-full
              bg-white/80 dark:bg-gray-800/80
              backdrop-blur-md
              border border-gray-200 dark:border-gray-700
              text-gray-700 dark:text-gray-300
              hover:bg-white dark:hover:bg-gray-800
              transition-colors duration-200
              shadow-sm
            "
          >
            <span>Menu</span>
            <svg
              className={clsx("w-4 h-4 transition-transform duration-200", menuOpen && "rotate-180")}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* 移动端主题切换 */}
          <div className="
            bg-white/80 dark:bg-gray-800/80 
            backdrop-blur-md 
            border border-gray-200 dark:border-gray-700 
            rounded-full 
            shadow-sm
          ">
            <ThemeToggle />
          </div>
        </div>

        {/* 移动端下拉菜单 */}
        <div
          className={clsx(
            "mt-2 overflow-hidden transition-all duration-300 ease-in-out bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg",
            menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="flex flex-col gap-1 p-4">
            <MenuItem text="HOME" to="/" onClick={closeMenu} />
            <MenuItem text="Tools" to="/tools" onClick={closeMenu} />
            <MenuItem text="ADD" to="/add" onClick={closeMenu} />
            <MenuItem text="AI Transfer " to="/style-transfer" onClick={closeMenu} />
            <MenuItem text="Resume" to="/resume" onClick={closeMenu} />
          </div>
        </div>
      </header>

      {/* 桌面端顶部导航 */}
      <header className="hidden md:block absolute top-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex items-center justify-between gap-4">
          {/* 桌面端导航菜单 */}
          <nav className="flex items-center gap-1 px-4 py-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 shadow-sm">
            <MenuItem text="HOME" to="/" />
            <MenuItem text="Tools" to="/tools" />
            <MenuItem text="ADD" to="/add" />
            <MenuItem text="AI Transfer " to="/style-transfer" />
            <MenuItem text="Resume" to="/resume" />
          </nav>

          {/* 桌面端主题切换 */}
          <div className="
            bg-white/80 dark:bg-gray-800/80 
            backdrop-blur-md 
            border border-gray-200 dark:border-gray-700 
            rounded-full 
            shadow-sm
          ">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main>
        <div className="max-w-6xl mx-auto px-4 md:px-6 pt-1.5" >
          <div className="pt-16 md:pt-20 w-full">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
