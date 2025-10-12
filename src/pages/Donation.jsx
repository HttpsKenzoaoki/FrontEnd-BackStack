import React, { useState } from 'react';
import { createDonation } from '../lib/api.js';
import Modal from '../components/Modal.jsx';

export default function Donation() {
  const [form, setForm] = useState({
    nome: 'João da Silva',
    email: 'joao@example.com',
    valor: 50.00,
    mensagem: 'Quero contribuir com a ONG!'
  });
  const [erro, setErro] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [pixInfo, setPixInfo] = useState({ qr: '', payload: '' });

  function onChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'valor' ? Number(value) : value
    }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErro('');
    try {
      const res = await createDonation(form);
      // Backend retorna (exemplo): doacao_id, linkPix (pix_payload), qrcode (qr_code_base64)
      const qr = res?.qrcode || res?.qr_code_base64 || '';
      const payload = res?.linkPix || res?.pix_payload || '';
      setPixInfo({ qr, payload });
      setModalOpen(true);
      // opcional: limpar campos de valor/mensagem
      setForm(prev => ({ ...prev, valor: 50.0, mensagem: '' }));
    } catch (err) {
      setErro(err?.data?.erro || 'Erro ao criar doação');
    }
  }

  function copiarPayload() {
    if (!pixInfo.payload) return;
    navigator.clipboard.writeText(pixInfo.payload).then(() => {
      // feedback simples
      alert('Código PIX copiado!');
    });
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
            <input
              className="w-full border rounded px-3 py-2"
              name={name}
              type={type}
              value={form[name]}
              step={name === 'valor' ? '0.01' : undefined}
              onChange={onChange}
              required
            />
          </div>
        ))}
        <div>
          <label className="block text-sm mb-1">Mensagem</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            name="mensagem"
            value={form.mensagem}
            onChange={onChange}
          />
        </div>
        {erro && <div className="text-red-600">{erro}</div>}
        <button className="bg-green-600 text-white rounded py-2 px-4 hover:bg-green-700">
          Doar
        </button>
      </form>

      <Modal
        open={modalOpen}
        title="Obrigado por contribuir!"
        onClose={() => setModalOpen(false)}
        actions={
          <button
            className="bg-indigo-600 text-white rounded px-4 py-2 hover:bg-indigo-700"
            onClick={() => setModalOpen(false)}
          >
            Fechar
          </button>
        }
      >
        <p className="mb-3">
          Sua doação foi registrada com sucesso. Agradecemos o seu apoio!
        </p>
        {pixInfo.qr && (
          <div className="mb-3">
            <div className="text-sm text-gray-600 mb-1">QR Code para pagamento:</div>
            <img src={pixInfo.qr} alt="QR Code PIX" className="w-48 h-48 object-contain border rounded" />
          </div>
        )}
        {pixInfo.payload && (
          <div className="mb-3">
            <div className="text-sm text-gray-600 mb-1">Código PIX (copia e cola):</div>
            <div className="flex items-center gap-2">
              <code className="bg-gray-100 rounded px-2 py-1 text-xs break-all">{pixInfo.payload}</code>
              <button
                onClick={copiarPayload}
                className="text-xs bg-gray-200 rounded px-2 py-1 hover:bg-gray-300"
              >
                Copiar
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}