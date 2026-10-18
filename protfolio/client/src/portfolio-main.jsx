import React from 'react';
import { createRoot } from 'react-dom/client';
import SimplePortfolio from './pages/SimplePortfolio.jsx';
import './portfolio.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SimplePortfolio />
  </React.StrictMode>
);
