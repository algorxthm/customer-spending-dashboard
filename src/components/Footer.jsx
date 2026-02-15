export default function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-white py-6">
      <div className="mx-auto max-w-7xl px-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} · Created by{" "}
        <span className="font-medium text-slate-600">Prince Rapoo</span>
      </div>
    </footer>
  );
}
