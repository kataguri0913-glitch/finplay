import { useState } from "react";
import { Check, Flame, Target } from "lucide-react";
import { useFinStore } from "../store/useFinStore";
import { Progress, RewardToast } from "../components/Reward";

export default function Save() {
  const { user, checkInSavings, setSavingsGoal } = useFinStore();
  const goal = user.savingsGoals[0];
  const [name, setName] = useState(goal?.name || "Emergency Fund");
  const [target, setTarget] = useState(goal?.target || 5000);
  const [toast, setToast] = useState("");
  const pct = goal ? goal.saved / goal.target * 100 : 0;
  const today = new Date().toISOString().slice(0,10);
  const checked = user.lastCheckIn === today;

  const saveGoal = () => setSavingsGoal(name, target);
  const checkin = () => {
    if (checked) return;
    const amount = Math.max(50, Math.round(goal.target * .03 / 10) * 10);
    checkInSavings(amount);
    setToast(`+${amount.toLocaleString("en-IN")} saved • +15 XP`);
  };

  return <main className="page">
    <RewardToast text={toast} onClose={() => setToast("")}/>
    <header><div className="muted">Save Game</div><h1 className="text-3xl font-black">Grow your goal 🌱</h1></header>

    <div className="card mt-5">
      <div className="flex items-center gap-2 font-bold"><Target size={18} className="text-teal"/> Savings goal</div>
      <input value={name} onChange={e => setName(e.target.value)} className="mt-4 w-full rounded-2xl border p-3" placeholder="Goal name"/>
      <input value={target} onChange={e => setTarget(e.target.value)} type="number" className="mt-3 w-full rounded-2xl border p-3" placeholder="Target amount"/>
      <button onClick={saveGoal} className="secondary mt-3 w-full">Save goal</button>
    </div>

    <div className="card mt-5 text-center">
      <div className="mx-auto grid h-44 w-44 place-items-center rounded-full border-[14px] border-mint" style={{background: `conic-gradient(#12a594 ${Math.min(100,pct)}%, #edf2f0 0)`}}>
        <div className="grid h-32 w-32 place-items-center rounded-full bg-white"><div><div className="text-3xl font-black">{Math.round(pct)}%</div><div className="text-xs text-slate-400">complete</div></div></div>
      </div>
      <div className="mt-5 text-xl font-black">{goal.name}</div>
      <div className="mt-1 text-sm text-slate-500">₹{goal.saved.toLocaleString("en-IN")} / ₹{goal.target.toLocaleString("en-IN")}</div>
      <Progress value={pct}/>
      <button disabled={checked} onClick={checkin} className="primary mt-5 w-full disabled:opacity-50"><Check className="mr-2 inline" size={18}/>{checked ? "Checked in today" : "Daily check-in"}</button>
    </div>

    <div className="mt-4 flex items-center gap-3 rounded-3xl bg-orange-50 p-4">
      <Flame className="text-orange-500" fill="currentColor"/><div><b>{user.streakCount}-day streak</b><div className="text-sm text-slate-500">3 days = bonus • 7 days = Saver Streak • 30 days = mega bonus</div></div>
    </div>

    <div className="card mt-5">
      <b>Why emergency funds matter</b>
      <p className="mt-2 text-sm text-slate-600">An emergency fund is money kept aside for unexpected costs, so one surprise does not wreck your whole budget.</p>
      <p className="mt-3 text-sm text-slate-600"><b>Compound growth:</b> money can earn returns, and those returns can then earn returns too.</p>
    </div>
  </main>;
}