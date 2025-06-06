import React, { useState, useEffect } from 'react';

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
    'horizontal': 'flex flex-row min-w-[40px] min-h-[40px]',
    'vertical': 'flex flex-col min-w-[80px] min-h-[40px]'
  }

  const activedClassName = {
    'horizontal': 'bg-gray-200 border-b-2 border-[#297aff]',
    'vertical': 'bg-gray-200 border-r-2 border-[#297aff]'
  }

  return <div>
    <div className={tabClassName[align]}>
      {items.map((item,index) => <div 
      className={`p-2 text-center font-bold min-h-[40px] leading-[40px] ${index == activeIndex && 'text-[#297aff]'} ${activeIndex === items.indexOf(item) ? activedClassName[align] : ''}`} 
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