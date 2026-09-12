import { NavLink } from "react-router-dom";
import { Home, WalletCards, PiggyBank, TrendingUp, UserRound } from "lucide-react";

const items = [
  ["/home", "Home", Home],
  ["/budget", "Budget", WalletCards],
  ["/save", "Save", PiggyBank],
  ["/invest", "Invest", TrendingUp],
  ["/profile", "Profile", UserRound],
];

export default function Layout({ children }) {
  return (
    <div className="phone-shell">
      {children}
      <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-[420px] -translate-x-1/2 border-t bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] pt-2 backdrop-blur">
        <div className="grid grid-cols-5">
          {items.map(([to, label, Icon]) => (
            <NavLink key={to} to={to} className={({ isActive }) =>
              `flex min-h-14 flex-col items-center justify-center gap-1 text-[11px] font-bold ${isActive ? "text-teal" : "text-slate-400"}`
            }>
              <Icon size={21} />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}