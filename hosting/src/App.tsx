import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css';

import MainPage from './page/ MainPage ';
import LoginPage from './page/ LoginPage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path={'/'} element={<MainPage/>} />
          <Route path={'/login'} element={<LoginPage/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
