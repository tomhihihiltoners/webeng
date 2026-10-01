interface OptionButtonProps {
  option: string;
  index: number;
  selectedAnswer: number;
  correctIndex: number;
  hasAnswered: boolean;
  onSelect: (index: number) => void;
}

const optionStyles = {
  neutral:
    "border-white/10 bg-white/[0.04] text-slate-100 hover:border-indigo-400/50 hover:bg-indigo-400/10 hover:-translate-y-0.5",
  correct:
    "border-emerald-400/70 bg-emerald-400/10 text-emerald-50 shadow-[0_0_35px_-12px_rgba(52,211,153,0.85)]",
  wrong:
    "border-rose-400/70 bg-rose-400/10 text-rose-50 shadow-[0_0_35px_-12px_rgba(251,113,133,0.85)]",
  dim: "border-white/5 bg-white/[0.015] text-slate-500",
} as const;

const badgeStyles = {
  neutral: "border-white/10 bg-white/[0.06] text-indigo-200",
  correct: "border-emerald-300/50 bg-emerald-400/20 text-emerald-100",
  wrong: "border-rose-300/50 bg-rose-400/20 text-rose-100",
  dim: "border-white/10 bg-white/[0.03] text-slate-500",
} as const;

function getLetter(index: number) {
  return String.fromCharCode(65 + index);
}

export default function OptionButton({
  option,
  index,
  selectedAnswer,
  correctIndex,
  hasAnswered,
  onSelect,
}: OptionButtonProps) {
  const status = !hasAnswered
    ? "neutral"
    : index === correctIndex
      ? "correct"
      : index === selectedAnswer
        ? "wrong"
        : "dim";

  const symbol = !hasAnswered
    ? getLetter(index)
    : index === correctIndex
      ? "✓"
      : index === selectedAnswer
        ? "×"
        : getLetter(index);

  return (
    <button
      type="button"
      disabled={hasAnswered}
      onClick={() => onSelect(index)}
      className={`flex min-h-16 items-center gap-4 rounded-2xl border p-4 text-left transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 disabled:cursor-default sm:min-h-20 ${optionStyles[status]}`}
    >
      <span
        className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl border text-sm font-bold transition ${badgeStyles[status]}`}
      >
        {symbol}
      </span>
      <span className="flex-1 text-sm font-medium leading-snug sm:text-base">{option}</span>
    </button>
  );
}
