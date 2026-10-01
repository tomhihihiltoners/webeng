"use client";

import { useEffect, useMemo, useState } from "react";
import OptionButton from "@/components/OptionButton";
import QuestionTimer from "@/components/QuestionTimer";
import ResultsPanel from "@/components/ResultsPanel";
import TeamScoreboard from "@/components/TeamScoreboard";
import TeamSetup from "@/components/TeamSetup";
import type { QuizData } from "@/lib/quiz";
import {
  createInitialTeams,
  createTeam,
  normalizeTeamName,
  type Team,
} from "@/lib/teams";

const QUESTION_DURATION_MS = 60_000;

type QuizPhase = "setup" | "question" | "results";

export default function QuizPlayer({ quiz }: { quiz: QuizData }) {
  const [phase, setPhase] = useState<QuizPhase>("setup");
  const [teams, setTeams] = useState<Team[]>(createInitialTeams);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(() =>
    Array.from({ length: quiz.questions.length }, () => -1),
  );
  const [remainingMs, setRemainingMs] = useState(QUESTION_DURATION_MS);
  const [awardedTeamId, setAwardedTeamId] = useState<string | null>(null);

  const totalQuestions = quiz.questions.length;
  const question = quiz.questions[currentQuestion];
  const selectedAnswer = answers[currentQuestion];
  const hasAnswered = selectedAnswer !== -1;
  const isCorrect = selectedAnswer === question.correct;
  const timeExpired = remainingMs <= 0;
  const answersLocked = hasAnswered || timeExpired;
  const isLastQuestion = currentQuestion === totalQuestions - 1;

  const correctAnswerCount = useMemo(
    () =>
      quiz.questions.reduce(
        (currentScore, quizQuestion, index) =>
          answers[index] === quizQuestion.correct ? currentScore + 1 : currentScore,
        0,
      ),
    [answers, quiz.questions],
  );

  const progress = Math.round(
    ((currentQuestion + (answersLocked ? 1 : 0)) / totalQuestions) * 100,
  );

  const isTimerRunning = phase === "question" && !hasAnswered && remainingMs > 0;

  useEffect(() => {
    if (!isTimerRunning) return;

    const timerId = window.setInterval(() => {
      setRemainingMs((currentRemaining) => Math.max(0, currentRemaining - 100));
    }, 100);

    return () => window.clearInterval(timerId);
  }, [isTimerRunning]);

  function updateTeamName(teamId: string, name: string) {
    setTeams((previousTeams) =>
      previousTeams.map((team) => (team.id === teamId ? { ...team, name } : team)),
    );
  }

  function addTeam() {
    setTeams((previousTeams) => [...previousTeams, createTeam(previousTeams.length + 1)]);
  }

  function removeTeam(teamId: string) {
    setTeams((previousTeams) =>
      previousTeams.length === 1 ? previousTeams : previousTeams.filter((team) => team.id !== teamId),
    );
  }

  function resetQuizState() {
    setCurrentQuestion(0);
    setAnswers(Array.from({ length: totalQuestions }, () => -1));
    setRemainingMs(QUESTION_DURATION_MS);
    setAwardedTeamId(null);
  }

  function startQuiz() {
    setTeams((previousTeams) =>
      previousTeams.map((team, index) => ({
        ...team,
        name: normalizeTeamName(team.name, index + 1),
        score: 0,
      })),
    );
    resetQuizState();
    setPhase("question");
  }

  function selectAnswer(optionIndex: number) {
    if (answersLocked) return;

    setAnswers((previousAnswers) => {
      const nextAnswers = [...previousAnswers];
      nextAnswers[currentQuestion] = optionIndex;
      return nextAnswers;
    });
  }

  function awardPoint(teamId: string) {
    if (!hasAnswered || !isCorrect || awardedTeamId !== null) return;

    setTeams((previousTeams) =>
      previousTeams.map((team) =>
        team.id === teamId ? { ...team, score: team.score + 1 } : team,
      ),
    );
    setAwardedTeamId(teamId);
  }

  function updateTeamScore(teamId: string, score: number) {
    setTeams((previousTeams) =>
      previousTeams.map((team) => (team.id === teamId ? { ...team, score } : team)),
    );
  }

  function goToNextQuestion() {
    if (!answersLocked) return;
    if (hasAnswered && isCorrect && awardedTeamId === null) return;

    if (isLastQuestion) {
      setPhase("results");
      return;
    }

    setCurrentQuestion((previousQuestion) => previousQuestion + 1);
    setRemainingMs(QUESTION_DURATION_MS);
    setAwardedTeamId(null);
  }

  function restartQuiz() {
    setTeams((previousTeams) => previousTeams.map((team) => ({ ...team, score: 0 })));
    resetQuizState();
    setPhase("question");
  }

  function changeTeams() {
    setTeams((previousTeams) => previousTeams.map((team) => ({ ...team, score: 0 })));
    resetQuizState();
    setPhase("setup");
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
            Correct
          </p>
          <p className="text-lg font-bold text-white">
            {correctAnswerCount}
            <span className="text-sm font-medium text-slate-400"> / {totalQuestions}</span>
          </p>
        </div>
      </header>

      {phase === "setup" ? (
        <TeamSetup
          teams={teams}
          onTeamNameChange={updateTeamName}
          onAddTeam={addTeam}
          onRemoveTeam={removeTeam}
          onStartQuiz={startQuiz}
        />
      ) : phase === "question" ? (
        <>
        <section
          key={currentQuestion}
          className="animate-fade-up rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-slate-950/50 backdrop-blur-xl sm:p-8"
        >
          <QuestionTimer
            key={`timer-${currentQuestion}`}
            remainingMs={remainingMs}
            durationMs={QUESTION_DURATION_MS}
          />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="rounded-full border border-indigo-400/30 bg-indigo-400/10 px-4 py-1.5 text-sm font-semibold text-indigo-100">
              Question {currentQuestion + 1} / {totalQuestions}
            </span>
            <span
              className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
                timeExpired && !hasAnswered
                  ? "border-rose-400/40 bg-rose-400/10 text-rose-200"
                  : hasAnswered
                  ? isCorrect
                    ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-200"
                    : "border-rose-400/40 bg-rose-400/10 text-rose-200"
                  : "border-white/10 bg-white/[0.04] text-slate-400"
              }`}
            >
              {timeExpired && !hasAnswered
                ? "Time expired"
                : hasAnswered
                  ? isCorrect
                    ? "Correct"
                    : "Incorrect"
                  : "Pick an answer"}
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
                hasAnswered={answersLocked}
                onSelect={selectAnswer}
              />
            ))}
          </div>

          {(hasAnswered || timeExpired) && (
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
                {timeExpired && !hasAnswered ? "⏱" : isCorrect ? "✓" : "!"}
              </span>
              <div>
                <p className="font-semibold">
                  {timeExpired && !hasAnswered
                    ? "Time's up"
                    : isCorrect
                      ? "Nice work!"
                      : "Not quite"}
                </p>
                <p className="text-sm text-slate-200/80">
                  Correct answer: {question.options[question.correct]}
                </p>
              </div>
            </div>
          )}

          {hasAnswered && isCorrect && (
            <div className="animate-fade-up mt-4 rounded-2xl border border-indigo-400/30 bg-indigo-400/[0.07] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-indigo-100">
                  {awardedTeamId === null
                    ? "Select the team that receives the point"
                    : `Point awarded to ${
                        teams.find((team) => team.id === awardedTeamId)?.name ?? "team"
                      }`}
                </p>
                <span className="rounded-full bg-indigo-400/15 px-3 py-1 text-xs font-bold text-indigo-100">
                  +1
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {teams.map((team) => (
                  <button
                    key={team.id}
                    type="button"
                    onClick={() => awardPoint(team.id)}
                    disabled={awardedTeamId !== null}
                    className={`rounded-xl border px-4 py-2 text-sm font-bold transition disabled:cursor-default ${
                      awardedTeamId === team.id
                        ? "border-emerald-400/60 bg-emerald-400/15 text-emerald-100"
                        : awardedTeamId === null
                          ? "border-white/10 bg-white/[0.05] text-white hover:border-indigo-300/60 hover:bg-indigo-400/10"
                          : "border-white/5 bg-white/[0.02] text-slate-500"
                    }`}
                  >
                    {team.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {answersLocked && (
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={goToNextQuestion}
                disabled={hasAnswered && isCorrect && awardedTeamId === null}
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-indigo-500/25 transition hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:brightness-100"
              >
                {isLastQuestion ? "View results" : "Continue"}
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </button>
            </div>
          )}
        </section>
        <div className="mt-4">
          <TeamScoreboard teams={teams} onScoreChange={updateTeamScore} />
        </div>
        </>
      ) : (
        <ResultsPanel
          score={correctAnswerCount}
          totalQuestions={totalQuestions}
          questions={quiz.questions}
          answers={answers}
          teams={teams}
          onRestart={restartQuiz}
          onChangeTeams={changeTeams}
        />
      )}
    </div>
  );
}
