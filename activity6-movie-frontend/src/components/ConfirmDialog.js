import React from 'react';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', variant = 'danger' }) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 overflow-y-auto h-full w-full z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div 
        className="relative p-6 border w-96 shadow-lg rounded-lg"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            {title}
          </h3>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {message}
          </p>
        </div>
        
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md transition-colors"
            style={{ 
              backgroundColor: 'var(--bg-secondary)', 
              color: 'var(--text-muted)',
              border: '1px solid var(--border-color)'
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 text-white rounded-md transition-colors ${
              variant === 'danger' ? 'hover:opacity-90' : ''
            }`}
            style={{ 
              backgroundColor: variant === 'danger' ? '#ef4444' : 'var(--accent-color)' 
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
