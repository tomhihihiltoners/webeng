"use client";

import type { Team } from "@/lib/teams";

interface TeamSetupProps {
  teams: Team[];
  onTeamNameChange: (teamId: string, name: string) => void;
  onAddTeam: () => void;
  onRemoveTeam: (teamId: string) => void;
  onStartQuiz: () => void;
}

export default function TeamSetup({
  teams,
  onTeamNameChange,
  onAddTeam,
  onRemoveTeam,
  onStartQuiz,
}: TeamSetupProps) {
  return (
    <section className="animate-scale-in rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-slate-950/50 backdrop-blur-xl sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300/80">
            Team mode
          </p>
          <h2 className="mt-1 text-2xl font-bold text-white sm:text-3xl">Create your teams</h2>
        </div>
        <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-sm font-semibold text-slate-300">
          {teams.length} {teams.length === 1 ? "team" : "teams"}
        </span>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-slate-400">
        Add the teams playing this quiz. After a correct answer, you will choose which team receives the point.
      </p>

      <div className="mt-6 grid gap-3">
        {teams.map((team, index) => (
          <div
            key={team.id}
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3 transition focus-within:border-indigo-400/50"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-indigo-500/30 to-cyan-400/20 text-sm font-bold text-indigo-100">
              {index + 1}
            </span>
            <input
              type="text"
              value={team.name}
              maxLength={40}
              onChange={(event) => onTeamNameChange(team.id, event.target.value)}
              placeholder={`Team ${index + 1}`}
              aria-label={`Team ${index + 1} name`}
              className="min-w-0 flex-1 rounded-xl bg-transparent px-2 py-2 text-base font-semibold text-white outline-none placeholder:text-slate-500"
            />
            <span className="rounded-lg bg-white/[0.06] px-3 py-1 text-sm font-bold text-slate-300">
              0
            </span>
            <button
              type="button"
              onClick={() => onRemoveTeam(team.id)}
              disabled={teams.length === 1}
              className="rounded-xl border border-white/10 px-3 py-2 text-sm font-bold text-slate-400 transition hover:border-rose-400/50 hover:bg-rose-400/10 hover:text-rose-200 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label={`Remove ${team.name}`}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onAddTeam}
          className="flex-1 rounded-xl border border-dashed border-indigo-400/40 bg-indigo-400/[0.06] px-5 py-3 text-sm font-bold text-indigo-100 transition hover:border-indigo-300 hover:bg-indigo-400/10"
        >
          + Add team
        </button>
        <button
          type="button"
          onClick={onStartQuiz}
          className="flex-1 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-indigo-500/25 transition hover:brightness-110 active:scale-[0.98]"
        >
          Start Quiz
        </button>
      </div>
    </section>
  );
}
