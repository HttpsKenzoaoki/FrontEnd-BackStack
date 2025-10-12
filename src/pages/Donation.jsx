import React, { useState } from 'react';
import { createDonation } from '../lib/api.js';

export default function Donation() {
  const [form, setForm] = useState({
    nome: 'João da Silva',
    email: 'joao@example.com',
    valor: 50.00,
    mensagem: 'Quero contribuir com a ONG!'
  });
  const [resText, setResText] = useState('');
  const [erro, setErro] = useState('');

  function onChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === 'valor' ? Number(value) : value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErro(''); setResText('');
    try {
      const res = await createDonation(form);
      setResText(JSON.stringify(res, null, 2));
    } catch (err) {
      setErro(err?.data?.erro || 'Erro ao criar doação');
    }
  }

  return (
    <div className="max-w-lg mx-auto bg-white rounded shadow p-6">
      <h1 className="text-2xl font-semibold mb-4">Doações</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        {[
          ['nome','Nome','text'],
          ['email','Email','email'],
          ['valor','Valor (R$)','number'],
        ].map(([name, label, type]) => (
          <div key={name}>
            <label className="block text-sm mb-1">{label}</label>
            <input className="w-full border rounded px-3 py-2" name={name} type={type} value={form[name]} onChange={onChange}/>
          </div>
        ))}
        <div>
          <label className="block text-sm mb-1">Mensagem</label>
          <textarea className="w-full border rounded px-3 py-2" name="mensagem" value={form.mensagem} onChange={onChange}/>
        </div>
        {erro && <div className="text-red-600">{erro}</div>}
        <button className="bg-green-600 text-white rounded py-2 px-4 hover:bg-green-700">Doar</button>
      </form>
      {resText && (
        <div className="mt-4">
          <div className="text-sm text-gray-600">Resposta:</div>
          <pre className="bg-gray-100 p-3 rounded overflow-x-auto text-sm">{resText}</pre>
        </div>
      )}
    </div>
  );
}