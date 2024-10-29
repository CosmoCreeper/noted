import { ChangeEvent, useState, memo, useRef, useEffect, useCallback } from 'react';
import { getDate } from 'timedated';
import { confetti } from '@tsparticles/confetti';
import { useLocalStorage } from '@uidotdev/usehooks';

type ContentProps = {
  dayReset: boolean;
  soundEnabled: boolean;
  sound: string;
  customSound: string;
  confettiEnabled: boolean;
  moreLineSpace: boolean;
  headerRef: React.RefObject<HTMLDivElement>;
};

interface Task {
  name: string;
  done: boolean;
}

const InputField = memo(({ effects, idx, task, tasks, setTasks, moreLineSpace }: {
    idx: number,
    task: Task,
    effects: (e: ChangeEvent<HTMLInputElement>, idx: number) => void,
    tasks: Task[],
    setTasks: (arg0: Task[]) => void,
    moreLineSpace: boolean,
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
    } else if (tasks.length > 1 && ((e.key === "Backspace" && atStart && tasks.length !== 0) || 
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
    <div className={`flex ${moreLineSpace ? 'items-center' : 'pt-1'} text-[15px]`}>
      <input type="checkbox" checked={task.done} onChange={(e) => {
        effects(e, idx);
      }} />
      <textarea
        ref={textareaRef}
        className={`outline-none bg-transparent resize-none ml-[7px] inline font-normal break-words transition w-full ${task.done ? ' line-through italic' : ''} pr-3 ` +
                   `${moreLineSpace ? 
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
    {dayReset, soundEnabled, sound, customSound, confettiEnabled, moreLineSpace, headerRef}: ContentProps
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
        let path = require(`../../../assets/sounds/${soundPreset}/${sound === "Custom" ? `${customSound}/` : ""}${eventType}.mp3`).default;
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
          return <InputField effects={effects} idx={idx} task={task} tasks={tasks} setTasks={setTasks} moreLineSpace={moreLineSpace} key={idx} />;
        })}
      </ul>
      <div className="flex w-full">
        <div className="resizer bottom-[-32px] right-[-32px] size-14 z-[2] fixed rotate-45 transition-shadow duration-[400ms]" onClick={handleResizer}></div>
      </div>
    </div>
  );
};

export default Content;