import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LabApp } from './lab/LabApp';

export default function App() {
  return (
    <Routes>
      <Route path="/lab/*" element={<LabApp />} />
      <Route path="/" element={<Navigate to="/lab" replace />} />
      <Route path="*" element={<Navigate to="/lab" replace />} />
    </Routes>
  );
}


