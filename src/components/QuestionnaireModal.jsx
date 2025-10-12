import React, { useState } from 'react';
import Modal from './Modal.jsx';
import { submitQuestionnaire } from '../lib/api.js';

const initial = {
  empregado: true,
  quantos_animais_possui: 1,
  motivos_para_adotar: "Companhia e amor aos animais",
  quem_vai_sustentar_o_animal: "Família",
  numero_adultos_na_casa: 2,
  numero_criancas_na_casa: 0,
  idades_criancas: "",
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
  costuma_vacinar: true,
  costuma_vermifugar: true,
  veterinario_usual: "Clínica do Bairro",
  forma_de_educar: "Reforço positivo",
  envia_fotos_e_videos_do_local: true,
  aceita_visitas_e_fotos_do_animal: true,
  topa_entrar_grupo_adotantes: true,
  concorda_com_taxa_adocao: true,
  data_disponivel_para_buscar_animal: new Date().toISOString().slice(0,10)
};

function parseIdadesCriancas(str) {
  const arr = (str || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
    .map(n => Number(n))
    .filter(n => Number.isFinite(n) && n >= 0);
  return arr;
}

export default function QuestionnaireModal({ open, onClose, onSubmitted }) {
  const [form, setForm] = useState(initial);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  function setField(name, value) {
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function onSubmit(e) {
    e?.preventDefault?.();
    setErro('');
    setLoading(true);
    try {
      const payload = {
        ...form,
        quantos_animais_possui: Number(form.quantos_animais_possui),
        numero_adultos_na_casa: Number(form.numero_adultos_na_casa),
        numero_criancas_na_casa: Number(form.numero_criancas_na_casa),
        gasto_mensal_estimado: Number(form.gasto_mensal_estimado),
        idades_criancas: parseIdadesCriancas(form.idades_criancas),
      };
      await submitQuestionnaire(payload);
      onSubmitted?.();
      onClose?.();
    } catch (err) {
      setErro(err?.data?.erro || 'Erro ao enviar questionário');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Questionário de Adoção">
      <form onSubmit={onSubmit} className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
        {erro && <div className="text-red-600">{erro}</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.empregado} onChange={e => setField('empregado', e.target.checked)} />
            Empregado
          </label>
          <div>
            <label className="text-sm block mb-1">Quantos animais possui</label>
            <input type="number" className="w-full border rounded px-3 py-2" value={form.quantos_animais_possui} onChange={e => setField('quantos_animais_possui', e.target.value)} />
          </div>
          <div>
            <label className="text-sm block mb-1">Motivos para adotar</label>
            <input className="w-full border rounded px-3 py-2" value={form.motivos_para_adotar} onChange={e => setField('motivos_para_adotar', e.target.value)} />
          </div>
          <div>
            <label className="text-sm block mb-1">Quem vai sustentar o animal</label>
            <input className="w-full border rounded px-3 py-2" value={form.quem_vai_sustentar_o_animal} onChange={e => setField('quem_vai_sustentar_o_animal', e.target.value)} />
          </div>

          <div>
            <label className="text-sm block mb-1">Adultos na casa</label>
            <input type="number" className="w-full border rounded px-3 py-2" value={form.numero_adultos_na_casa} onChange={e => setField('numero_adultos_na_casa', e.target.value)} />
          </div>
          <div>
            <label className="text-sm block mb-1">Crianças na casa</label>
            <input type="number" className="w-full border rounded px-3 py-2" value={form.numero_criancas_na_casa} onChange={e => setField('numero_criancas_na_casa', e.target.value)} />
          </div>
          <div>
            <label className="text-sm block mb-1">Idades das crianças (ex.: 3, 7)</label>
            <input className="w-full border rounded px-3 py-2" value={form.idades_criancas} onChange={e => setField('idades_criancas', e.target.value)} />
          </div>

          <div>
            <label className="text-sm block mb-1">Residência</label>
            <select className="w-full border rounded px-3 py-2" value={form.residencia_tipo} onChange={e => setField('residencia_tipo', e.target.value)}>
              <option value="própria">própria</option>
              <option value="alugada">alugada</option>
            </select>
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.proprietario_permite_animais} onChange={e => setField('proprietario_permite_animais', e.target.checked)} />
            Proprietário permite animais
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.todos_de_acordo_com_adocao} onChange={e => setField('todos_de_acordo_com_adocao', e.target.checked)} />
            Todos de acordo com a adoção
          </label>

          <div>
            <label className="text-sm block mb-1">Responsável pelo animal</label>
            <input className="w-full border rounded px-3 py-2" value={form.responsavel_pelo_animal} onChange={e => setField('responsavel_pelo_animal', e.target.value)} />
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.responsavel_concorda_com_adocao} onChange={e => setField('responsavel_concorda_com_adocao', e.target.checked)} />
            Responsável concorda com a adoção
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.ha_alergico_ou_pessoas_que_nao_gostam} onChange={e => setField('ha_alergico_ou_pessoas_que_nao_gostam', e.target.checked)} />
            Há alérgico ou pessoas que não gostam
          </label>

          <div>
            <label className="text-sm block mb-1">Gasto mensal estimado (R$)</label>
            <input type="number" step="0.01" className="w-full border rounded px-3 py-2" value={form.gasto_mensal_estimado} onChange={e => setField('gasto_mensal_estimado', e.target.value)} />
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.valor_disponivel_no_orcamento} onChange={e => setField('valor_disponivel_no_orcamento', e.target.checked)} />
            Valor disponível no orçamento
          </label>
          <div>
            <label className="text-sm block mb-1">Tipo de alimentação</label>
            <input className="w-full border rounded px-3 py-2" value={form.tipo_alimentacao} onChange={e => setField('tipo_alimentacao', e.target.value)} />
          </div>

          <div>
            <label className="text-sm block mb-1">Local que o animal vai ficar</label>
            <select className="w-full border rounded px-3 py-2" value={form.local_que_o_animal_vai_ficar} onChange={e => setField('local_que_o_animal_vai_ficar', e.target.value)}>
              <option value="quintal">quintal</option>
              <option value="área interna">área interna</option>
              <option value="canil">canil</option>
              <option value="dentro de casa">dentro de casa</option>
            </select>
          </div>
          <div>
            <label className="text-sm block mb-1">Forma de permanência</label>
            <select className="w-full border rounded px-3 py-2" value={form.forma_de_permanencia} onChange={e => setField('forma_de_permanencia', e.target.value)}>
              <option value="solto 24h">solto 24h</option>
              <option value="preso">preso</option>
              <option value="preso de dia e solto à noite">preso de dia e solto à noite</option>
              <option value="preso parte do dia">preso parte do dia</option>
            </select>
          </div>
          <div>
            <label className="text-sm block mb-1">Forma de confinamento</label>
            <input className="w-full border rounded px-3 py-2" value={form.forma_de_confinamento} onChange={e => setField('forma_de_confinamento', e.target.value)} />
          </div>

          {[
            ['tera_brinquedos','Terá brinquedos'],
            ['tera_abrigo','Terá abrigo'],
            ['tera_passeios_acompanhado','Passeios acompanhado'],
            ['tera_passeios_sozinho','Passeios sozinho'],
            ['companhia_outro_animal','Companhia de outro animal'],
            ['companhia_humana_24h','Companhia humana 24h'],
            ['companhia_humana_parcial','Companhia humana parcial'],
            ['sem_companhia_humana','Sem companhia humana'],
            ['sem_companhia_animal','Sem companhia animal'],
          ].map(([name,label]) => (
            <label key={name} className="flex items-center gap-2">
              <input type="checkbox" checked={!!form[name]} onChange={e => setField(name, e.target.checked)} />
              {label}
            </label>
          ))}

          <div>
            <label className="text-sm block mb-1">O que faz em viagem</label>
            <input className="w-full border rounded px-3 py-2" value={form.o_que_faz_em_viagem} onChange={e => setField('o_que_faz_em_viagem', e.target.value)} />
          </div>
          <div>
            <label className="text-sm block mb-1">Se o animal fugir</label>
            <input className="w-full border rounded px-3 py-2" value={form.o_que_faz_se_fugir} onChange={e => setField('o_que_faz_se_fugir', e.target.value)} />
          </div>
          <div>
            <label className="text-sm block mb-1">Se não puder criar</label>
            <input className="w-full border rounded px-3 py-2" value={form.o_que_faz_se_nao_puder_criar} onChange={e => setField('o_que_faz_se_nao_puder_criar', e.target.value)} />
          </div>

          <div>
            <label className="text-sm block mb-1">Animais que já criou</label>
            <input className="w-full border rounded px-3 py-2" value={form.animais_que_ja_criou} onChange={e => setField('animais_que_ja_criou', e.target.value)} />
          </div>
          <div>
            <label className="text-sm block mb-1">Destino dos animais anteriores</label>
            <input className="w-full border rounded px-3 py-2" value={form.destino_animais_anteriores} onChange={e => setField('destino_animais_anteriores', e.target.value)} />
          </div>

          {[
            ['costuma_esterilizar','Costuma esterilizar'],
            ['costuma_vacinar','Costuma vacinar'],
            ['costuma_vermifugar','Costuma vermifugar'],
          ].map(([name,label]) => (
            <label key={name} className="flex items-center gap-2">
              <input type="checkbox" checked={!!form[name]} onChange={e => setField(name, e.target.checked)} />
              {label}
            </label>
          ))}

          <div>
            <label className="text-sm block mb-1">Veterinário usual</label>
            <input className="w-full border rounded px-3 py-2" value={form.veterinario_usual} onChange={e => setField('veterinario_usual', e.target.value)} />
          </div>
          <div>
            <label className="text-sm block mb-1">Forma de educar</label>
            <input className="w-full border rounded px-3 py-2" value={form.forma_de_educar} onChange={e => setField('forma_de_educar', e.target.value)} />
          </div>
          <div>
            <label className="text-sm block mb-1">Data disponível para buscar</label>
            <input type="date" className="w-full border rounded px-3 py-2" value={form.data_disponivel_para_buscar_animal} onChange={e => setField('data_disponivel_para_buscar_animal', e.target.value)} />
          </div>

          {[
            ['envia_fotos_e_videos_do_local','Envia fotos e vídeos do local'],
            ['aceita_visitas_e_fotos_do_animal','Aceita visitas/fotos do animal'],
            ['topa_entrar_grupo_adotantes','Topa entrar no grupo de adotantes'],
            ['concorda_com_taxa_adocao','Concorda com taxa de adoção'],
          ].map(([name,label]) => (
            <label key={name} className="flex items-center gap-2">
              <input type="checkbox" checked={!!form[name]} onChange={e => setField(name, e.target.checked)} />
              {label}
            </label>
          ))}
        </div>

        <div className="pt-2">
          <button disabled={loading} className="bg-indigo-600 text-white rounded px-4 py-2 hover:bg-indigo-700">
            {loading ? 'Enviando...' : 'Enviar questionário'}
          </button>
        </div>
      </form>
    </Modal>
  );
}