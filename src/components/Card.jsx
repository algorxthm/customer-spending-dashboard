export default function Card({ title, right, children, className = "" }) {
  return (
    <div className={`rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 ${className}`}>
      {(title || right) && (
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
          <div>{right}</div>
        </div>
      )}
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}
