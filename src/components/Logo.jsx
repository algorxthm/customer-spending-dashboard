import logo from "../assets/capitec-logo.svg";

export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      <img
        src={logo}
        alt="Logo"
        className="h-12 w-50 rounded-xl object-contain"
      />
      <div className="leading-tight">
        <div className="text-sm font-semibold text-slate-900">
          Spending Insights
        </div>
        <div className="text-xs text-slate-500">
          Customer analytics dashboard
        </div>
      </div>
    </div>
  );
}
