import { FiCheckCircle, FiAlertCircle, FiAlertTriangle, FiInfo, FiX } from 'react-icons/fi';

export default function Alert({ type = 'info', title = '', message = '', onClose = null }) {
  const styles = {
    success: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', icon: FiCheckCircle },
    error: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', icon: FiAlertCircle },
    warning: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800', icon: FiAlertTriangle },
    info: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', icon: FiInfo },
  };

  const style = styles[type];
  const Icon = style.icon;

  return (
    <div className={`border rounded-lg p-4 ${style.bg} ${style.border} ${style.text} flex justify-between items-start`}>
      <div className="flex items-start gap-3">
        <Icon size={20} className="mt-0.5 flex-shrink-0" />
        <div>
          {title && <h3 className="font-semibold text-sm">{title}</h3>}
          {message && <p className="text-sm mt-1">{message}</p>}
        </div>
      </div>
      {onClose && (
        <button onClick={onClose} className="hover:opacity-70 transition-opacity ml-2">
          <FiX size={18} />
        </button>
      )}
    </div>
  );
}
