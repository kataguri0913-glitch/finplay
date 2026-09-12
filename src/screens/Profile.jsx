import { useFinStore, AVATARS } from "../store/useFinStore";

const badges = [
  ["first","🚀","First Steps","Complete onboarding"],
  ["budget","🧾","Budget Master","Complete 5 budgeting rounds"],
  ["saver","🔥","Saver Streak","Reach a 7-day saving streak"],
  ["investor","🧠","Smart Investor","Complete 3 investing simulations"],
];

const leaderboard = [
  ["Maya", 1320], ["Arjun", 1110], ["Zoya", 980], ["Kabir", 840], ["Nila", 760]
];

export default function Profile() {
  const {user,budgetRounds,investingRounds,savingsCheckins}=useFinStore();
  const rows=[...leaderboard,[user.name,user.totalXP]].sort((a,b)=>b[1]-a[1]).slice(0,6);
  return <main className="page">
    <header className="text-center">
      <div className="mx-auto grid h-24 w-24 place-items-center rounded-[2rem] bg-mint text-5xl">{AVATARS[user.avatarId]}</div>
      <h1 className="mt-3 text-2xl font-black">{user.name}</h1>
      <div className="text-sm text-slate-500">Level {user.level} • {user.totalXP} XP • 🪙 {user.coins}</div>
    </header>

    <section className="card mt-6">
      <h2 className="section-title">Badges</h2>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {badges.map(([id,icon,title,desc])=>{
          const unlocked=user.badges.includes(id);
          return <div key={id} className={`rounded-2xl p-4 ${unlocked ? "bg-mint" : "bg-slate-100 opacity-50"}`}>
            <div className="text-3xl">{unlocked?icon:"🔒"}</div><div className="mt-2 font-extrabold">{title}</div><div className="mt-1 text-xs text-slate-500">{desc}</div>
          </div>
        })}
      </div>
    </section>

    <section className="card mt-5">
      <h2 className="section-title">Leaderboard</h2>
      <div className="mt-3 space-y-2">
        {rows.map(([name,xp],i)=><div key={name+i} className={`flex items-center rounded-2xl p-3 ${name===user.name ? "bg-mint" : "bg-slate-50"}`}><span className="w-8 font-black">{i+1}</span><span className="flex-1 font-bold">{name}</span><span className="text-sm font-extrabold">{xp} XP</span></div>)}
      </div>
    </section>

    <section className="card mt-5">
      <h2 className="section-title">Your stats</h2>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <Stat n={budgetRounds.length} label="Budget rounds"/>
        <Stat n={savingsCheckins.length} label="Save check-ins"/>
        <Stat n={investingRounds.length} label="Invest rounds"/>
      </div>
    </section>
  </main>;
}
function Stat({n,label}){return <div className="rounded-2xl bg-slate-50 p-3"><div className="text-2xl font-black text-teal">{n}</div><div className="text-[11px] text-slate-500">{label}</div></div>}