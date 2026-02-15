export default function TransactionsTable({ rows, loading }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200">
      <div className="max-h-[420px] overflow-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="sticky top-0 bg-white">
            <tr className="border-b border-slate-200 text-xs text-slate-500">
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Merchant</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading && (
              <tr>
                <td className="px-4 py-4 text-slate-500" colSpan={6}>
                  Loading transactions…
                </td>
              </tr>
            )}

            {!loading && rows.length === 0 && (
              <tr>
                <td
                  className="px-4 py-10 text-center text-slate-500"
                  colSpan={6}
                >
                  No transactions found for the selected filters.
                </td>
              </tr>
            )}

            {rows.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">{t.date}</td>
                <td className="px-4 py-3">{t.merchant}</td>
                <td className="px-4 py-3">{t.category}</td>
                <td className="px-4 py-3">{t.amount}</td>
                <td className="px-4 py-3">{t.paymentMethod}</td>
                <td className="px-4 py-3">{t.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
