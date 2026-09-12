import { AnimatePresence, motion } from "framer-motion";
import { Trophy, Sparkles } from "lucide-react";

export function RewardToast({ text, onClose }) {
  return (
    <AnimatePresence>
      {text && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: .9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30 }}
          className="fixed left-1/2 top-6 z-50 w-[90%] max-w-[390px] -translate-x-1/2 rounded-3xl bg-ink p-5 text-white shadow-2xl"
          onClick={onClose}
        >
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-gold p-3 text-ink"><Trophy size={22}/></div>
            <div className="font-extrabold">{text}</div>
            <Sparkles className="ml-auto" size={20}/>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Progress({ value }) {
  return <div className="h-3 overflow-hidden rounded-full bg-slate-100">
    <motion.div className="h-full rounded-full bg-teal" initial={{ width: 0 }} animate={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
  </div>;
}