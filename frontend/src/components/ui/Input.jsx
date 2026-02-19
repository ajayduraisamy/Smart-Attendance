export default function Input({
  label,
  error = '',
  className = '',
  type = 'text',
  icon: Icon,
  iconPosition = 'left',
  ...props
}) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-semibold text-slate-900 mb-2">{label}</label>}
      <div className="relative">
        <input
          type={type}
          className={`
            w-full px-4 py-2.5
            bg-white text-slate-900
            border border-slate-300 rounded-lg
            focus:border-slate-900 focus:ring-2 focus:ring-slate-900/20
            placeholder-slate-400
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            ${Icon ? (iconPosition === 'left' ? 'pl-10' : 'pr-10') : ''}
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-400/20' : ''}
            ${className}
          `}
          {...props}
        />
        {Icon && (
          <div className={`absolute top-1/2 transform -translate-y-1/2 ${iconPosition === 'left' ? 'left-3' : 'right-3'} text-slate-400`}>
            <Icon size={20} />
          </div>
        )}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
