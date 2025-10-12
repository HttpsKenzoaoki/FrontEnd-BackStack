import React from 'react';

export default function Modal({ open, title, children, onClose, actions }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded shadow-xl w-full max-w-lg">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
          <div className="p-6">{children}</div>
          <div className="px-6 py-4 border-t flex gap-2 justify-end">
            {actions || (
              <button
                className="bg-indigo-600 text-white rounded px-4 py-2 hover:bg-indigo-700"
                onClick={onClose}
              >
                Fechar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}