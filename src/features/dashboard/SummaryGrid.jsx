import Card from "../../components/Card";

function Stat({ label, value, sub }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-1 text-lg font-semibold text-slate-900">{value}</div>
      {sub && <div className="mt-1 text-xs text-slate-500">{sub}</div>}
    </div>
  );
}

export default function SummaryGrid({ period }) {
  return (
    <Card title="Summary" right={<div className="text-xs text-slate-500">Period: {period}</div>}>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Stat label="Total spent" value="R 4,250.75" sub="▲ 12.5% vs previous" />
        <Stat label="Transactions" value="47" sub="▼ 3.2% vs previous" />
        <Stat label="Avg transaction" value="R 90.44" sub="Top category: Groceries" />
      </div>
    </Card>
  );
}
