import { useEffect, useRef, useState } from 'react';
import { Canvas, Rect, Circle, Textbox, loadSVGFromString, util, } from 'fabric';
import font from '/font.svg'
import fonted from '/fonted.svg'
import img from '/img.svg'
import imged from '/imged.svg'
import tc from '/tc.svg'
import tced from '/tced.svg'

import type { ObjectEvents } from 'fabric';
import Tab from '@/components/Tab';

type ShapeProps = {
  left: number;
  top: number;
  width?: number;
  height?: number;
  fill?: string;
  fontSize?: number;
};

const CanvasEditor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const fabricCanvas = useRef<Canvas | null>(null);
  const [activeProps, setActiveProps] = useState<ShapeProps | null>(null);
  const [objects, setObjects] = useState<fabric.Object[]>([]);
  const [currentTab, setCurrentTab] = useState(0);


  useEffect(() => {
    if (!canvasRef.current || !wrapperRef.current) return;

    const canvasEl = canvasRef.current;
    const wrapperEl = wrapperRef.current;

    // 初始化 canvas 尺寸
    const resizeCanvas = () => {
      const width = wrapperEl.clientWidth;
      const height = wrapperEl.clientHeight;

      canvasEl.width = width;
      canvasEl.height = height;

      if (fabricCanvas.current) {
        fabricCanvas.current.setWidth(width);
        fabricCanvas.current.setHeight(height);
      }
    };

    const canvas = new Canvas(canvasEl, {
      backgroundColor: '#f8f8f8',
    });
    fabricCanvas.current = canvas;

    resizeCanvas();

    // 监听容器大小变化
    const observer = new ResizeObserver(() => {
      resizeCanvas();
    });
    observer.observe(wrapperEl);

    canvas.on('object:moving', (e) => {
      const obj = e.target;
      if (obj) {
        const gridSize = 10;
        obj.set({
          left: Math.round((obj.left ?? 0) / gridSize) * gridSize,
          top: Math.round((obj.top ?? 0) / gridSize) * gridSize,
        });
      }
    });

    canvas.on('selection:created', updateActive);
    canvas.on('selection:updated', updateActive);
    canvas.on('selection:cleared', () => setActiveProps(null));

    function updateActive(e) {
      const obj = canvas.getActiveObject();
      console.log(obj,'obj');
      if (!obj) return;
      setActiveProps({
        left: obj.left ?? 0,
        top: obj.top ?? 0,
        width: obj.width ?? undefined,
        height: obj.height ?? undefined,
        fill: obj.fill as string | undefined,
        fontSize: obj.fontSize ?? undefined,
      });
    }

    return () => {
      observer.disconnect();
      canvas.dispose();
    };
  }, []);

  const addRect = () => {
    const rect = new Rect({
      left: 100,
      top: 100,
      width: 200,
      height: 100,
      fill: '#4d7aff',
      // stroke: '#333',
      // strokeWidth: 1,
    });
    fabricCanvas.current?.add(rect);
    refreshObjects()
  };

  const addCircle = () => {
    const circle = new Circle({
      left: 0,
      top: 0,
      radius: 50,
      fill: '#f00',
      // stroke: '#333',
    });
    fabricCanvas.current?.add(circle);
    refreshObjects()
  };

  const addText = () => {
    const text = new Textbox('文本示例', {
      left: 200,
      top: 200,
      fontSize: 20,
      fill: '#333',
    });
    fabricCanvas.current?.add(text);
    refreshObjects()
  };

  const updateObject = (key: keyof ShapeProps, value: any) => {
    const obj = fabricCanvas.current?.getActiveObject();
    if (!obj) return;
    (obj as any)[key] = value;
    obj.setCoords?.();
    fabricCanvas.current?.requestRenderAll();
    setActiveProps((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  useEffect(() => {
    console.log(activeProps,'activeProps');
  },[activeProps])

  // 图层操作
  const selectObject = (obj) => {
    fabricCanvas.current?.setActiveObject(obj);
    fabricCanvas.current?.requestRenderAll();
  };
  
  const removeObject = (obj) => {
    fabricCanvas.current?.remove(obj);
    refreshObjects();
  };
  
  const moveUp = (obj) => {
    fabricCanvas.current?.bringObjectForward(obj);
    refreshObjects();
  };
  
  const moveDown = (obj: fabric.Object) => {
    fabricCanvas.current?.sendObjectBackwards(obj);
    refreshObjects();
  };

  const refreshObjects = () => {
    if (fabricCanvas.current) {
      setObjects([...fabricCanvas.current.getObjects()]);
    }
  };
 // 图层操作

 // 上传SVG
 
 const handleSVGUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file || !fabricCanvas.current) return;

  const reader = new FileReader();
  reader.onload = async () => {
    const svgString = reader.result as string;
    try {
      const { objects, options } = await loadSVGFromString(svgString);

      const group = util.groupSVGElements(objects, options);
      group.set({
        left: 100,
        top: 100,
        selectable: true,
      });

      fabricCanvas.current?.add(group);
      fabricCanvas.current?.setActiveObject(group);
      fabricCanvas.current?.requestRenderAll();
    } catch (err) {
      console.error('SVG 导入失败', err);
    }
  };

  reader.readAsText(file);
};

  return (
    <div className='flex h-screen'>
      <div className='w-[300px] bg-white flex'>
        <div className='flex-1 h-full border-r-[1px] border-gray-200'>
        <Tab items={[
          {title: '文字',value: 0,icon:[font,fonted]},
          {title: '素材',value: 1,icon:[img,imged]},
          {title: '图层',value: 2,icon:[tc,tced]},
        ]}
        align='vertical'
        onChange={(value)=>{
          console.log(value,'value');
          setCurrentTab(value);
        }}
        />
        </div>
        <div className='flex-3 w-full'>
          {currentTab === 1 && 
          <div className='flex flex-col'>
            <div className='flex w-full mb-1.5'>
              <button className='bg-white rounded-2xl' onClick={addRect}>矩形</button>
              <div className='w-12 h-6  border ml-3'></div>
            </div>
            <div className='flex w-full mb-1.5 '>
            <button className='bg-white rounded-2xl ' onClick={addCircle}>圆形</button>
              <div className='w-6 h-6 rounded-[50%] border ml-3'></div>
            </div>
            <div className='flex w-full mb-1.5 '>
            <button className='bg-white rounded-2xl' onClick={addText}>文字</button>
              <div className=' ml-3'>文本示例</div>
            </div>
            {/* 上传SVG */}
            <input
              type="file"
              accept=".svg"
              onChange={handleSVGUpload}
              className="mt-2 h-[25px] bg-amber-300"
              placeholder='上传SVG'
              title='上传SVG'
            />
          </div>
          }
      
          {currentTab === 2 && <div className=" bg-gray-50 p-2 border-l border-gray-200 text-sm overflow-y-auto">
            {/* 图层列表 */}
            <h3 className="font-bold mb-2">图层列表</h3>
            {objects.map((obj, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs mb-1">
                <span
                  className="cursor-pointer text-blue-600"
                  onClick={() => selectObject(obj)}
                >
                  {obj.type}-{idx + 1}
                </span>
                <div className="space-x-1 text-2xl">
                  <button onClick={() => moveUp(obj)}>↑</button>
                  <button onClick={() => moveDown(obj)}>↓</button>
                  <button onClick={() => removeObject(obj)}>✕</button>
                </div>
              </div>
            ))}
          </div>}
          </div>
      </div>
      <div ref={wrapperRef} className='flex-1 relative'>
        <canvas ref={canvasRef} className='w-full h-full' />
      </div>
      <div className=" bg-gray-50 p-2 border-l border-gray-200 text-sm">
      {activeProps ? (
        <div className="flex flex-col gap-2">
          <label>
            X: <input type="number" value={activeProps.left} onChange={e => updateObject('left', +e.target.value)} />
          </label>
          <label>
            Y: <input type="number" value={activeProps.top} onChange={e => updateObject('top', +e.target.value)} />
          </label>
          {activeProps.width !== undefined && (
            <label>
              宽度: <input type="number" value={activeProps.width} onChange={e => updateObject('width', +e.target.value)} />
            </label>
          )}
          {activeProps.height !== undefined && (
            <label>
              高度: <input type="number" value={activeProps.height} onChange={e => updateObject('height', +e.target.value)} />
            </label>
          )}
          <label>
            颜色: <input type="color" value={activeProps.fill ?? '#000000'} onChange={e => updateObject('fill', e.target.value)} />
          </label>
          {activeProps.fontSize !== undefined && (
            <label>
              字号: <input type="number" value={activeProps.fontSize} onChange={e => updateObject('fontSize', +e.target.value)} />
            </label>
          )}
        </div>
      ) : (
        <div className="text-gray-400">未选中对象</div>
      )}
      </div>

    </div>
  );
};

export default CanvasEditor;
