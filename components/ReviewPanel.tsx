import type { QuizQuestion } from "@/lib/quiz";

interface ReviewPanelProps {
  questions: QuizQuestion[];
  answers: number[];
}

export default function ReviewPanel({ questions, answers }: ReviewPanelProps) {
  return (
    <div className="animate-fade-up mt-9 grid gap-4 text-left">
      {questions.map((question, index) => {
        const selectedAnswer = answers[index];
        const isCorrect = selectedAnswer === question.correct;

        return (
          <article
            key={question.question}
            className={`rounded-2xl border p-4 sm:p-5 ${
              isCorrect
                ? "border-emerald-400/25 bg-emerald-400/[0.07]"
                : "border-rose-400/25 bg-rose-400/[0.07]"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                Question {index + 1}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  isCorrect
                    ? "bg-emerald-400/15 text-emerald-200"
                    : "bg-rose-400/15 text-rose-200"
                }`}
              >
                {isCorrect ? "Correct" : "Incorrect"}
              </span>
            </div>

            <p className="mt-3 text-base font-semibold text-white">{question.question}</p>

            <div className="mt-3 space-y-2 text-sm text-slate-300">
              <p>
                Your answer:{" "}
                <span className="font-semibold text-white">
                  {selectedAnswer === -1 ? "Not answered" : question.options[selectedAnswer]}
                </span>
              </p>
              <p>
                Correct answer:{" "}
                <span className="font-semibold text-emerald-200">
                  {question.options[question.correct]}
                </span>
              </p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
