// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\components\ThemeToggleSwitch.jsx
import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggleSwitch({ scale = 1, className = "" }) {
  const { setTheme, resolvedTheme } = useTheme();
  const isLight = resolvedTheme === 'light';

  const handleChange = (e) => {
    setTheme(e.target.checked ? 'light' : 'dark');
  };

  return (
    <div className={`theme-switch-container flex items-center ${className}`}>
      <label className="switch" title={`Switch to ${isLight ? 'Dark' : 'Light'} Mode`}>
        <input 
          type="checkbox" 
          checked={isLight} 
          onChange={handleChange}
        />
        <span className="slider">
          <div className="moons-hole">
            <div className="moon-hole"></div>
            <div className="moon-hole"></div>
            <div className="moon-hole"></div>
          </div>
          <div className="black-clouds">
            <div className="black-cloud"></div>
            <div className="black-cloud"></div>
            <div className="black-cloud"></div>
          </div>
          <div className="clouds">
            <div className="cloud"></div>
            <div className="cloud"></div>
            <div className="cloud"></div>
            <div className="cloud"></div>
            <div className="cloud"></div>
            <div className="cloud"></div>
            <div className="cloud"></div>
          </div>
          <div className="stars">
            <svg className="star" viewBox="0 0 20 20">
              <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z"></path>
            </svg>
            <svg className="star" viewBox="0 0 20 20">
              <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z"></path>
            </svg>
            <svg className="star" viewBox="0 0 20 20">
              <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z"></path>
            </svg>
            <svg className="star" viewBox="0 0 20 20">
              <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z"></path>
            </svg>
            <svg className="star" viewBox="0 0 20 20">
              <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z"></path>
            </svg>
          </div>
        </span>
      </label>
    </div>
  );
}
