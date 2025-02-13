const Navbar = () => {
  return (
    <nav className="bg-gray-900 text-white p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-4xl font-bold">My Blog</h1>
        <button className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-700">
          登录 / 注册
        </button>
      </div>
    </nav>
  );
};

export default Navbar;