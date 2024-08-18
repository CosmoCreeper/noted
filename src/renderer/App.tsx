import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

function Header() {
  const quitApp = () => {
    window.close();
  };

  const settings = () => {
    location.href = '/settings';
  };

  return (
    <header id="header">
      <button id="color-btn"></button>
      <div id="day" className="select-none hover:cursor-pointer" onClick={settings}>UNDEFINED</div>
      <button id="close-btn" onClick={quitApp}>&#x2715;</button>
    </header>
  );
}

function Separator() {
  return (
    <div className="separator"></div>
  );
}

function Changes() {
  return (
    <div id="changelog">
      <h3 id="changelog-tag">Changelog</h3>
      <p className="change">+ React Integration</p>
      <p className="change">+ Enhanced Task Integration</p>
      <p className="change">+ Save File Backups</p>
      <p className="change">+ Added Progress Bar</p>
      <p className="change">+ Fixed Settings</p>
      <p className="change">+ Improved Sound Setting</p>
    </div>
  );
}

function Settings() {
  return (
    <div id="settings">
      <h3 id="option-tag">Options</h3>
      <div id="bootcon" className="setting noteText">
        <input type="checkbox" id="boot" defaultChecked />
        <label id="boottext" className="labelClass">Boot on Startup</label>
      </div>
      <div className="setting noteText" id="checksoundcon">
        <input type="checkbox" id="soun" defaultChecked />
        <label id="checksoundtext" className="labelClass">Sound</label>
        <select id="checksound" defaultValue="doorbell">
          <option value="none">None</option>
          <option value="doorbell">Doorbell</option>
          <option value="anotherone">DJ Khaled</option>
          <option value="custom">Custom</option>
        </select>
        <input type="text" id="uploadsound" className="hidden" />
      </div>
      <div className="setting noteText" id="confetticon">
        <input type="checkbox" id="confett" defaultChecked />
        <label id="confettitext" className="labelClass checkset">Confetti</label>
      </div>
      <Changes />
      <div id="vbout"><div id="vic" className="ui"><strong>Version:</strong> 1.2.0.5</div></div>
    </div>
  );
}

function Content() {
  return (
    <div id="content">
      <div id="prog" className="ui">
        <progress />
      </div>
    </div>
  );
}

function Main() {
  return (
    <div id="react-body" className="light-green">
      <Header />
      <div id="main-content">
        <Separator />
        <BrowserRouter>
          <Routes>
              <Route index element={<Content />} />
              <Route path="/settings" element={<Settings />} />
          </Routes>
        </BrowserRouter>
      </div>
      <div id="resizer"></div>
    </div>
  );
}

export default function App() {
  return (
    <Main />
  );
}
