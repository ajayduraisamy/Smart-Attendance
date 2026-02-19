export default function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200 ${className}`}>
      {children}
    </div>
  );
}
