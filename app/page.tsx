import QuizPlayer from "@/components/QuizPlayer";
import quizData from "@/data/quiz.json";
import { parseQuiz } from "@/lib/quiz";

const quiz = parseQuiz(quizData);

export default function HomePage() {
  return (
    <main className="relative isolate min-h-dvh overflow-hidden px-4 py-8 sm:px-6 lg:py-12">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute bottom-[-8rem] right-[-4rem] h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute bottom-[-6rem] left-[-4rem] h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-3xl flex-col justify-center lg:min-h-[calc(100dvh-6rem)]">
        <QuizPlayer quiz={quiz} />
      </div>
    </main>
  );
}
