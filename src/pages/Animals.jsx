import React, { useEffect, useState } from 'react';
import { listAnimals, createAdoption, isLoggedIn, isAdmin, adminCreateAnimal, adminGetAnimal, getTutorById } from '../lib/api.js';
import QuestionnaireModal from '../components/QuestionnaireModal.jsx';

export default function Animals() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState('');
  const [erro, setErro] = useState('');
  const [hasQuestionnaire, setHasQuestionnaire] = useState(true);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);

  const [newAnimal, setNewAnimal] = useState({
    nome: 'Rex',
    especie: 'Cão',
    porte: 'médio',
    castrado: true,
    vacinado: true,
    adotado: false,
    descricao: 'Cão dócil e brincalhão'
  });

  async function loadAnimals() {
    setLoading(true); setErro('');
    try {
      const data = await listAnimals();
      setAnimals(Array.isArray(data) ? data : []);
    } catch {
      setErro('Erro ao carregar animais');
      setAnimals([]);
    } finally {
      setLoading(false);
    }
  }

  async function checkQuestionnaire() {
    if (!isLoggedIn()) {
      setHasQuestionnaire(false);
      return;
    }
    try {
      const tutorId = localStorage.getItem('tutorId');
      if (!tutorId) {
        setHasQuestionnaire(false);
        return;
      }
      const tutor = await getTutorById(tutorId);
      setHasQuestionnaire(!!tutor?.questionario);
    } catch {
      setHasQuestionnaire(false);
    }
  }

  useEffect(() => { 
    loadAnimals(); 
    checkQuestionnaire();
  }, []);

  async function handleAdopt(id) {
    setInfo(''); setErro('');
    if (!isLoggedIn()) {
      setErro('Você precisa estar logado para adotar.');
      return;
    }
    if (!hasQuestionnaire) {
      setShowQuestionnaire(true);
      return;
    }
    try {
      const res = await createAdoption(id);
      setInfo(`Pedido de adoção criado! ID: ${res?.id || '(veja logs do backend)'}`);
    } catch (err) {
      const msg = err?.data?.erro || 'Erro ao criar pedido';
      setErro(msg);
      // Se o backend informar que falta questionário, abrimos o modal
      if (String(msg).toLowerCase().includes('questionário')) {
        setShowQuestionnaire(true);
      }
    }
  }

  async function handleAdminCreate(e) {
    e.preventDefault();
    setErro(''); setInfo('');
    try {
      await adminCreateAnimal(newAnimal);
      setInfo('Animal cadastrado!');
      setNewAnimal({ ...newAnimal, nome: `${newAnimal.nome} *` });
      await loadAnimals();
    } catch (err) {
      setErro(err?.data?.erro || 'Erro ao cadastrar animal (verifique login como admin)');
    }
  }

  async function handleAdminFetchById() {
    const id = prompt('ID do animal:');
    if (!id) return;
    try {
      const data = await adminGetAnimal(id);
      alert(`Animal: ${data?.nome || 'sem nome'}\nEspécie: ${data?.especie}\nPorte: ${data?.porte}`);
    } catch (err) {
      alert(err?.data?.erro || 'Erro ao buscar (somente admin)');
    }
  }

  const list = Array.isArray(animals) ? animals : [];

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold mb-2">Animais para Adoção</h1>
        {!hasQuestionnaire && isLoggedIn() && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded p-3 mb-3">
            Complete o questionário para solicitar adoção.
            <button className="ml-2 underline" onClick={() => setShowQuestionnaire(true)}>Abrir questionário</button>
          </div>
        )}
        {loading ? <p>Carregando...</p> : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {list.map(a => (
              <div key={a.id} className="bg-white rounded shadow p-4 flex flex-col">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{a.nome}</h3>
                  <p className="text-sm text-gray-600">{a.especie} • {a.porte}</p>
                  <p className="text-sm mt-2">{a.descricao}</p>
                  <div className="mt-2 text-xs text-gray-500">
                    Castrado: {a.castrado ? 'Sim' : 'Não'} • Vacinado: {a.vacinado ? 'Sim' : 'Não'} • Adotado: {a.adotado ? 'Sim' : 'Não'}
                  </div>
                </div>
                <button
                  className="mt-4 bg-indigo-600 text-white rounded py-2 hover:bg-indigo-700 disabled:opacity-50"
                  disabled={!isLoggedIn() || a.adotado}
                  onClick={() => handleAdopt(a.id)}
                >
                  Solicitar Adoção
                </button>
              </div>
            ))}
          </div>
        )}
        {info && <div className="mt-3 text-green-700">{info}</div>}
        {erro && <div className="mt-3 text-red-600">{erro}</div>}
      </section>

      {isAdmin() && (
        <section className="bg-white rounded shadow p-4">
          <h2 className="text-xl font-semibold mb-3">Admin: Cadastrar Animal</h2>
          <form onSubmit={handleAdminCreate} className="grid grid-cols-2 gap-4">
            {[
              ['nome','Nome'],
              ['especie','Espécie'],
              ['porte','Porte (pequeno|médio|grande)']
            ].map(([name, label]) => (
              <div key={name}>
                <label className="text-sm block mb-1">{label}</label>
                <input className="border rounded px-3 py-2 w-full" value={newAnimal[name]} onChange={e => setNewAnimal(s => ({ ...s, [name]: e.target.value }))}/>
              </div>
            ))}
            <div>
              <label className="text-sm block mb-1">Descrição</label>
              <textarea className="border rounded px-3 py-2 w-full" value={newAnimal.descricao} onChange={e => setNewAnimal(s => ({ ...s, descricao: e.target.value }))}/>
            </div>
            {[
              ['castrado','Castrado'],
              ['vacinado','Vacinado'],
              ['adotado','Adotado']
            ].map(([name,label]) => (
              <label key={name} className="flex items-center gap-2">
                <input type="checkbox" checked={!!newAnimal[name]} onChange={e => setNewAnimal(s => ({ ...s, [name]: e.target.checked }))}/>
                {label}
              </label>
            ))}
            <div className="col-span-2">
              <button className="bg-green-600 text-white rounded py-2 px-4 hover:bg-green-700">Salvar</button>
              <button type="button" onClick={handleAdminFetchById} className="ml-2 bg-gray-200 rounded py-2 px-3 hover:bg-gray-300">
                Buscar Animal por ID
              </button>
            </div>
          </form>
        </section>
      )}

      <QuestionnaireModal
        open={showQuestionnaire}
        onClose={() => setShowQuestionnaire(false)}
        onSubmitted={() => { setHasQuestionnaire(true); }}
      />
    </div>
  );
}