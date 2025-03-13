import { useNavigate } from 'react-router-dom';
import { forwardRef, useState } from 'react';
import { getWeekDay } from 'timedated';

const Header = forwardRef<HTMLDivElement, {onColorChange: () => void}>(({onColorChange}, ref) => {
  const [toggleSettings, setToggleSettings] = useState(false);
  const navigate = useNavigate();

  const quitApp = () => {
    window.close();
  };

  const settings = () => {
    toggleSettings ? navigate('/') : navigate('/settings');
    setToggleSettings(!toggleSettings);
  };

  return (
    <header className="[-webkit-app-region:_drag] fixed font-header text-xl flex h-10 w-full items-center justify-center z-[2] top-0" ref={ref}>
      <div 
       className="fixed top-1 left-1 pl-2.5 pt-[10px] bg-ui size-8 hover:cursor-pointer duration-200 btn rounded-[5px] [&>*]:hover:opacity-80 [&>*]:hover:!border-slate-700" 
       onClick={onColorChange} id="color-con">
        <div 
         className="transition size-5 rounded-[30px] border-[1.5px] fixed top-[10px] left-[10px] bg-white border-slate-300"
         id="color-btn"></div>
      </div>
      <div id="day" 
       className="text-center [&>*]:hover:scale-95 font-bold select-none hover:cursor-pointer w-32 h-8 leading-5 pt-1.5 pl-7 bg-ui transition-all duration-500 text-slate-700 hover:!text-slate-800 btn rounded-[5px]" 
       onClick={settings}>
        <div className="fixed left-1/2 -translate-x-1/2 transition-all">{getWeekDay(2)}</div>
      </div>
      <div 
       className="hover:cursor-pointer hover:!text-slate-700 bg-ui fixed right-1 top-1 size-8 pl-[6.5px] pt-[5px] duration-200 select-none text-2xl btn leading-[22px] rounded-[5px] !border-none"
       id="close-btn" onClick={quitApp}>&#x2715;</div>
    </header>
  );
});

export default Header;