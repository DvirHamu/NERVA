'use client';

import { useEffect, useState } from 'react';
import { THEME_MEDIA_QUERY, THEME_STORAGE_KEY, cn } from '@/lib/utils';

// Pulling the theme from the device
const THEME_SCRIPT = `
  const doc = document.documentElement;
  const theme = localStorage.getItem("${THEME_STORAGE_KEY}") ?? "system";

  if (theme === "system") {
    if (window.matchMedia("${THEME_MEDIA_QUERY}").matches) {
      doc.classList.add("dark");
    } else {
      doc.classList.add("light");
    }
  } else {
    doc.classList.add(theme);
  }
`
  .trim()
  .replace(/\n/g, '')
  .replace(/\s+/g, ' ');

// Theme Modes
export type ThemeMode = 'dark' | 'light' | 'system';

// Selecting the theme
function applyTheme(theme: ThemeMode) {
  const doc = document.documentElement;

  doc.classList.remove('dark', 'light');
  localStorage.setItem(THEME_STORAGE_KEY, theme);

  if (theme === 'system') {
    if (window.matchMedia(THEME_MEDIA_QUERY).matches) {
      doc.classList.add('dark');
    } else {
      doc.classList.add('light');
    }
  } else {
    doc.classList.add(theme);
  }
}

// Needs to go into the root
export function ApplyThemeScript() {
  return <script id="theme-script">{THEME_SCRIPT}</script>;
}

// Will be how themes are selected
export function ThemeRadioGroup() {
  const [theme, setTheme] = useState<ThemeMode | undefined>(undefined);
  useEffect(() => {
    const storedTheme = (localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode) ?? 'system';

    setTheme(storedTheme);
  }, [])

  function handleThemeChange(theme: ThemeMode){
    applyTheme(theme);
    setTheme(theme);
  }

  return (
    <div>
      <div className="flex flex-col ml-2">
          <label key="Light" className={`flex items-center px-4 py-2 rounded-xl cursor-pointer transition hover:scale-102`} onClick={() => handleThemeChange('light')}>
              <div className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center hover:scale-110 transition bg-background`}>
                {theme === 'light' &&(
                  <div className="w-3 h-3 bg-secondary-foreground rounded-full"></div>
                )}
              </div>
            <span className="text-sm font-medium text-foreground">Light</span>
          </label>
      </div>
      <div className="flex flex-col ml-2">
        <label key="Light" className={`flex items-center px-4 py-2 rounded-xl cursor-pointer transition hover:scale-102`} onClick={() => handleThemeChange('dark')}>
            <div className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center hover:scale-110 transition bg-background`}>
              {theme === 'dark' &&(
                  <div className="w-3 h-3 bg-secondary-foreground rounded-full"></div>
                )}
            </div>
          <span className="text-sm font-medium text-foreground">Dark</span>
        </label>
      </div>
    </div>
    
  );
}
