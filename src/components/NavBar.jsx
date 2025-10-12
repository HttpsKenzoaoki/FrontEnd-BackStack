import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { isLoggedIn, isAdmin, logout } from '../lib/api.js';

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const logged = isLoggedIn();
  const admin = isAdmin();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const linkClass = (path) =>
    `px-3 py-2 rounded hover:bg-gray-200 ${location.pathname === path ? 'bg-gray-200 font-semibold' : ''}`;

  return (
    <header className="bg-white shadow">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-indigo-600">BackStack Adoção</Link>
        <nav className="flex items-center gap-2">
          <Link className={linkClass('/animais')} to="/animais">Animais</Link>
          <Link className={linkClass('/doacoes')} to="/doacoes">Doações</Link>
          {admin && <Link className={linkClass('/admin/animais')} to="/admin/animais">Admin</Link>}
          {!logged && <Link className={linkClass('/login')} to="/login">Entrar</Link>}
          {!logged && <Link className={linkClass('/cadastro')} to="/cadastro">Cadastrar</Link>}
          {logged && (
            <button onClick={handleLogout} className="ml-2 px-3 py-2 rounded bg-red-500 text-white hover:bg-red-600">
              Sair
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}