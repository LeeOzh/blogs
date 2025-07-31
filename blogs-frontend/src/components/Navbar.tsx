const Navbar = () => {
  return (
    <nav className="bg-gray-900 dark:bg-gray-800 text-white p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-4xl font-bold text-white">My Blog</h1>
        <button className="bg-blue-500 dark:bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 dark:hover:bg-blue-500 text-white transition-colors">
          登录 / 注册
        </button>
      </div>
    </nav>
  );
};

export default Navbar;