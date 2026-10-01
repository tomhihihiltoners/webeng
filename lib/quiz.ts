export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
}

export interface QuizData {
  title: string;
  questions: QuizQuestion[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function parseQuiz(input: unknown): QuizData {
  if (!isRecord(input)) {
    throw new Error("Quiz data must be a JSON object.");
  }

  const { title, questions } = input;

  if (typeof title !== "string" || title.trim().length === 0) {
    throw new Error("Quiz title must be a non-empty string.");
  }

  if (!Array.isArray(questions) || questions.length === 0) {
    throw new Error("Quiz questions must be a non-empty array.");
  }

  const parsedQuestions: QuizQuestion[] = questions.map((rawQuestion, index) => {
    if (!isRecord(rawQuestion)) {
      throw new Error(`Question ${index + 1} must be an object.`);
    }

    const { question, options, correct } = rawQuestion;

    if (typeof question !== "string" || question.trim().length === 0) {
      throw new Error(`Question ${index + 1} must have a non-empty question.`);
    }

    if (
      !Array.isArray(options) ||
      options.length < 2 ||
      options.some((option) => typeof option !== "string" || option.trim().length === 0)
    ) {
      throw new Error(`Question ${index + 1} must have at least two non-empty options.`);
    }

    if (
      typeof correct !== "number" ||
      !Number.isInteger(correct) ||
      correct < 0 ||
      correct >= options.length
    ) {
      throw new Error(
        `Question ${index + 1} must have a correct index between 0 and ${options.length - 1}.`,
      );
    }

    return {
      question,
      options: options as string[],
      correct,
    };
  });

  return {
    title,
    questions: parsedQuestions,
  };
}
