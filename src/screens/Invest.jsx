import { useMemo, useState } from "react";
import { Brain, FastForward, ShieldCheck } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useFinStore } from "../store/useFinStore";
import { RewardToast } from "../components/Reward";

const assets = [
  { key:"bond", name:"Safe Bond", icon:"🛡️", risk:"Low", range:[4,6] },
  { key:"fund", name:"Balanced Fund", icon:"⚖️", risk:"Medium", range:[-3,12] },
  { key:"stock", name:"Growth Stock", icon:"🚀", risk:"High", range:[-20,25] },
  { key:"crypto", name:"Volatile Crypto", icon:"🪙", risk:"Very high", range:[-45,55] },
];

function outcome([min,max]) { return Math.round((min + Math.random() * (max-min)) * 10) / 10; }

export default function Invest() {
  const complete = useFinStore(s => s.completeInvesting);
  const [coins, setCoins] = useState(1000);
  const [alloc, setAlloc] = useState({bond:25,fund:25,stock:25,crypto:25});
  const [result, setResult] = useState(null);
  const [toast, setToast] = useState("");

  const total = Object.values(alloc).reduce((a,b)=>a+b,0);
  const set = (key, value) => {
    const others = assets.filter(a=>a.key!==key).map(a=>a.key);
    const delta = value - alloc[key];
    let next = {...alloc,[key]:value};
    if(delta>0){
      let left=delta;
      for(const k of others){ const cut=Math.min(next[k],left); next[k]-=cut; left-=cut; if(!left)break; }
    }
    setAlloc(next);
  };

  const run = () => {
    const outcomes = assets.reduce((o,a)=>({...o,[a.key]:outcome(a.range)}),{});
    const chart = assets.map(a=>({name:a.name.split(" ")[0], return:outcomes[a.key]}));
    setResult({outcomes, chart});
    complete({date:new Date().toISOString(), allocations:alloc, outcomes, xpEarned:60});
    setToast("+60 XP • +30 coins");
  };

  return <main className="page">
    <RewardToast text={toast} onClose={()=>setToast("")}/>
    <header><div className="muted">Invest Game • Virtual coins only</div><h1 className="text-3xl font-black">Build a portfolio 📈</h1></header>

    <div className="card mt-5 bg-ink text-white">
      <div className="flex gap-3"><ShieldCheck/><div><b>Risk, not magic</b><p className="mt-1 text-sm text-white/70">Higher possible returns usually come with bigger possible losses. Diversification spreads risk.</p></div></div>
    </div>

    <div className="card mt-5">
      <div className="flex justify-between"><span className="font-bold">Virtual coins</span><span className="font-black text-teal">🪙 {coins}</span></div>
      <p className="muted mt-1">Allocate percentages. The app invests the same virtual amount in each slice.</p>
    </div>

    <div className="mt-4 space-y-3">
      {assets.map(a=><div className="card" key={a.key}>
        <div className="flex items-center gap-3"><span className="text-2xl">{a.icon}</span><div className="flex-1"><b>{a.name}</b><div className="text-xs text-slate-500">{a.risk} risk • {a.range[0]}% to {a.range[1]}% possible 1-year outcome</div></div><b className="text-teal">{alloc[a.key]}%</b></div>
        <input type="range" min="0" max="70" value={alloc[a.key]} onChange={e=>set(a.key,Number(e.target.value))} className="mt-3 w-full accent-teal"/>
        <div className="mt-1 text-xs text-slate-400">₹{Math.round(coins*alloc[a.key]/100)} virtual coins</div>
      </div>)}
    </div>

    <div className="mt-4 rounded-2xl bg-slate-100 p-3 text-center text-sm font-bold">Total allocation: {total}%</div>
    <button disabled={total!==100} onClick={run} className="primary mt-4 w-full disabled:opacity-40"><FastForward className="mr-2 inline" size={18}/>Fast forward 1 year</button>

    {result && <div className="card mt-5">
      <div className="flex items-center gap-2"><Brain className="text-teal"/><b>Your simulated outcomes</b></div>
      <div className="mt-4 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={result.chart}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="name"/><YAxis/><Tooltip/><Bar dataKey="return"/></BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-3 text-sm font-semibold">Learning point: don't chase the biggest number. Match risk to your goal and comfort level, and avoid putting everything into one asset.</p>
    </div>}
  </main>;
}