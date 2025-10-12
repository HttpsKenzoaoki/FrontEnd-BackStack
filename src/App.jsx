import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar.jsx';
import Login from './pages/Login.jsx';
import RegisterTutor from './pages/RegisterTutor.jsx';
import Animals from './pages/Animals.jsx';
import Questionnaire from './pages/Questionnaire.jsx';
import AdminAnimals from './pages/AdminAnimals.jsx';
import Donation from './pages/Donation.jsx';

function App() {
  return (
    <div className="min-h-screen">
      <NavBar />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Navigate to="/animais" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<RegisterTutor />} />
          <Route path="/animais" element={<Animals />} />
          <Route path="/questionario" element={<Questionnaire />} />
          <Route path="/admin/animais" element={<AdminAnimals />} />
          <Route path="/doacoes" element={<Donation />} />
          <Route path="*" element={<div>404</div>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;