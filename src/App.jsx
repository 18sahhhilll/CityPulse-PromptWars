import React, { useLayoutEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes';
import { useSettingsStore } from './store/useSettingsStore';

export function App() {
  const theme = useSettingsStore((state) => state.theme);

  useLayoutEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [theme]);

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
