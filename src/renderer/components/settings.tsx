import { useEffect, useState, useRef } from 'react';

type CircularProgressBarProps = {
  progress: number,
  radius: number
}

const CircularProgressBar = ({ progress, radius }: CircularProgressBarProps) => {
  const stroke = 3;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <svg height={radius * 2} width={radius * 2} className="absolute left-0 top-0 w-full h-full">
      {/* Background circle */}
      <circle
        stroke="black"
        fill="transparent"
        strokeWidth={stroke-2}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      {/* Progress circle */}
      <circle
        stroke="rgb(100,149,237)"
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={`${circumference} ${circumference}`}
        style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.35s' }}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
    </svg>
  );
};

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
  moreLineSpace: boolean;
  setMoreLineSpace: (arg0: boolean) => void;
};

const CHANGELOG = [
  "Remapped color system.",
  "Left and right arrows for navigating tasks.",
  "Increased bottom margin for contents page.",
  "Small windows can see full changelog.",
  "Redesigned backspace and delete functionality.",
  "Reduced redundancies.",
  "Text Outline is now More Line Space without outline.",
  "Thickness adjustment for header.",
  "Changelog text wrapping sticks to horizontal arrangement.",
  "Right padding added to content and settings pages.",
  "Structured components into separate files.",
  "Resizer is now single-click.",
  "Fixed header color not transitioning correctly.",
  "Fixed sound set to custom adds padding below setting.",
  "Fixed glitchy check sound."
];

const Changes = () => {
  return (
    <div className="mb-10">
      <h3 className="settings-header">Changelog</h3>
      <table>
        {CHANGELOG.map(change => <tr><td className="w-[10%]">+ </td><td className="w-[90%] pr-3 text-left leading-5 pt-px">{change}</td></tr>)}
      </table>
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
     setCustomSound, confettiEnabled, setConfettiEnabled, moreLineSpace, setMoreLineSpace}: SettingsProps) => {

  const [version, setVersion] = useState('');
  const [releaseData, setReleaseData] = useState({version: version, url: "", autoport: true});
  const [updating, setUpdating] = useState(false);
  const [updateProgress, setUpdateProgress] = useState(0);
  const parentRef = useRef<HTMLDivElement>(null);
  const [radius, setRadius] = useState(0);

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage("updateboot", bootOnStartup);
  }, [bootOnStartup]);

  useEffect(() => {
    window.electron.ipcRenderer.invoke('getversion').then((version: string) => {
      setVersion(version);
    });
    (async () => {
      const response = await fetch("https://cosmocreeper.github.io/noted/releases.json");
      const data = await response.json();
      setReleaseData(data);
    })();
  }, []);

  useEffect(() => {
    if (parentRef.current) {
      const { width, height } = parentRef.current.getBoundingClientRect();
      setRadius(Math.min(width, height) / 2);
    }
  }, [updating]);

  const openFolder = () => {
    window.electron.ipcRenderer.sendMessage("openfolder");
  };

  const update = () => {
    setUpdating(true);
    window.electron.ipcRenderer.sendMessage("download", releaseData);
    for (let i = 1; i < 101; i++) {
      setTimeout(() => setUpdateProgress(i), i * 100);
    }
  }

  return (
    <>
      <div className="text-center select-none">
        <h3 className="settings-header">Options</h3>
        <div id="bootcon" className="setting">
          <input type="checkbox" checked={bootOnStartup} onChange={() => setBootOnStartup(!bootOnStartup)} />
          <label id="boottext" className="labelClass">Boot On Startup</label>
        </div>
        <div id="dayresetcon" className="setting">
          <input type="checkbox" checked={dayReset} onChange={() => setDayReset(!dayReset)} />
          <label id="dayresettext" className="labelClass" key="resett">Reset Tasks Daily</label>
        </div>
        <div className="setting" id="checksoundcon">
          <input type="checkbox" checked={soundEnabled} onChange={() => setSoundEnabled(!soundEnabled)} />
          <label className="labelClass mr-1.5">Sound</label>
          <select value={sound} onChange={(e) => setSound(e.target.value)} className="ml-1 mr-1 h-[22px] rounded-[5px] focus:outline">
            {SOUNDS.map(value => <option value={value} key={value}>{value}</option>)}
          </select>
          <input type="text" 
            className={`${sound === "Custom" ? "" : "hidden"} h-[22px] text-xs ml-2 w-[21%] pl-1 focus:outline rounded-[5px]`}
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
          <input type="checkbox" checked={moreLineSpace} onChange={() => setMoreLineSpace(!moreLineSpace)} />
          <label className="labelClass">More Line Space</label>
        </div>
        <Changes />
        <div className="fixed flex justify-center w-full m-0 bottom-0">
          {
            <div onClick={() => releaseData.version === version ? null : update()} className={`${releaseData.version === version ? `` : `cursor-pointer [&>*]:hover:[font-size:95%]`} ui !text-black border-[rgba(0,_0,_0,_0.4)] transition-all duration-200 pt-0.5 w-[140px] px-1 rounded-t-[5px] z-[2] shadow-[1px_1px_15px_10px_rgba(0,_0,_0,_0.1)] border-solid border-[0.5px]`}>
              {
                releaseData.version === version ? 
                <>
                  <strong>Version:</strong> {version.replace(/-|eta/g,"")}
                </> :
                <strong className="transition-all duration-200">Update</strong>
              }
            </div>
          }
        </div>
      </div>
      {updating ? 
        <div className="fixed w-screen h-screen bottom-0 left-0 z-[80] backdrop-blur-md flex items-center justify-center font-header">
          <div ref={parentRef} className="relative justify-center items-center flex rounded-full w-[min(50vw,50vh)] h-[min(50vw,50vh)] select-none">
            {radius > 0 && <CircularProgressBar progress={updateProgress} radius={radius} />}
            <h1 className="animate-pulse text-md">updating...</h1>
          </div>
        </div>
       : null}
    </>
  );
}


export default Settings;