import { debug } from "console";
import { useEffect, useRef } from "react";

const Timeline = ({ posts }: { posts: { id: number; title: string; content: string; createdAt: string; image?: string }[] }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        console.log('entry',entry)
        if(entry.isIntersecting) {
          console.log('intersecting',entry.isIntersecting)
          entry.target.classList.add('animate-fade-in-up-right')
        }
      },
      {threshold: .8}
    )
      setTimeout(() => {
        const el = document.querySelectorAll('.item-in')
        console.log('el',el)
        if(el) {
          el.forEach((cel) => {
            if(cel.getBoundingClientRect().top < window.innerHeight) {
              cel.classList.add('animate-fade-in-up-right')
            }else {
              observer.observe(cel)
            }
          });
        }
      },200)
    return () => observer.disconnect()
  },[])

  return (
    <div 
    className="relative  mx-auto py-10">

      {/* 时间线 */}
      <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-500 z-0"></div>

      <div className="flex flex-col space-y-10 relative ">
        {posts.map((post, index) => (
          <div key={post.id} className={`relative flex items-center w-full ${index % 2 === 0 ? "justify-start" : "justify-end"}`}>
            
            {/* 时间线上的圆点 */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white border-4 border-gray-500 rounded-full z-10">
            <div className={`absolute w-18 h-1 bg-gray-500 top-2/5  ${index % 2 === 0 ? "left-20/12" : "right-20/12"}`} ></div>
            </div>

            {/* 文章卡片 */}
            <div 
            ref={containerRef}
            className={`item-in bg-white shadow-lg rounded-lg p-6 w-3/12 z-10 ${index % 2 === 0 ? "ml-189" : "mr-189"} opacity-0 transform translate-y-10 transition-all duration-400 `}>
              <p className="text-gray-500 text-sm">{new Date(post.createdAt).toLocaleDateString()}</p>
              <h2 className="text-xl font-bold">{post.title}</h2>
              {post.image && <img src={post.image} alt={post.title} className="my-3 rounded-lg" />}
              <p className="text-gray-700">{post.content.substring(0, 100)}...</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
