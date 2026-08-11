import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { ManufacturerApp } from './manufacturer/ManufacturerApp';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename="/manufacturer">
      <ManufacturerApp />
    </BrowserRouter>
  </React.StrictMode>
);



