"use client";

import { useMemo, useState } from "react";
import OptionButton from "@/components/OptionButton";
import ResultsPanel from "@/components/ResultsPanel";
import type { QuizData } from "@/lib/quiz";

export default function QuizPlayer({ quiz }: { quiz: QuizData }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(() =>
    Array.from({ length: quiz.questions.length }, () => -1),
  );
  const [phase, setPhase] = useState<"question" | "results">("question");

  const totalQuestions = quiz.questions.length;
  const question = quiz.questions[currentQuestion];
  const selectedAnswer = answers[currentQuestion];
  const hasAnswered = selectedAnswer !== -1;
  const isCorrect = selectedAnswer === question.correct;
  const isLastQuestion = currentQuestion === totalQuestions - 1;

  const score = useMemo(
    () =>
      quiz.questions.reduce(
        (currentScore, quizQuestion, index) =>
          answers[index] === quizQuestion.correct ? currentScore + 1 : currentScore,
        0,
      ),
    [answers, quiz.questions],
  );

  const progress = Math.round(
    ((currentQuestion + (hasAnswered ? 1 : 0)) / totalQuestions) * 100,
  );

  function selectAnswer(optionIndex: number) {
    if (hasAnswered) return;

    setAnswers((previousAnswers) => {
      const nextAnswers = [...previousAnswers];
      nextAnswers[currentQuestion] = optionIndex;
      return nextAnswers;
    });
  }

  function goToNextQuestion() {
    if (!hasAnswered) return;

    if (isLastQuestion) {
      setPhase("results");
      return;
    }

    setCurrentQuestion((previousQuestion) => previousQuestion + 1);
  }

  function restartQuiz() {
    setCurrentQuestion(0);
    setAnswers(Array.from({ length: totalQuestions }, () => -1));
    setPhase("question");
  }

  return (
    <div className="flex flex-col">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-lg font-black text-slate-950 shadow-lg shadow-indigo-500/25">
            Q
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300/80">
              Interactive quiz
            </p>
            <h1 className="text-xl font-bold text-white sm:text-2xl">{quiz.title}</h1>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2 text-right backdrop-blur">
          <p className="text-[0.7rem] font-semibold uppercase tracking-widest text-slate-400">
            Score
          </p>
          <p className="text-lg font-bold text-white">
            {score}
            <span className="text-sm font-medium text-slate-400"> / {totalQuestions}</span>
          </p>
        </div>
      </header>

      {phase === "question" ? (
        <section
          key={currentQuestion}
          className="animate-fade-up rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-slate-950/50 backdrop-blur-xl sm:p-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="rounded-full border border-indigo-400/30 bg-indigo-400/10 px-4 py-1.5 text-sm font-semibold text-indigo-100">
              Question {currentQuestion + 1} / {totalQuestions}
            </span>
            <span
              className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
                hasAnswered
                  ? isCorrect
                    ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-200"
                    : "border-rose-400/40 bg-rose-400/10 text-rose-200"
                  : "border-white/10 bg-white/[0.04] text-slate-400"
              }`}
            >
              {hasAnswered ? (isCorrect ? "Correct" : "Incorrect") : "Pick an answer"}
            </span>
          </div>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-cyan-300 transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <h2 className="mt-8 text-balance text-2xl font-semibold leading-snug text-white sm:text-3xl">
            {question.question}
          </h2>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {question.options.map((option, index) => (
              <OptionButton
                key={option}
                option={option}
                index={index}
                selectedAnswer={selectedAnswer}
                correctIndex={question.correct}
                hasAnswered={hasAnswered}
                onSelect={selectAnswer}
              />
            ))}
          </div>

          {hasAnswered && (
            <div
              aria-live="polite"
              className={`animate-fade-up mt-6 flex items-start gap-3 rounded-2xl border p-4 ${
                isCorrect
                  ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-100"
                  : "border-rose-400/40 bg-rose-400/10 text-rose-100"
              }`}
            >
              <span
                className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-bold ${
                  isCorrect ? "bg-emerald-400/20 text-emerald-200" : "bg-rose-400/20 text-rose-200"
                }`}
              >
                {isCorrect ? "✓" : "!"}
              </span>
              <div>
                <p className="font-semibold">{isCorrect ? "Nice work!" : "Not quite"}</p>
                <p className="text-sm text-slate-200/80">
                  Correct answer: {question.options[question.correct]}
                </p>
              </div>
            </div>
          )}

          {hasAnswered && (
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={goToNextQuestion}
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-indigo-500/25 transition hover:brightness-110 active:scale-[0.98]"
              >
                {isLastQuestion ? "View results" : "Continue"}
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </button>
            </div>
          )}
        </section>
      ) : (
        <ResultsPanel
          score={score}
          totalQuestions={totalQuestions}
          questions={quiz.questions}
          answers={answers}
          onRestart={restartQuiz}
        />
      )}
    </div>
  );
}
