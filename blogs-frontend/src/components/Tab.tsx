import React, { useState } from 'react';

type TabItem = {
  title: string;
  content?: string;
  value:number|string
  icon?: string[]
}

interface TabProps {
  items: TabItem[];
  align?: 'horizontal' | 'vertical',
  onChange?: (value: number | string) => void;
}

const Tab:React.FunctionComponent<TabProps> = ({
  items,
  align = 'horizontal',
  onChange
}) =>{

  const [activeIndex, setActiveIndex] = useState(0);

  const handleTabClick = (index: number) => {
    setActiveIndex(index);
    if(onChange) onChange(items[index].value)
  };

  const tabClassName = {
    'horizontal': 'flex flex-row min-w-[40px] min-h-[40px] bg-white/10 dark:bg-gray-800/20 backdrop-blur-md border border-gray-200/30 dark:border-gray-600/30 rounded-lg shadow-sm',
    'vertical': 'flex flex-col min-w-[80px] min-h-[40px] bg-white/10 dark:bg-gray-800/20 backdrop-blur-md border border-gray-200/30 dark:border-gray-600/30 rounded-lg shadow-sm'
  }

  const activedClassName = {
    'horizontal': 'bg-white/20 dark:bg-gray-800/30 backdrop-blur-md border-b-2 border-[#297aff]',
    'vertical': 'bg-white/20 dark:bg-gray-800/30 backdrop-blur-md border-r-2 border-[#297aff]'
  }

  return <div>
    <div className={tabClassName[align]}>
      {items.map((item,index) => <div 
      className={`p-2 text-center font-bold min-h-[40px] leading-[40px] text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-white/10 dark:hover:bg-gray-800/20 hover:backdrop-blur-sm transition-all duration-200 ${index == activeIndex && 'text-[#297aff] dark:text-[#4a9eff]'} ${activeIndex === items.indexOf(item) ? activedClassName[align] : ''}`} 
      key={item.value}
      onClick={() => handleTabClick(index)}
      >
        {
          item?.icon && <div className='w-full text-center flex justify-center'>
          <img className='max-w-[25%] ' src={index == activeIndex ? item?.icon[1]:item?.icon[0]} alt="" />
        </div>
        }
        
        {item.title}
      </div>)}
    </div>
  </div>
}

export default Tab;