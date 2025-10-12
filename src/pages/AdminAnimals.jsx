import React, { useEffect, useState } from 'react';
import { adminListAnimals, adminUpdateAnimal, adminDeleteAnimal, isAdmin } from '../lib/api.js';

export default function AdminAnimals() {
  const [animals, setAnimals] = useState([]);
  const [erro, setErro] = useState('');
  const [info, setInfo] = useState('');

  async function load() {
    setErro(''); setInfo('');
    try {
      const data = await adminListAnimals();
      setAnimals(data);
    } catch (err) {
      setErro(err?.data?.erro || 'Erro ao carregar (somente admin)');
    }
  }

  useEffect(() => { load(); }, []);

  async function handleSave(a) {
    setErro(''); setInfo('');
    try {
      await adminUpdateAnimal(a.id, { descricao: a.descricao, adotado: a.adotado });
      setInfo('Atualizado!');
    } catch (err) {
      setErro(err?.data?.erro || 'Erro ao atualizar');
    }
  }

  async function handleDelete(id) {
    if (!confirm('Deletar animal?')) return;
    try {
      await adminDeleteAnimal(id);
      setAnimals(list => list.filter(a => a.id !== id));
    } catch (err) {
      setErro(err?.data?.erro || 'Erro ao deletar');
    }
  }

  function copyId(id) {
    if (!id) return;
    navigator.clipboard.writeText(id).then(() => {
      // feedback simples
      window.alert('ID copiado para a área de transferência!');
    }).catch(() => {});
  }

  if (!isAdmin()) {
    return <div className="bg-white p-4 rounded shadow">Apenas administradores podem acessar esta página.</div>;
  }

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold">Admin - Animais</h1>
      <p className="text-sm text-gray-600">O ID do animal agora aparece em cada card. Clique em "Copiar ID" para usar na busca por ID.</p>

      {erro && <div className="text-red-600">{erro}</div>}
      {info && <div className="text-green-700">{info}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {animals.map(a => (
          <div key={a.id} className="bg-white rounded shadow p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-semibold">
                  {a.nome} <span className="text-gray-500">({a.especie} • {a.porte})</span>
                </h3>
              </div>
              <div className="text-right">
                <div className="text-[11px] text-gray-500 font-mono">ID:</div>
                <div className="text-xs font-mono text-gray-700 break-all">{a.id}</div>
                <button
                  onClick={() => copyId(a.id)}
                  className="mt-1 text-xs bg-gray-200 rounded px-2 py-1 hover:bg-gray-300"
                  title="Copiar ID"
                >
                  Copiar ID
                </button>
              </div>
            </div>

            <label className="block text-sm mt-2">Descrição</label>
            <textarea
              className="w-full border rounded px-3 py-2"
              value={a.descricao || ''}
              onChange={e => {
                const v = e.target.value;
                setAnimals(list => list.map(x => x.id === a.id ? { ...x, descricao: v } : x));
              }}
            />
            <label className="mt-2 flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!a.adotado}
                onChange={e => {
                  const v = e.target.checked;
                  setAnimals(list => list.map(x => x.id === a.id ? { ...x, adotado: v } : x));
                }}
              />
              Adotado
            </label>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => handleSave(a)}
                className="bg-indigo-600 text-white rounded px-3 py-2 hover:bg-indigo-700"
              >
                Salvar
              </button>
              <button
                onClick={() => handleDelete(a.id)}
                className="bg-red-500 text-white rounded px-3 py-2 hover:bg-red-600"
              >
                Deletar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}