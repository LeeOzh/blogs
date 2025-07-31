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

  const columnConfig = [
    { minWidth: 1400, column: 5 },
    { minWidth: 1000, column: 4 },
    { minWidth: 580, column: 3 },
    { minWidth: 300, column: 2 },
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
  const getContainerWidth = () => {
    const container = document.getElementById("post_container");
    setContainerWidth(container?.clientWidth || 0);
  };

  // 初始化和 resize
  useEffect(() => {
    getContainerWidth();
    window.addEventListener("resize", timerListener);
    return () => {
      window.removeEventListener("resize", timerListener);
    };
  }, []);

  const timerListener = useCallback(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      getContainerWidth();
    }, 500);
  }, []);

  // 根据宽度设定列数
  useEffect(() => {
    const obj = columnConfig.find((item) => containerWidth > item.minWidth);
    setColumns(obj?.column || 1);
  }, [containerWidth]);

  // 初始化分布
  useEffect(() => {
    const enriched = enrichWithHeight(posts);
    const distributed = distributeToColumns(enriched, columns);
    setColumnsDataList(distributed);
  }, [columns, posts]);

  return (
    <>
      <div
        id="post_container"
        className="flex flex-row justify-start items-start gap-2"
      >
        {columnsDataList.map((column, colIndex) => (
          <div
            key={colIndex}
            className="flex flex-1 flex-col min-h-0 items-center gap-2"
          >
            {column.map((item, index) => (
              <PostCard
                key={item.id}
                {...item}
                callBack={callback}
              />
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

export default PostList;
