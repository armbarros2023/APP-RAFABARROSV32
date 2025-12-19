
import React from 'react';

export interface TableColumn<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
  headerClassName?: string;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  emptyMessage?: string;
}

const Table = <T extends object,>({ columns, data, emptyMessage = "Nenhum dado disponível." }: TableProps<T>): React.ReactNode => {
  if (!data || data.length === 0) {
    return <p className="text-slate-500 dark:text-slate-400 text-center py-4">{emptyMessage}</p>;
  }

  return (
    <div className="overflow-x-auto bg-white dark:bg-slate-800 shadow rounded-lg">
      <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
        <thead className="bg-slate-50 dark:bg-slate-700">
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                scope="col"
                className={`px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider ${col.headerClassName || ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
          {data.map((item, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              {columns.map((col, colIndex) => (
                <td
                  key={colIndex}
                  className={`px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300 ${col.className || ''}`}
                >
                  {typeof col.accessor === 'function'
                    ? col.accessor(item)
                    : String(item[col.accessor as keyof T] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
