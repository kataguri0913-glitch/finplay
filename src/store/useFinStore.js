import { create } from "zustand";
import { persist } from "zustand/middleware";
import { saveCloudState } from "../lib/persistence";

const LEVELS = [
  { level: 1, min: 0, max: 100 },
  { level: 2, min: 100, max: 250 },
  { level: 3, min: 250, max: 500 },
  { level: 4, min: 500, max: 850 },
  { level: 5, min: 850, max: 1300 },
  { level: 6, min: 1300, max: 1900 },
  { level: 7, min: 1900, max: 2700 },
  { level: 8, min: 2700, max: 3700 },
];

export const AVATARS = ["🦊", "🐼", "🐸", "🦁", "🐨", "🐯"];

const initial = {
  onboarded: false,
  user: {
    name: "Player",
    avatarId: 0,
    level: 1,
    totalXP: 0,
    coins: 100,
    streakCount: 0,
    lastCheckIn: null,
    badges: [],
    savingsGoals: [{ id: "default", name: "Emergency Fund", target: 5000, saved: 0 }],
  },
  budgetRounds: [],
  investingRounds: [],
  savingsCheckins: [],
};

function getLevel(xp) {
  const found = [...LEVELS].reverse().find(x => xp >= x.min);
  return found?.level ?? 1;
}

function snapshot(state) {
  return {
    onboarded: state.onboarded,
    user: state.user,
    budgetRounds: state.budgetRounds,
    investingRounds: state.investingRounds,
    savingsCheckins: state.savingsCheckins,
  };
}

export const useFinStore = create(
  persist(
    (set, get) => ({
      ...initial,

      hydrate: (cloud) => cloud && set(cloud),

      completeOnboarding: ({ name, avatarId }) => {
        set(s => ({
          onboarded: true,
          user: {
            ...s.user,
            name: name || "Player",
            avatarId,
            badges: s.user.badges.includes("first") ? s.user.badges : [...s.user.badges, "first"],
          }
        }));
      },

      award: async (xp, coins) => {
        set(s => {
          const nextXP = s.user.totalXP + xp;
          return {
            user: {
              ...s.user,
              totalXP: nextXP,
              coins: s.user.coins + coins,
              level: getLevel(nextXP),
            }
          };
        });
        await saveCloudState(snapshot(get()));
      },

      completeBudget: async (round) => {
        set(s => {
          const rounds = [...s.budgetRounds, round];
          const badges = rounds.length >= 5 && !s.user.badges.includes("budget")
            ? [...s.user.badges, "budget"] : s.user.badges;
          const xp = round.wasBalanced ? 50 : 20;
          return {
            budgetRounds: rounds,
            user: {
              ...s.user,
              totalXP: s.user.totalXP + xp,
              coins: s.user.coins + (round.wasBalanced ? 25 : 10),
              level: getLevel(s.user.totalXP + xp),
              badges
            }
          };
        });
        await saveCloudState(snapshot(get()));
      },

      checkInSavings: async (amount) => {
        const today = new Date().toISOString().slice(0, 10);
        set(s => {
          if (s.user.lastCheckIn === today) return s;
          const previous = s.user.lastCheckIn;
          const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
          const streak = previous === yesterday ? s.user.streakCount + 1 : 1;
          const goal = s.user.savingsGoals[0];
          const goals = s.user.savingsGoals.length
            ? [{ ...goal, saved: Math.min(goal.target, goal.saved + amount) }, ...s.user.savingsGoals.slice(1)]
            : s.user.savingsGoals;
          const badges = streak >= 7 && !s.user.badges.includes("saver")
            ? [...s.user.badges, "saver"] : s.user.badges;
          const xp = streak % 7 === 0 ? 50 : 15;
          return {
            savingsCheckins: [...s.savingsCheckins, { date: today, amount }],
            user: {
              ...s.user,
              streakCount: streak,
              lastCheckIn: today,
              savingsGoals: goals,
              totalXP: s.user.totalXP + xp,
              coins: s.user.coins + (streak % 7 === 0 ? 40 : 10),
              level: getLevel(s.user.totalXP + xp),
              badges
            }
          };
        });
        await saveCloudState(snapshot(get()));
      },

      setSavingsGoal: (name, target) => set(s => ({
        user: {
          ...s.user,
          savingsGoals: [{ id: "default", name, target: Number(target), saved: 0 }]
        }
      })),

      completeInvesting: async (round) => {
        set(s => {
          const rounds = [...s.investingRounds, round];
          const badges = rounds.length >= 3 && !s.user.badges.includes("investor")
            ? [...s.user.badges, "investor"] : s.user.badges;
          const xp = 60;
          return {
            investingRounds: rounds,
            user: {
              ...s.user,
              totalXP: s.user.totalXP + xp,
              coins: s.user.coins + 30,
              level: getLevel(s.user.totalXP + xp),
              badges
            }
          };
        });
        await saveCloudState(snapshot(get()));
      },
    }),
    { name: "finplay-store" }
  )
);

export { LEVELS };