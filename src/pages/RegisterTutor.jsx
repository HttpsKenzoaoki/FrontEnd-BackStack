import React, { useState } from 'react';
import { createTutor } from '../lib/api.js';
import { useNavigate } from 'react-router-dom';

export default function RegisterTutor() {
  const [form, setForm] = useState({
    nome_completo: 'Carlos Teste',
    email: 'carlos@example.com',
    senha: 'tutor123456',
    cidade: 'São Paulo',
    estado: 'SP',
    idade: 28,
    telefone: '11999999999',
    instagram: '',
    facebook: ''
  });
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  function onChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErro('');
    try {
      await createTutor({ ...form, idade: Number(form.idade) });
      alert('Cadastro realizado! Faça login.');
      navigate('/login');
    } catch (err) {
      setErro(err?.data?.erro || 'Erro ao cadastrar');
    }
  }

  return (
    <div className="max-w-lg mx-auto bg-white rounded shadow p-6">
      <h1 className="text-2xl font-semibold mb-4">Cadastrar Tutor</h1>
      <form onSubmit={onSubmit} className="grid grid-cols-2 gap-4">
        {[
          ['nome_completo', 'Nome completo', 'text'],
          ['email', 'Email', 'email'],
          ['senha', 'Senha', 'password'],
          ['cidade', 'Cidade', 'text'],
          ['estado', 'Estado (UF)', 'text'],
          ['idade', 'Idade', 'number'],
          ['telefone', 'Telefone (apenas números)', 'text'],
          ['instagram', 'Instagram', 'text'],
          ['facebook', 'Facebook', 'text'],
        ].map(([name, label, type]) => (
          <div key={name} className="col-span-1">
            <label className="block text-sm mb-1">{label}</label>
            <input name={name} type={type} value={form[name]} onChange={onChange}
              className="w-full border rounded px-3 py-2"/>
          </div>
        ))}
        <div className="col-span-2">
          {erro && <div className="text-red-600 text-sm mb-2">{erro}</div>}
          <button className="w-full bg-green-600 text-white rounded py-2 hover:bg-green-700">Cadastrar</button>
        </div>
      </form>
    </div>
  );
}