import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import TDesignSmartPage from './TDesignSmartPage';
import './index.css';

const showVersionOne = new URLSearchParams(window.location.search).get('version') === '1';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {showVersionOne ? <App /> : <TDesignSmartPage />}
  </React.StrictMode>
);
