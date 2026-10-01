"use client";

import { useState } from "react";
import ReviewPanel from "@/components/ReviewPanel";
import type { QuizQuestion } from "@/lib/quiz";

interface ResultsPanelProps {
  score: number;
  totalQuestions: number;
  questions: QuizQuestion[];
  answers: number[];
  onRestart: () => void;
}

export default function ResultsPanel({
  score,
  totalQuestions,
  questions,
  answers,
  onRestart,
}: ResultsPanelProps) {
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const resultPercent = Math.round((score / totalQuestions) * 100);

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
          {score === totalQuestions
            ? "Perfect run!"
            : resultPercent >= 70
              ? "Strong result!"
              : resultPercent >= 40
                ? "Good effort!"
                : "Keep practicing!"}
        </h2>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-300 sm:text-base">
          {score === totalQuestions
            ? "You answered every question correctly. Try another quiz to keep the streak going."
            : "Review the answers below to see exactly where the story changed."}
        </p>

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
