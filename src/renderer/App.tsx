import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { ChangeEvent, forwardRef, useCallback, useEffect, useRef, useState, memo } from 'react';
import './css/App.css';
import './css/themes.css';
import { getWeekDay, getDate } from 'timedated';
import { useLocalStorage } from '@uidotdev/usehooks';
import { confetti } from '@tsparticles/confetti';

type SettingsProps = {
  bootOnStartup: boolean;
  setBootOnStartup: (arg0: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (arg0: boolean) => void;
  sound: string;
  setSound: (arg0: string) => void;
  customSound: string;
  setCustomSound: (arg0: string) => void;
  confettiEnabled: boolean;
  setConfettiEnabled: (arg0: boolean) => void;
  dayReset: boolean;
  setDayReset: (arg0: boolean) => void;
  textOutline: boolean;
  setTextOutline: (arg0: boolean) => void;
};

type ContentProps = {
  dayReset: boolean;
  soundEnabled: boolean;
  sound: string;
  customSound: string;
  confettiEnabled: boolean;
  textOutline: boolean;
  headerRef: React.RefObject<HTMLDivElement>;
};

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
    <header className="fixed font-header text-xl flex h-10 w-full items-center justify-center z-[2] top-0" ref={ref}>
      <div 
       className="fixed top-1 left-1 pl-2.5 pt-[10px] bg-ui size-8 hover:cursor-pointer duration-200 btn rounded-[5px]" 
       onClick={onColorChange} id="color-con">
        <div 
         className="transition hover:opacity-80 size-5 rounded-[30px] border-[1.5px] hover:!border-slate-700 fixed top-[10px] left-[10px] bg-white border-slate-300"
         id="color-btn"></div>
      </div>
      <div className={`${'hidden'}`}>

      </div>
      <div id="day" 
       className="font-bold hover:font-extrabold select-none hover:cursor-pointer w-32 h-8 leading-5 pt-1.5 pl-7 bg-ui transition duration-500 text-slate-700 hover:!text-slate-800 btn rounded-[5px]" 
       onClick={settings}>
        <div className="fixed top-[10px] left-[50%] -translate-x-[50%]">{getWeekDay(2)}</div>
      </div>
      <div 
       className="hover:cursor-pointer hover:!text-slate-700 bg-ui fixed right-1 top-1 size-8 pl-[6.5px] pt-[5px] duration-200 text-2xl btn leading-[22px] rounded-[5px] !border-none"
       id="close-btn" onClick={quitApp}>&#x2715;</div>
    </header>
  );
});

const CHANGELOG = [
  "Remapped color system.",
  "Enhanced task navigation.",
  "Increased bottom margin for contents page.",
  "Small windows can see full changelog.",
  "Redesigned backspace and delete functionality.",
  "Reduced redundancies.",
  "Text Outline is now More Line Space without outline.",
  "Thickness adjustment for header."
];

const Changes = () => {
  return (
    <div className="mb-10">
      <h3 className="settings-header">Changelog</h3>
      <ul>
        {CHANGELOG.map(change => <li key={change} className="ml-9 text-left">+ {change}</li>)}
      </ul>
    </div>
  );
}

const SOUNDS = [
  "Doorbell",
  "DJ Khaled",
  "Custom",
];

const Settings = ({
    dayReset, setDayReset, bootOnStartup, setBootOnStartup, soundEnabled, setSoundEnabled, sound, setSound, customSound,
     setCustomSound, confettiEnabled, setConfettiEnabled, textOutline, setTextOutline}: SettingsProps) => {

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage("updateboot", bootOnStartup);
  }, [bootOnStartup]);

  const openFolder = () => {
    window.electron.ipcRenderer.sendMessage("openfolder");
  };

  return (
    <div className="text-center select-none">
      <h3 className="settings-header">Options</h3>
      <div id="bootcon" className="setting">
        <input type="checkbox" checked={bootOnStartup} onChange={() => setBootOnStartup(!bootOnStartup)} />
        <label id="boottext" className="labelClass">Boot on Startup</label>
      </div>
      <div id="dayresetcon" className="setting">
        <input type="checkbox" checked={dayReset} onChange={() => setDayReset(!dayReset)} />
        <label id="dayresettext" className="labelClass" key="resett">Reset tasks daily.</label>
      </div>
      <div className="setting" id="checksoundcon">
        <input type="checkbox" checked={soundEnabled} onChange={() => setSoundEnabled(!soundEnabled)} />
        <label className="labelClass mr-1.5">Sound</label>
        <select value={sound} onChange={(e) => setSound(e.target.value)} className="ml-1 mr-1 h-[22px] rounded-[5px] focus:outline">
          {SOUNDS.map(value => <option value={value} key={value}>{value}</option>)}
        </select>
        <input type="text" 
          className={`${sound === "Custom" ? "" : "hidden"} h-[22px] text-xs ml-0.5 mb-0.5 w-[21%] pl-1 focus:outline rounded-[5px]`}
          value={customSound} onChange={(e) => setCustomSound(e.target.value)} spellCheck="false" />
        <a className={`${sound === "Custom" ? "" : "hidden"} ml-1 mt-[2px]`} onClick={() => openFolder()}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
            <path d="M11 6.64a1 1 0 0 0-1.243-.97l-1 .25A1 1 0 0 0 8 6.89v4.306A2.6 2.6 0 0 0 7 11c-.5 0-.974.134-1.338.377-.36.24-.662.628-.662 1.123s.301.883.662 1.123c.364.243.839.377 1.338.377s.974-.134 1.338-.377c.36-.24.662-.628.662-1.123V8.89l2-.5z"/>
            <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/>
          </svg>
        </a>
      </div>
      <div className="setting" id="confetticon">
        <input type="checkbox" checked={confettiEnabled} onChange={() => setConfettiEnabled(!confettiEnabled)} />
        <label className="labelClass">Confetti</label>
      </div>
      <div className="setting" id="outlinecon">
        <input type="checkbox" checked={textOutline} onChange={() => setTextOutline(!textOutline)} />
        <label className="labelClass">More Line Space</label>
      </div>
      <Changes />
      <div className="fixed flex justify-center w-full m-0 bottom-0">
        <div className="ui pt-0.5 w-[140px] px-1 rounded-t-[5px] z-[2] !text-black shadow-[rgba(100,100,111,0.2)_0px_7px_29px_0px]">
          <strong>Version:</strong> 1.3.3-b
        </div>
      </div>
    </div>
  );
}

interface Task {
  name: string;
  done: boolean;
}

const InputField = memo(({ effects, idx, task, tasks, setTasks, textOutline }: {
    idx: number,
    task: Task,
    effects: (e: ChangeEvent<HTMLInputElement>, idx: number) => void,
    tasks: Task[],
    setTasks: (arg0: Task[]) => void,
    textOutline: boolean,
  }) => {
  const [newInputIdx, setNewInputIdx] = useLocalStorage("new-input-idx", -1);
  const [rerender, setRerender] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mirrorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    handleOnChange(textareaRef.current!, idx);
    if (idx === newInputIdx) {
      textareaRef.current?.focus();
    }
    if (!rerender) setRerender(true);
  });

  const handleTaskInput = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>, idx: number) => {
    let target = e.target as HTMLTextAreaElement;
    let currentRow = 0;
    const atStart = (document.activeElement as HTMLTextAreaElement)?.selectionEnd === 0;
    
    // Mirror the textarea to get the current row
    if (mirrorRef.current) {
      mirrorRef.current.style.whiteSpace = 'normal';
      mirrorRef.current.style.padding = target.style.padding;
      mirrorRef.current.style.width = target.clientWidth + "px";
      mirrorRef.current.style.fontFamily = target.style.fontFamily;
      mirrorRef.current.style.fontSize = target.style.fontSize;
      mirrorRef.current.style.lineHeight = target.style.lineHeight;

      // Although it may seem logical to attach the prefix to the mirrorRef, there is an edge case where
      // the word that the cursor is within is longer than the remaining space in the textarea, causing
      // the word to wrap to the next line. This causes the mirrorRef to be one line behind the actual
      // textarea.
      let prefix = target.value.substring(0, target.selectionEnd);
      mirrorRef.current.textContent = prefix;
      let remainingText = target.value.substring(target.selectionEnd, target.value.length);
      let breakIndex = remainingText.indexOf(" ") !== -1 ? remainingText.indexOf(" ") : remainingText.indexOf("\n");
      if (breakIndex !== -1) {
        let computedRowToCurrPosition = Math.ceil(mirrorRef.current.clientHeight
          / parseFloat(window.getComputedStyle(mirrorRef.current).lineHeight!)) - 1;
        
        mirrorRef.current.textContent += `${remainingText.substring(0, breakIndex)}`;
        let computedRowWithFullWordAttached = Math.ceil(mirrorRef.current.clientHeight
          / parseFloat(window.getComputedStyle(mirrorRef.current).lineHeight!)) - 1;

        mirrorRef.current.textContent = `${target.value.substring(0, target.selectionEnd)}`;

        // If the word is longer than the remaining space in the textarea, then the mirrorRef will be one line behind.
        if (computedRowWithFullWordAttached > computedRowToCurrPosition) {
          mirrorRef.current.innerHTML = `${target.value.substring(0, prefix.lastIndexOf(" "))}` + '<br>' + `${target.value.substring(prefix.lastIndexOf(" "), target.selectionEnd)}`;
        }
      }
      currentRow = Math.floor(mirrorRef.current.clientHeight
        / parseFloat(window.getComputedStyle(mirrorRef.current).lineHeight!)) - 1;
    }

    if (e.key == "Enter") {
      e.preventDefault();
      if (atStart && target.value !== "") {
        setTasks([...tasks.slice(0, idx), {name: "", done: false}, {name: target.value, done: (target.previousElementSibling as HTMLInputElement).checked}, ...tasks.slice(idx + 1)])
      } else {
        setTasks([...tasks.slice(0, idx), {name: target.value.substring(0, target.selectionEnd), done: (target.previousElementSibling as HTMLInputElement).checked}, {name: target.value.substring(target.selectionEnd), done: false}, ...tasks.slice(idx + 1)]);
      }
      setNewInputIdx(atStart && target.value !== "" ? idx : idx + 1);
    } else if (tasks.length > 1 && ((e.key === "Backspace" && atStart && idx !== 0) || 
      (e.key === "Delete" && (document.activeElement as HTMLTextAreaElement).selectionStart === target.value.length && idx !== tasks.length - 1))) {
      e.preventDefault();

      // Focus tasks, change the prev/next item contents, and delete tasks.
      if ((e.key === "Backspace" && idx > 0) || (e.key === "Delete" && idx === tasks.length - 1)) {
        const prevEl = target.parentElement!.previousElementSibling!;
        const textArea = prevEl.children[1] as HTMLTextAreaElement;

        textArea.focus();
        const activeElement = document.activeElement as HTMLTextAreaElement;
        const length = activeElement.value.length;
        setTimeout(() => activeElement.setSelectionRange(length, length), 0);
        setTasks([...tasks.slice(0, idx - 1), {name: textArea.value + target.value, done: (prevEl.children[0] as HTMLInputElement).checked}, ...tasks.splice(idx + 1)]);
      } else if ((e.key === "Delete" && idx < tasks.length - 1) || (e.key === "Backspace" && idx === 0)) {
        const nextEl = target.parentElement!.nextElementSibling!;
        const textArea = nextEl.children[1] as HTMLTextAreaElement;

        const activeElement = document.activeElement as HTMLTextAreaElement;
        setTimeout(() => activeElement.setSelectionRange(0, 0), 0);
        setTasks([...tasks.slice(0, idx), {name: target.value + textArea.value, done: task.done}, ...tasks.splice(idx + 2)]);
      }
    } else if (e.key === "ArrowLeft" && target.selectionStart === 0) {
      (target.parentElement!.previousElementSibling?.children[1] as HTMLTextAreaElement)?.focus();
      const activeElement = document.activeElement as HTMLTextAreaElement;
      setTimeout(() => activeElement.setSelectionRange(activeElement.value.length, activeElement.value.length), 0);
    } else if (e.key === "ArrowRight" && target.selectionEnd === target.value.length) {
      (target.parentElement!.nextElementSibling?.children[1] as HTMLTextAreaElement)?.focus();
      setTimeout(() => (document.activeElement as HTMLTextAreaElement).setSelectionRange(0, 0), 0);
    } else if (e.key === "ArrowUp" && currentRow <= 0) {
      e.preventDefault();
      (target.parentElement!.previousElementSibling?.children[1] as HTMLTextAreaElement)?.focus();
      (document.activeElement as HTMLTextAreaElement).setSelectionRange(0, 0);
    } else if (e.key === "ArrowDown" && Math.max(0, currentRow) >= Math.floor(target.clientHeight / parseFloat(window.getComputedStyle(target).lineHeight!)) - 1) {
      e.preventDefault();
      (target.parentElement!.nextElementSibling?.children[1] as HTMLTextAreaElement)?.focus();
      (document.activeElement as HTMLTextAreaElement).setSelectionRange(0, 0);
    }
  }, [tasks, setTasks]);

  const handleOnChange = useCallback((e: HTMLTextAreaElement, idx: number) => {
    // have to reset the height so that the scroll height
    // reflects the actual content height
    e.style.height = "";
    e.style.height = e.scrollHeight + "px";
    
    setTasks(tasks.map((el, i) => i !== idx ? el : {...el, name: e.value}));
    setNewInputIdx(-1);
  }, [tasks, setTasks]);

  return (
    <div className={`flex ${textOutline ? 'items-center' : 'pt-1'} text-[15px]`}>
      <input type="checkbox" checked={task.done} onChange={(e) => {
        effects(e, idx);
      }} />
      <textarea
        ref={textareaRef}
        className={`outline-none bg-transparent resize-none ml-[7px] inline font-normal break-words transition w-full ${task.done ? ' line-through italic' : ''} ` +
                   `${textOutline ? 
                    'min-h-7 mt-2'
                     : 'border-none leading-5 mt-px'}`}
        rows={1}
        onChange={(e) => handleOnChange(e.target, idx)}
        onKeyDown={(e) => handleTaskInput(e, idx)}
        value={task.name}
        spellCheck="false"
      />
      <div className="break-words p-1 absolute z-10 left-0 top-0 pointer-events-none opacity-0" ref={mirrorRef}></div>
    </div>
  );
});

// Holds the to-do list content on the main page
const Content = (
    {dayReset, soundEnabled, sound, customSound, confettiEnabled, textOutline, headerRef}: ContentProps
  ) => {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', [{name: 'Heres a starter task.', done: false}]);
  const [date, setDate] = useLocalStorage("date", getDate());
  const contentRef = useRef<HTMLDivElement>(null);
  const [rerender, setRerender] = useState(false);
  
  useEffect(() => {
    if (getDate() !== date && dayReset === true) {
      let count = 0;
      let clone = [...tasks];
      while (clone[count]) {
        clone[count]["done"] = false;
        count++;
      }
      setTasks(clone);
    }
    setDate(getDate());
  }, []);

  // Triggers sounds and confetti
  const effects = useCallback(async (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    // What is the condition?
    setTasks(tasks.map((el, i) => i !== idx ? el : {...el, done: e.target.checked}));
    let tempTasks = tasks.map((el, i) => i !== idx ? el : {...el, done: e.target.checked});
    let eventType = e.target.checked ? tempTasks.every((element: any) => element.done) ? "all" : "check" : "uncheck";

    // Play sound if sounds are enabled.
    if (soundEnabled) {
      // What preset should we use? Doorbell, DJ Khaled, Custom.
      let soundPreset = sound.toLowerCase().replace(" ", "");
      
      // Define sound to be played with its src.
      try {
        let path = require(`../../assets/sounds/${soundPreset}/${sound === "Custom" ? `${customSound}/` : ""}${eventType}.mp3`).default;
        new Audio(path).play();
      } catch (err) {
        console.log("Audio not found.");
      }
    }

    // Show confetti if it is enabled in the settings.
    if (confettiEnabled) {
      // Are all or some tasks checked?
      if (eventType === "check") {
        let count = 200,
        defaults = {
          origin: { y: 0.7 },
        };
  
        function fire(particleRatio: number, opts: any) {
          confetti(
            Object.assign({}, defaults, opts, {
              particleCount: Math.floor(count * particleRatio),
            })
          );
        }

        fire(0.25, {
          spread: 26,
          startVelocity: 55,
        });
        
        fire(0.2, {
          spread: 60,
        });
        
        fire(0.35, {
          spread: 100,
          decay: 0.91,
          scalar: 0.8,
        });
        
        fire(0.1, {
          spread: 120,
          startVelocity: 25,
          decay: 0.92,
          scalar: 1.2,
        });
        
        fire(0.1, {
          spread: 120,
          startVelocity: 45,
        });
      } else if (eventType === "all") {
          const duration = 15 * 1000,
          animationEnd = Date.now() + duration,
          defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

          function randomInRange(min: number, max: number) {
            return Math.random() * (max - min) + min;
          }

          let interval: any = setInterval(function() {
            let timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
              return clearInterval(interval);
            }

            let particleCount = 50 * (timeLeft / duration);

            // since particles fall down, start a bit higher than random
            confetti(
              Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
              })
            );
            confetti(
              Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
              })
            );
          }, 250);
        }
    }
  }, [setTasks, tasks, soundEnabled, sound, customSound, confettiEnabled]);

  useEffect(() => {
    if (!rerender) setRerender(true);
  })

  const handleResizer = () => {
    // Calculate necessary height of window to display full content.
    let header = headerRef.current!;
    let content = contentRef.current!;
    let height = header.offsetHeight + content.offsetHeight + 10;
    let width = window.outerWidth;
    // Resize window to necessary height.
    window.resizeTo(width, height);
  };

  return (
    <div className="px-[5px] pt-[5px] pb-3" ref={contentRef}>
      <ul className="mt-2">
        {tasks.map((task, idx) => {
          return <InputField effects={effects} idx={idx} task={task} tasks={tasks} setTasks={setTasks} textOutline={textOutline} key={idx} />;
        })}
      </ul>
      <div className="flex w-full">
        <div className="resizer bottom-[-32px] right-[-32px] size-14 z-[2] fixed rotate-45 transition-shadow duration-[400ms]" onClick={handleResizer}></div>
      </div>
    </div>
  );
};

const COLORS = ['yellow', 'green', 'pink', 'purple', 'blue'];

const Main = () => {
  const [dayReset, setDayReset] = useLocalStorage("dayreset", true);
  const [currColorIdx, setCurrColorIdx] = useLocalStorage("coloridx", 0);
  const [bootOnStartup, setBootOnStartup] = useLocalStorage("bootonstartup", false);
  const [soundEnabled, setSoundEnabled] = useLocalStorage("soundenabled", true);
  const [sound, setSound] = useLocalStorage("sound", "doorbell");
  const [customSound, setCustomSound] = useLocalStorage("customsound", "");
  const [confettiEnabled, setConfettiEnabled] = useLocalStorage("confettienabled", true);
  const [textOutline, setTextOutline] = useLocalStorage("textoutline", false);
  const [windowSize, setWindowSize] = useLocalStorage("windowsize", [500, 500]);
  const [position, setPosition] = useLocalStorage("position", [0, 0]);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.resizeTo(windowSize[0], windowSize[1]);
    window.moveTo(position[0], position[1]);
    setInterval(function(){
      if ((position[0] !== window.screenX || position[1] !== window.screenY) && window) {
        setPosition([window.screenX, window.screenY]);
      }
    }, 1000);
    window.addEventListener("resize", () => {
      setWindowSize([window.outerWidth, window.outerHeight]);
      setPosition(position);
    });
  }, []);

  const handleColorChange = useCallback((colorIdx: number) => {
    // Circular array functionality
    if (colorIdx == COLORS.length - 1)
      setCurrColorIdx(0);
    else
      setCurrColorIdx(colorIdx + 1);
  }, [setCurrColorIdx]);

  return (
    <div id="react-body" className={`${COLORS[currColorIdx]} font-body mr-0 min-h-full min-w-full absolute`}>
      <div id="main-content">
        <div className="h-10 w-full"></div>
        <HashRouter>
          <Header onColorChange={() => handleColorChange(currColorIdx)} ref={headerRef} />
          <Routes>
            <Route path="*" element={<Content dayReset={dayReset} soundEnabled={soundEnabled} sound={sound}
              customSound={customSound} confettiEnabled={confettiEnabled} textOutline={textOutline} headerRef={headerRef} />} 
            />

            <Route path="/settings" element={<Settings dayReset={dayReset} setDayReset={setDayReset} bootOnStartup={bootOnStartup} setBootOnStartup={setBootOnStartup}
              soundEnabled={soundEnabled} setSoundEnabled={setSoundEnabled} sound={sound} setSound={setSound} customSound={customSound} setCustomSound={setCustomSound}
              confettiEnabled={confettiEnabled} setConfettiEnabled={setConfettiEnabled} textOutline={textOutline} setTextOutline={setTextOutline} />} 
            />
          </Routes>
        </HashRouter>
      </div>
    </div>
  );
}

export default function App() {
  return (
      <Main />
  );
}
