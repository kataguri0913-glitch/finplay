import { Coins, Flame, Star } from "lucide-react";
import { useFinStore, AVATARS, LEVELS } from "../store/useFinStore";
import GameCard from "../components/GameCard";
import { Progress } from "../components/Reward";

export default function Home() {
  const { user, budgetRounds, investingRounds } = useFinStore();
  const current = LEVELS.find(x => x.level === user.level) || LEVELS.at(-1);
  const pct = ((user.totalXP - current.min) / Math.max(1, current.max - current.min)) * 100;

  return <main className="page">
    <header className="mb-6 flex items-center gap-3">
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-mint text-2xl">{AVATARS[user.avatarId]}</div>
      <div className="flex-1"><div className="muted">Welcome back</div><h1 className="text-xl font-black">{user.name} 👋</h1></div>
      <div className="rounded-2xl bg-white px-3 py-2 text-sm font-extrabold shadow-soft"><Coins size={16} className="mr-1 inline text-gold"/>{user.coins}</div>
    </header>

    <section className="card bg-ink text-white">
      <div className="flex justify-between"><div><div className="text-sm text-white/60">Level</div><div className="text-3xl font-black">{user.level}</div></div><div className="text-right"><div className="text-sm text-white/60">XP</div><div className="font-bold">{user.totalXP} / {current.max}</div></div></div>
      <div className="mt-4"><Progress value={pct}/></div>
      <div className="mt-2 text-xs text-white/60">{Math.max(0, current.max - user.totalXP)} XP to next level</div>
    </section>

    <div className="mt-4 flex items-center gap-3 rounded-3xl bg-orange-50 p-4">
      <div className="text-2xl">🔥</div><div><div className="font-black">{user.streakCount}-day streak</div><div className="muted">Keep showing up to earn bonuses.</div></div><Star className="ml-auto text-gold" size={20}/>
    </div>

    <div className="mb-3 mt-7 flex items-center justify-between"><h2 className="section-title">Play & learn</h2><span className="muted">3 games</span></div>
    <div className="space-y-3">
      <GameCard to="/budget" icon="🧾" title="Budget Game" description="Build a realistic monthly plan." progress={Math.min(100, budgetRounds.length * 20)} />
      <GameCard to="/save" icon="🌱" title="Save Game" description="Grow a goal one check-in at a time." />
      <GameCard to="/invest" icon="📈" title="Invest Game" description="Explore risk, return and diversification." progress={Math.min(100, investingRounds.length / 3 * 100)} />
    </div>

    <div className="mt-7">
      <h2 className="section-title mb-3">Recent rewards</h2>
      <div className="card flex gap-3 overflow-x-auto">
        {user.badges.length ? user.badges.map(b => <div key={b} className="min-w-20 text-center"><div className="text-3xl">{b === "first" ? "🚀" : b === "budget" ? "🧾" : b === "saver" ? "🔥" : "🧠"}</div><div className="mt-1 text-xs font-bold">{b === "first" ? "First Steps" : b === "budget" ? "Budget Master" : b === "saver" ? "Saver Streak" : "Smart Investor"}</div></div>) : <div className="muted">Complete a game to earn your first badge.</div>}
      </div>
    </div>
  </main>;
}