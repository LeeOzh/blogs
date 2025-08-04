import PostCard from "@/components/PostCard";
import { useCallback, useEffect, useRef, useState } from "react";

const PostList = ({
  posts,
  callback
}: {
  posts: {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    imgUrl?: string;
    like: number;
  }[];
  callback:() => void
}) => {
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [columns, setColumns] = useState<number>(1);
  const [columnsDataList, setColumnsDataList] = useState<any[][]>([]);
  const timer = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const columnConfig = [
    { minWidth: 1400, column: 5 },
    { minWidth: 1000, column: 4 },
    { minWidth: 768, column: 3 },
    { minWidth: 480, column: 2 },
  ];

  // 给每个 post 添加随机高度（模拟不同内容高度）
  const enrichWithHeight = (data: typeof posts) =>
    data.map((item) => ({
      ...item,
      estimatedHeight: 200 + Math.floor(Math.random() * 200), // 200~400 px
    }));

  // JS 分列逻辑（根据 estimatedHeight）
  const distributeToColumns = (
    data: ReturnType<typeof enrichWithHeight>,
    columnCount: number
  ) => {
    const columns: any[][] = Array.from({ length: columnCount }, () => []);
    const heights = new Array(columnCount).fill(0);

    data.forEach((item) => {
      const minIndex = heights.indexOf(Math.min(...heights));
      columns[minIndex].push(item);
      heights[minIndex] += (item.estimatedHeight+90);
    });

    return columns;
  };

  // 获取容器宽度
  const getContainerWidth = useCallback(() => {
    if (containerRef.current) {
      const width = containerRef.current.clientWidth;
      setContainerWidth(width);
    } else {
      // 如果容器还没有渲染，使用window宽度作为fallback
      setContainerWidth(window.innerWidth - 32); // 减去padding
    }
  }, []);

  const timerListener = useCallback(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      getContainerWidth();
    }, 500);
  }, [getContainerWidth]);

  // 初始化和 resize
  useEffect(() => {
    // 使用ResizeObserver监听容器大小变化
    if (containerRef.current && 'ResizeObserver' in window) {
      resizeObserverRef.current = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const width = entry.contentRect.width;
          setContainerWidth(width);
        }
      });
      
      resizeObserverRef.current.observe(containerRef.current);
    } else {
      // 降级到传统方法
      const timer = setTimeout(() => {
        getContainerWidth();
      }, 100);
      
      window.addEventListener("resize", timerListener);
      
      return () => {
        clearTimeout(timer);
        window.removeEventListener("resize", timerListener);
      };
    }

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, [getContainerWidth, timerListener]);

  // 根据宽度设定列数
  useEffect(() => {
    if (containerWidth === 0) return; // 等待容器宽度获取完成
    
    const obj = columnConfig.find((item) => containerWidth >= item.minWidth);
    const newColumns = obj?.column || 1;
    
    // 只有当列数真正改变时才更新
    if (newColumns !== columns) {
      setColumns(newColumns);
    }
  }, [containerWidth, columns]);

  // 初始化分布
  useEffect(() => {
    const enriched = enrichWithHeight(posts);
    const distributed = distributeToColumns(enriched, columns);
    setColumnsDataList(distributed);
  }, [columns, posts]);

  return (
    <>
      <div
        ref={containerRef}
        id="post_container"
        className="w-full flex flex-row justify-start items-start gap-2"
        style={{ minHeight: '200px' }}
      >
        {columnsDataList.length > 0 ? (
          columnsDataList.map((column, colIndex) => (
            <div
              key={colIndex}
              className="flex flex-1 flex-col min-h-0 items-center gap-2"
              style={{ width: `${100 / columns}%` }}
            >
              {column.map((item) => (
                <PostCard
                  key={item.id}
                  {...item}
                  callBack={callback}
                />
              ))}
            </div>
          ))
        ) : (
          <div className="w-full text-center py-8 text-gray-500">
            加载中...
          </div>
        )}
      </div>
    </>
  );
};

export default PostList;
