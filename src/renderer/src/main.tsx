import './assets/base.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import verData from '../src/assets/version.json';

const getVersion = () => {
  return `${verData.version}-${verData.branch}-${verData["commit hash"]}`;
}

const changeTheme = (css: ColorScheme, theme?: 'light' | 'dark' | undefined) => {
  const root = document.documentElement;

  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  for (const key in css) {
    root.style.setProperty(`--${key}`, css[key]);
  }
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App onThemeChange={changeTheme} />
    <p className="absolute bottom-0 right-0 text-muted-foreground">{getVersion()}</p>
  </React.StrictMode>
)
