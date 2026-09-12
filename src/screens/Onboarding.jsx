import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Sparkles } from "lucide-react";
import { AVATARS, useFinStore } from "../store/useFinStore";

export default function Onboarding() {
  const [slide, setSlide] = useState(0);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(0);
  const navigate = useNavigate();
  const complete = useFinStore(s => s.completeOnboarding);

  const next = () => {
    if (slide < 2) setSlide(slide + 1);
    else {
      complete({ name, avatarId: avatar });
      navigate("/home");
    }
  };

  return (
    <div className="phone-shell flex min-h-screen flex-col justify-between bg-ink p-6 text-white">
      <div className="pt-10">
        <div className="mb-10 text-4xl">💸</div>
        {slide === 0 && <section>
          <div className="mb-4 inline-flex rounded-full bg-white/10 px-3 py-2 text-sm font-bold"><Sparkles size={15} className="mr-2"/> Learn by playing</div>
          <h1 className="text-5xl font-black leading-tight">Money skills, made fun.</h1>
          <p className="mt-5 text-lg text-white/70">Practice budgeting, saving and investing without risking real money.</p>
        </section>}
        {slide === 1 && <section>
          <h1 className="text-4xl font-black">Pick your player</h1>
          <p className="mt-3 text-white/70">Choose an avatar and a name for your FinPlay journey.</p>
          <div className="mt-8 grid grid-cols-3 gap-3">
            {AVATARS.map((a, i) => <button key={a} onClick={() => setAvatar(i)} className={`tap grid h-20 place-items-center rounded-3xl bg-white/10 text-4xl ${avatar === i ? "ring-4 ring-teal" : ""}`}>{a}</button>)}
          </div>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" className="mt-6 w-full rounded-2xl bg-white px-4 py-4 text-ink outline-none"/>
        </section>}
        {slide === 2 && <section>
          <h1 className="text-4xl font-black">Why it matters</h1>
          <div className="mt-8 rounded-3xl bg-white p-6 text-ink">
            <div className="text-5xl font-black text-teal">₹0 risk</div>
            <p className="mt-3 font-semibold">Every decision here is virtual, so you can make mistakes, learn, and try again.</p>
          </div>
          <p className="mt-5 text-white/70">Good money habits are built through small decisions repeated over time.</p>
        </section>}
      </div>
      <div>
        <div className="mb-5 flex justify-center gap-2">{[0,1,2].map(i => <div key={i} className={`h-2 rounded-full ${i === slide ? "w-8 bg-teal" : "w-2 bg-white/30"}`} />)}</div>
        <button onClick={next} className="primary flex w-full items-center justify-center gap-2 bg-white !text-ink hover:bg-white/90">
          {slide === 2 ? "Start Playing" : "Continue"} <ChevronRight size={20}/>
        </button>
      </div>
    </div>
  );
}