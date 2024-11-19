import './assets/base.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'


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
  </React.StrictMode>
)
