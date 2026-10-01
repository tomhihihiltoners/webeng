"use client";

import { useState } from "react";
import type { Team } from "@/lib/teams";

interface TeamScoreboardProps {
  teams: Team[];
  onScoreChange: (teamId: string, score: number) => void;
}

export default function TeamScoreboard({
  teams,
  onScoreChange,
}: TeamScoreboardProps) {
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [scoreDraft, setScoreDraft] = useState("0");

  function startEditing(team: Team) {
    setEditingTeamId(team.id);
    setScoreDraft(String(team.score));
  }

  function saveScore(team: Team) {
    const trimmedScore = scoreDraft.trim();

    if (/^-?\d+$/.test(trimmedScore)) {
      onScoreChange(team.id, Number.parseInt(trimmedScore, 10));
    }

    setEditingTeamId(null);
  }

  return (
    <section
      aria-label="Team scores"
      className="sticky bottom-4 z-20 rounded-3xl border border-white/10 bg-[#070a13]/90 p-4 shadow-2xl shadow-slate-950/60 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300/80">
          Teams
        </h2>
        <span className="text-[0.7rem] font-medium text-slate-500">
          Tap a score to edit
        </span>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        {teams.map((team) => {
          const isEditing = editingTeamId === team.id;

          return (
            <div
              key={team.id}
              className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2"
            >
              <span className="min-w-0 flex-1 truncate text-sm font-semibold text-white">
                {team.name}
              </span>

              {isEditing ? (
                <input
                  type="text"
                  inputMode="numeric"
                  autoFocus
                  value={scoreDraft}
                  onChange={(event) => setScoreDraft(event.target.value)}
                  onBlur={() => saveScore(team)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      saveScore(team);
                    }
                    if (event.key === "Escape") {
                      setEditingTeamId(null);
                    }
                  }}
                  aria-label={`${team.name} score`}
                  className="w-16 rounded-lg border border-indigo-400/50 bg-slate-950/80 px-2 py-1 text-right text-sm font-bold text-white outline-none focus:border-indigo-300"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => startEditing(team)}
                  className={`min-w-11 rounded-lg px-2 py-1 text-right text-sm font-bold transition ${
                    team.score < 0
                      ? "text-rose-300 hover:bg-rose-400/10"
                      : "text-cyan-200 hover:bg-cyan-400/10"
                  }`}
                  aria-label={`Edit ${team.name} score`}
                >
                  {team.score}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
