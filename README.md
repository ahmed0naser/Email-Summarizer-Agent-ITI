# Email Summarizer Agent

Simple TypeScript + OpenAI Agents SDK project with a plain HTML/CSS/JS chatbot UI.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from the example:

```bash
cp .env.example .env
```

3. Add your OpenAI API key in `.env`:

```env
OPENAI_API_KEY=sk-your-openai-api-key
PORT=3001
```

4. Run the app:

```bash
npm run dev
```

5. Open:

```text
http://localhost:3001
```

## What It Does

- Uses `@openai/agents` in TypeScript.
- Defines an `Email Summarizer` agent with the `gpt-4o-mini` model.
- Accepts pasted email text or uploaded `.txt`, `.eml`, or `.md` files.
- Returns a short subject, bullet summary, and action items.
