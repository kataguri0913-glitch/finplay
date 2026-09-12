import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function GameCard({ to, icon, title, description, progress }) {
  return (
    <Link to={to} className="card block hover:-translate-y-0.5">
      <div className="flex items-center gap-4">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-mint text-2xl">{icon}</div>
        <div className="min-w-0 flex-1">
          <div className="font-extrabold">{title}</div>
          <div className="muted mt-1">{description}</div>
          {progress !== undefined && <div className="mt-3 h-2 rounded-full bg-slate-100"><div className="h-full rounded-full bg-teal" style={{width: `${progress}%`}} /></div>}
        </div>
        <ArrowRight size={20} className="text-slate-400"/>
      </div>
    </Link>
  );
}