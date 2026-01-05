import React from 'react';

const AlertDialog = ({ isOpen, onClose, title, message, variant = 'info' }) => {
  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return { color: '#10b981', icon: '✓' };
      case 'error':
        return { color: '#ef4444', icon: '✕' };
      case 'warning':
        return { color: '#f59e0b', icon: '⚠' };
      default:
        return { color: 'var(--accent-color)', icon: 'ℹ' };
    }
  };

  const { color, icon } = getVariantStyles();

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
        <div className="flex items-start mb-4">
          <div 
            className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white text-xl font-bold mr-3"
            style={{ backgroundColor: color }}
          >
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              {title}
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {message}
            </p>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 text-white rounded-md transition-colors"
            style={{ backgroundColor: color }}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertDialog;
