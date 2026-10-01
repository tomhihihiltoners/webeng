"use client";

import { useState } from "react";
import ReviewPanel from "@/components/ReviewPanel";
import type { QuizQuestion } from "@/lib/quiz";
import type { Team } from "@/lib/teams";

interface ResultsPanelProps {
  score: number;
  totalQuestions: number;
  questions: QuizQuestion[];
  answers: number[];
  teams: Team[];
  onRestart: () => void;
  onChangeTeams: () => void;
}

export default function ResultsPanel({
  score,
  totalQuestions,
  questions,
  answers,
  teams,
  onRestart,
  onChangeTeams,
}: ResultsPanelProps) {
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const resultPercent = Math.round((score / totalQuestions) * 100);
  const highestScore = Math.max(...teams.map((team) => team.score));
  const winningTeams = teams.filter((team) => team.score === highestScore);

  return (
    <section className="animate-scale-in rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-slate-950/50 backdrop-blur-xl sm:p-10">
      <div className="flex flex-col items-center text-center">
        <div
          className="relative grid h-44 w-44 place-items-center rounded-full"
          style={{
            background: `conic-gradient(#34d399 ${resultPercent * 3.6}deg, rgba(255,255,255,0.08) 0)`,
          }}
        >
          <div className="grid h-36 w-36 place-items-center rounded-full border border-white/10 bg-[#070a13]">
            <div>
              <p className="text-4xl font-black text-white">
                {score}
                <span className="text-xl font-bold text-slate-400"> / {totalQuestions}</span>
              </p>
              <p className="mt-1 text-sm font-semibold text-emerald-300">{resultPercent}%</p>
            </div>
          </div>
        </div>

        <h2 className="mt-8 text-3xl font-bold text-white">
          {winningTeams.length === 1
            ? `${winningTeams[0].name} wins!`
            : winningTeams.length > 1
              ? "It's a tie!"
              : "No winner"}
        </h2>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-300 sm:text-base">
          {score === totalQuestions
            ? "Every answer was correct. Review the team standings and answers below."
            : "Review the team standings and answers below to see exactly where the story changed."}
        </p>

        <div className="mt-7 w-full rounded-3xl border border-white/10 bg-white/[0.04] p-4 text-left backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300/80">
              Final team scores
            </h3>
            <span className="rounded-full bg-white/[0.06] px-3 py-1 text-xs font-bold text-slate-300">
              {teams.length} {teams.length === 1 ? "team" : "teams"}
            </span>
          </div>

          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {teams.map((team) => {
              const isWinner = team.score === highestScore;

              return (
                <div
                  key={team.id}
                  className={`flex items-center justify-between gap-3 rounded-2xl border px-3 py-2 ${
                    isWinner
                      ? "border-emerald-400/40 bg-emerald-400/[0.08]"
                      : "border-white/10 bg-white/[0.03]"
                  }`}
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">{team.name}</p>
                    {isWinner && (
                      <p className="text-[0.7rem] font-bold uppercase tracking-widest text-emerald-300">
                        Winner
                      </p>
                    )}
                  </div>
                  <span
                    className={`text-lg font-black ${
                      team.score < 0 ? "text-rose-300" : "text-cyan-200"
                    }`}
                  >
                    {team.score}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={onRestart}
            className="rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-indigo-500/25 transition hover:brightness-110 active:scale-[0.98]"
          >
            Restart quiz
          </button>
          <button
            type="button"
            onClick={onChangeTeams}
            className="rounded-xl border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-bold text-white transition hover:border-indigo-400/50 hover:bg-indigo-400/10"
          >
            Change teams
          </button>
          <button
            type="button"
            onClick={() => setIsReviewOpen((previous) => !previous)}
            className="rounded-xl border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-bold text-white transition hover:border-indigo-400/50 hover:bg-indigo-400/10"
          >
            {isReviewOpen ? "Hide review" : "Review answers"}
          </button>
        </div>
      </div>

      {isReviewOpen && <ReviewPanel questions={questions} answers={answers} />}
    </section>
  );
}
