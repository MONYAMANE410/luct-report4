import React from 'react';
import { Outlet, Link } from 'react-router-dom';


const MainLayout = () => {
  return (
    <div className="main-layout">
      <header className="main-header">
        <h1>LUCT Academic Reporting System</h1>
        
      </header>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
