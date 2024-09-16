import React, { useState } from 'react';
import './PageNotFound.css';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';

const PageNotFound: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');
  const handleThemeSwitch = () => {
    const root = document.documentElement;

    if (currentTheme === 'dark') {
      root.style.setProperty('--bg-color', '#ebebeb');
      root.style.setProperty('--text-color', '#000');
      setCurrentTheme('light');
    } else {
      root.style.setProperty('--bg-color', '#050505');
      root.style.setProperty('--text-color', '#fff');
      setCurrentTheme('dark');
    }
  };

  const handleBackToHome = () => {
    const root = document.documentElement;
    root.style.setProperty('--bg-color', '#ebebeb');
    root.style.setProperty('--text-color', '#000');
  };

  return (
    <main className="error-page">
      <div className="container">
        <div className="eyes">
          <div className="eye">
            <div className="eye__pupil eye__pupil--left"></div>
          </div>
          <div className="eye">
            <div className="eye__pupil eye__pupil--right"></div>
          </div>
        </div>

        <div className="error-page__heading">
          <h1 className="error-page__heading-title">Looks like you're lost</h1>
          <p className="error-page__heading-description">404 error</p>
        </div>

        <Link
          className="error-page__button"
          to="/dashboards"
          aria-label="back to home"
          title="back to home"
          onClick={handleBackToHome}
        >
          back to home
        </Link>
      </div>

      <Button
        className="color-switcher"
        data-theme-color-switch
        aria-label="Switch Theme"
        onClick={handleThemeSwitch}
      >
        {currentTheme === 'light' ? '🌙' : '☀️'}
      </Button>
    </main>
  );
};

export default PageNotFound;
