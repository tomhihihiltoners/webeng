interface QuestionTimerProps {
  remainingMs: number;
  durationMs: number;
}

export default function QuestionTimer({
  remainingMs,
  durationMs,
}: QuestionTimerProps) {
  const remainingSeconds = Math.ceil(remainingMs / 1000);
  const percentage = Math.max(0, Math.min(100, (remainingMs / durationMs) * 100));
  const isExpired = remainingMs <= 0;
  const isLowTime = remainingSeconds <= 10;

  return (
    <div className="animate-fade-up" aria-label={`${remainingSeconds} seconds remaining`}>
      <div
        className={`h-2.5 overflow-hidden rounded-full ${
          isExpired ? "bg-rose-400/15" : isLowTime ? "bg-amber-400/15" : "bg-white/10"
        }`}
      >
        <div
          className={`h-full rounded-full transition-[width] duration-100 ease-linear ${
            isExpired
              ? "bg-rose-400"
              : isLowTime
                ? "bg-gradient-to-r from-amber-400 to-rose-400"
                : "bg-gradient-to-r from-indigo-400 to-cyan-300"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between text-xs font-semibold uppercase tracking-widest">
        <span className={isExpired ? "text-rose-300" : isLowTime ? "text-amber-300" : "text-slate-400"}>
          {isExpired ? "Time expired" : "Time remaining"}
        </span>
        <span
          className={`rounded-full px-2 py-0.5 ${
            isExpired
              ? "bg-rose-400/15 text-rose-200"
              : isLowTime
                ? "bg-amber-400/15 text-amber-200"
                : "bg-white/[0.06] text-slate-200"
          }`}
        >
          {remainingSeconds} sec
        </span>
      </div>
    </div>
  );
}
