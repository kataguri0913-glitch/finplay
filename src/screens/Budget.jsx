import { useMemo, useState } from "react";
import { CheckCircle2, Info, RotateCcw, XCircle } from "lucide-react";
import { useFinStore } from "../store/useFinStore";
import { RewardToast } from "../components/Reward";

const categories = [
  ["Rent", "🏠"], ["Food", "🍲"], ["Transport", "🚌"], ["Savings", "💰"], ["Entertainment", "🎮"], ["Emergency Fund", "🛟"]
];

export default function Budget() {
  const complete = useFinStore(s => s.completeBudget);
  const count = useFinStore(s => s.budgetRounds.length);
  const [income, setIncome] = useState(() => 15000 + Math.floor(Math.random() * 15001));
  const [alloc, setAlloc] = useState({ Rent: 30, Food: 15, Transport: 10, Savings: 15, Entertainment: 10, "Emergency Fund": 20 });
  const [result, setResult] = useState(null);
  const [toast, setToast] = useState("");

  const total = Object.values(alloc).reduce((a,b) => a+b, 0);
  const balanced = total === 100 && alloc.Savings >= 10 && alloc.Rent <= 40;

  const update = (key, val) => {
    const others = categories.filter(([c]) => c !== key).map(([c]) => c);
    const delta = val - alloc[key];
    let next = { ...alloc, [key]: val };
    if (delta > 0) {
      let remaining = delta;
      for (const c of others) {
        const cut = Math.min(next[c], remaining);
        next[c] -= cut; remaining -= cut;
        if (!remaining) break;
      }
    }
    setAlloc(next);
  };

  const submit = () => {
    const xp = balanced ? 50 : 20;
    setResult(balanced ? "Great plan! Your essentials are controlled and you're paying yourself first." : "Almost there. Keep the total at 100%, aim for at least 10% savings, and avoid letting rent dominate.");
    complete({ date: new Date().toISOString(), income, allocations: alloc, wasBalanced: balanced, xpEarned: xp });
    setToast(balanced ? "+50 XP • +25 coins" : "+20 XP • +10 coins");
  };

  const reset = () => {
    setIncome(15000 + Math.floor(Math.random() * 15001));
    setAlloc({ Rent: 30, Food: 15, Transport: 10, Savings: 15, Entertainment: 10, "Emergency Fund": 20 });
    setResult(null);
  };

  return <main className="page">
    <RewardToast text={toast} onClose={() => setToast("")}/>
    <header><div className="muted">Budget Game • Round {count + 1}</div><h1 className="text-3xl font-black">Make your money work</h1></header>

    {count === 0 && <div className="card mt-5 border border-teal/20 bg-mint">
      <div className="flex gap-3"><Info className="shrink-0 text-teal"/><div><b>Needs vs wants</b><p className="mt-1 text-sm">Needs keep life running. Wants are optional. A good budget makes room for both.</p></div></div>
    </div>}

    <div className="card mt-5"><div className="muted">Monthly income</div><div className="mt-1 text-3xl font-black">₹{income.toLocaleString("en-IN")}</div><div className="mt-4 flex justify-between text-sm font-bold"><span>Allocated {total}%</span><span className={total === 100 ? "text-teal" : "text-red-500"}>{total === 100 ? "Balanced" : `${100-total}% remaining`}</span></div><div className="mt-2 h-3 rounded-full bg-slate-100"><div className={`h-full rounded-full ${total === 100 ? "bg-teal" : "bg-gold"}`} style={{width: `${Math.min(100,total)}%`}}/></div></div>

    <div className="mt-5 space-y-3">
      {categories.map(([cat, icon]) => <div className="card" key={cat}>
        <div className="mb-2 flex justify-between"><span className="font-bold">{icon} {cat}</span><span className="font-black text-teal">{alloc[cat]}%</span></div>
        <input aria-label={cat} type="range" min="0" max="60" value={alloc[cat]} onChange={e => update(cat, Number(e.target.value))} className="w-full accent-teal"/>
        <div className="mt-1 text-xs text-slate-400">₹{Math.round(income * alloc[cat] / 100).toLocaleString("en-IN")}</div>
      </div>)}
    </div>

    {result && <div className={`card mt-5 ${balanced ? "border border-teal/30" : "border border-red-200"}`}>
      <div className="flex gap-3">{balanced ? <CheckCircle2 className="text-teal"/> : <XCircle className="text-red-500" />}<p className="text-sm font-semibold">{result}</p></div>
    </div>}

    <div className="mt-5 flex gap-3">
      <button className="secondary flex-1" onClick={reset}><RotateCcw className="mr-2 inline" size={18}/>New round</button>
      <button className="primary flex-1 disabled:opacity-40" disabled={total !== 100} onClick={submit}>Submit plan</button>
    </div>
  </main>;
}