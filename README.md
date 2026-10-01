# Quizer

A modern, dark-themed interactive quiz built with Next.js, TypeScript, and Tailwind CSS. Quiz content is loaded from a separate JSON file, so the interface can be reused with any quiz using the same format.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

For a production build:

```bash
npm run build
npm start
```

## Replace the quiz

All quiz content is stored in:

```text
data/quiz.json
```

Use this structure:

```json
{
  "title": "Your quiz title",
  "questions": [
    {
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0
    }
  ]
}
```

`correct` is the zero-based index of the correct option.

The app validates quiz data with `parseQuiz` in `lib/quiz.ts`. This function accepts unknown JSON, making it ready for a future AI API that generates the same JSON structure. The UI only consumes the validated `QuizData` type and does not know where the data originated.

## Deploy to Vercel

1. Push this repository to GitHub, GitLab, or Bitbucket.
2. Open [vercel.com](https://vercel.com) and choose **Add New Project**.
3. Import the repository and keep the default Next.js build settings.
4. Deploy the project.

No database, authentication, or environment variables are required.
