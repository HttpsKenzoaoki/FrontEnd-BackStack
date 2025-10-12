import React, { useState } from 'react';
import { submitQuestionnaire, isLoggedIn } from '../lib/api.js';

const demoPayload = {
  empregado: true,
  quantos_animais_possui: 1,
  motivos_para_adotar: "Companhia e amor aos animais",
  quem_vai_sustentar_o_animal: "Família",
  numero_adultos_na_casa: 2,
  numero_criancas_na_casa: 0,
  idades_criancas: [],
  residencia_tipo: "própria",
  proprietario_permite_animais: true,
  todos_de_acordo_com_adocao: true,
  responsavel_pelo_animal: "Eu",
  responsavel_concorda_com_adocao: true,
  ha_alergico_ou_pessoas_que_nao_gostam: false,
  gasto_mensal_estimado: 250.00,
  valor_disponivel_no_orcamento: true,
  tipo_alimentacao: "Ração premium",
  local_que_o_animal_vai_ficar: "dentro de casa",
  forma_de_permanencia: "solto 24h",
  forma_de_confinamento: "nenhum",
  tera_brinquedos: true,
  tera_abrigo: true,
  tera_passeios_acompanhado: true,
  tera_passeios_sozinho: false,
  companhia_outro_animal: false,
  companhia_humana_24h: false,
  companhia_humana_parcial: true,
  sem_companhia_humana: false,
  sem_companhia_animal: true,
  o_que_faz_em_viagem: "Deixo com parentes",
  o_que_faz_se_fugir: "Procuro imediatamente e notifico",
  o_que_faz_se_nao_puder_criar: "Procuro novo tutor responsável",
  animais_que_ja_criou: "Cães e gatos",
  destino_animais_anteriores: "Viveram conosco até o fim",
  costuma_esterilizar: true,
  costuma_vacinar: true
};

export default function Questionnaire() {
  const [jsonText, setJsonText] = useState(JSON.stringify(demoPayload, null, 2));
  const [resText, setResText] = useState('');
  const [erro, setErro] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setErro(''); setResText('');
    try {
      const payload = JSON.parse(jsonText);
      const res = await submitQuestionnaire(payload);
      setResText(JSON.stringify(res, null, 2));
    } catch (err) {
      setErro(err?.data?.erro || err?.message || 'Erro ao enviar questionário');
    }
  }

  return (
    <div className="bg-white rounded shadow p-4">
      <h1 className="text-2xl font-semibold mb-3">Questionário de Adoção</h1>
      {!isLoggedIn() && <div className="text-red-600 mb-2">Faça login para enviar o questionário.</div>}
      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="text-sm block mb-1">Payload (JSON)</label>
          <textarea className="w-full border rounded px-3 py-2 font-mono text-sm" rows="16" value={jsonText} onChange={e => setJsonText(e.target.value)} />
        </div>
        <div className="flex gap-2">
          <button className="bg-indigo-600 text-white rounded px-4 py-2 hover:bg-indigo-700">Enviar</button>
          <button type="button" className="bg-gray-200 rounded px-3 py-2 hover:bg-gray-300"
            onClick={() => setJsonText(JSON.stringify(demoPayload, null, 2))}>
            Preencher demo
          </button>
        </div>
      </form>
      {erro && <div className="text-red-600 mt-3">{String(erro)}</div>}
      {resText && (
        <div className="mt-3">
          <div className="text-sm text-gray-600 mb-1">Resposta:</div>
          <pre className="bg-gray-100 p-3 rounded overflow-x-auto text-sm">{resText}</pre>
        </div>
      )}
    </div>
  );
}