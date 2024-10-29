import { HashRouter, Routes, Route } from 'react-router-dom';
import { useCallback, useEffect, useRef } from 'react';
import { useLocalStorage } from '@uidotdev/usehooks';

// Global CSS.
import './css/App.css';
import './css/themes.css';

// Components.
import Header from './components/header';
import Settings from './components/settings';
import Content from './components/contents';

// Colors.
const COLORS = ['yellow', 'green', 'pink', 'purple', 'blue'];

const Main = () => {
  const [dayReset, setDayReset] = useLocalStorage("dayreset", true);
  const [currColorIdx, setCurrColorIdx] = useLocalStorage("coloridx", 0);
  const [bootOnStartup, setBootOnStartup] = useLocalStorage("bootonstartup", false);
  const [soundEnabled, setSoundEnabled] = useLocalStorage("soundenabled", true);
  const [sound, setSound] = useLocalStorage("sound", "doorbell");
  const [customSound, setCustomSound] = useLocalStorage("customsound", "");
  const [confettiEnabled, setConfettiEnabled] = useLocalStorage("confettienabled", true);
  const [moreLineSpace, setMoreLineSpace] = useLocalStorage("morelinespace", false);
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
              customSound={customSound} confettiEnabled={confettiEnabled} moreLineSpace={moreLineSpace} headerRef={headerRef} />} 
            />

            <Route path="/settings" element={<Settings dayReset={dayReset} setDayReset={setDayReset} bootOnStartup={bootOnStartup} setBootOnStartup={setBootOnStartup}
              soundEnabled={soundEnabled} setSoundEnabled={setSoundEnabled} sound={sound} setSound={setSound} customSound={customSound} setCustomSound={setCustomSound}
              confettiEnabled={confettiEnabled} setConfettiEnabled={setConfettiEnabled} moreLineSpace={moreLineSpace} setMoreLineSpace={setMoreLineSpace} />} 
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
