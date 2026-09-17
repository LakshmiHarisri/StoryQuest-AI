# StoryQuest AI

StoryQuest AI is an adaptive reading adventure for young learners.

Instead of treating reading practice as a worksheet, StoryQuest turns it into a branching story experience where the learner reads aloud, solves comprehension challenges, makes story decisions, and receives personalized practice based on how they read.

## Live Demo

https://story-quest-ai.vercel.app

## What it does

- **Read Aloud** — the learner reads the story passage aloud using the browser microphone.
- **AI Reading Analysis** — Gemini analyzes the transcript against the target passage and identifies reading strengths, missed words, and useful next practice.
- **Interactive Story World** — the visual scene responds to reading progress and the current story context.
- **Story Detective** — comprehension is integrated into the adventure instead of appearing as a separate worksheet.
- **Branching Choices** — the learner's decisions affect what happens next.
- **Dynamic Chapters** — the next chapter is generated from the story history, prior choices, learning needs, and vocabulary focus rather than following a fixed chapter tree.
- **Vocabulary Practice** — difficult or unfamiliar words can reappear as focused practice and word power-ups.
- **Listen / Stop** — learners can listen to a passage when they need support and stop narration without leaving the reading flow.
- **Progress and Rewards** — XP, stars, streaks, badges, quest progress, and learner history encourage continued practice.
- **Resume Anywhere** — each adventure saves its chapter, branch, and learning state so the learner can return later.
- **Responsive Experience** — designed for desktop and mobile browsers.

## The learning loop

```text
Read aloud
   ↓
AI reading analysis
   ↓
Comprehension challenge
   ↓
Story decision
   ↓
Adaptive next chapter
   ↓
Vocabulary reinforcement
   ↓
XP / stars / badges
   ↓
Saved progress
```

## Why the experience is adaptive

StoryQuest combines the story state and learning state.

The next chapter can take into account:

- previous story events
- choices the learner has made
- words that need practice
- reading accuracy signals
- current learning focus

This means the learner is not simply moving through a fixed sequence of pages. The adventure can continue naturally while the reading practice remains targeted.

## Starter story worlds

The demo includes three curated worlds:

- 🚀 **The Lost Starship**
- 🌲 **The Hidden Forest**
- 🏰 **The Midnight Castle**

These worlds demonstrate the reusable adaptive story engine. The underlying engine is designed to support additional worlds and generated adventures.

## Tech Stack

- Next.js
- React
- TypeScript
- Gemini API
- Browser Speech APIs
- CSS / responsive UI
- Browser-based persistence for learner progress

## Local setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a local `.env.local` file:

```env
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=your_working_gemini_model
```

Keep `.env.local` private. Do not commit it to GitHub.

### 3. Start the app

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

### 4. Production build

```bash
npm run build
```

## Deployment

The live demo is deployed on Vercel.

For a deployment, configure:

```text
GEMINI_API_KEY
GEMINI_MODEL
```

as server-side environment variables in the hosting platform.

## Security note

The Gemini API key must remain server-side. Do not expose it through a `NEXT_PUBLIC_` environment variable and do not commit `.env.local`.

## Project structure

```text
app/
  api/
    analyze-reading/
    generate-chapter/
  globals.css
  layout.tsx
  page.tsx

components/
  StoryQuest.tsx

lib/
  ...

public/
  cards/
  storyquest-adventure-bg.png
  ...
```

## Hackathon focus

StoryQuest is built around the English reading/literacy game challenge: making reading practice more engaging through interactive storytelling, comprehension, adaptive feedback, and game-like progression.
