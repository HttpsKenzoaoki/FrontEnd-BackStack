import React, { useState } from 'react';
import { login } from '../lib/api.js';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('admin@ongadocao.com');
  const [senha, setSenha] = useState('admin123456');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true); setErro('');
    try {
      await login(email, senha);
      navigate('/animais');
    } catch (err) {
      setErro(err?.data?.erro || 'Falha no login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded shadow p-6">
      <h1 className="text-2xl font-semibold mb-4">Entrar</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input className="w-full border rounded px-3 py-2" type="email" value={email} onChange={e => setEmail(e.target.value)} required/>
        </div>
        <div>
          <label className="block text-sm mb-1">Senha</label>
          <input className="w-full border rounded px-3 py-2" type="password" value={senha} onChange={e => setSenha(e.target.value)} required/>
        </div>
        {erro && <div className="text-red-600 text-sm">{erro}</div>}
        <button disabled={loading} className="w-full bg-indigo-600 text-white rounded py-2 hover:bg-indigo-700">
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
        <p className="text-sm text-gray-500 mt-2">Use o admin acima para testar o painel administrativo.</p>
      </form>
    </div>
  );
}