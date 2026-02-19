export default function Table({ columns = [], data = [], loading = false, actions = null }) {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-8 h-8 border-4 border-slate-700 border-t-green-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="text-center py-8 text-slate-400">
        No data available
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-slate-800 border-b border-slate-700">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-6 py-3 text-left text-sm font-semibold text-slate-100"
              >
                {col.label}
              </th>
            ))}
            {actions && <th className="px-6 py-3 text-left text-sm font-semibold text-slate-100">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700">
          {data.map((row, idx) => (
            <tr key={idx} className="hover:bg-slate-800/50 transition-colors">
              {columns.map((col) => (
                <td key={col.key} className="px-6 py-4 text-slate-300">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
              {actions && (
                <td className="px-6 py-4 text-slate-300">
                  <div className="flex gap-2">
                    {actions(row)}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
