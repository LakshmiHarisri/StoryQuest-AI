# StoryQuest AI — Fun Adaptive Reading Adventure v8

StoryQuest is a mobile-first literacy game where children read an interactive story aloud, solve story clues, make decisions that change the next scene, and collect rewards.

## What's new in v8
- **Branch-specific Chapter 2 content:** each Chapter 1 choice now selects a different Chapter 2 scene, comprehension question, vocabulary word, second decision, and ending.
- **Branch-specific story worlds:** the animated scene changes in Chapter 2 based on the child's selected path (for example, moonlit staircase vs. secret map; map route vs. compass trail).
- **Chapter-aware Story Detective challenges:** the comprehension prompt and answer options change with the current chapter and chosen branch.
- **Chapter-aware Adventure Choices:** the second decision is different from the opening decision and is based on the current branch.
- **Branch state persists:** the selected Chapter 1 choice and current chapter are saved, so returning to an in-progress story restores the correct storyline.
- **Reading analysis uses the active chapter text:** coverage/progress and Gemini evaluation now compare the learner's reading to the actual branch-specific scene.
- Existing Gemini reading analysis, word power-ups, streak, XP, stars, badges, progress dashboard, and mobile-first UI remain.

## Run

Create `.env.local`:

```env
GEMINI_API_KEY=your_existing_key
GEMINI_MODEL=your_working_gemini_model
```

Install and run:

```bash
npm.cmd install --no-audit --no-fund
npm.cmd run dev
```

Open http://localhost:3000

## MVP story scope
StoryQuest currently ships with three curated starter worlds: The Lost Starship, The Hidden Forest, and The Midnight Castle. This is intentional for the hackathon MVP: each world demonstrates the same reusable adaptive reading engine, branch persistence, adaptive challenges, vocabulary reinforcement, and persistent progress. The architecture is designed to add more worlds and AI-generated adventures without changing the core learning loop.

## Dynamic story engine
After the learner makes a story choice, StoryQuest can generate the next chapter dynamically with Gemini. Chapters are stored in the learner's saved story state, so there is no hard-coded three-chapter limit. Each generated chapter receives the prior chapter, choice history, current branch consequence, and learner reading focus to keep the adventure continuous and adaptive.

## Dynamic visual story worlds
Generated chapters now include a `visualScene` object. StoryQuest maps that AI-selected scene into reusable animated visual treatments (portal, bridge, cave, water, night, space, forest, castle) so each chapter can have a different visual moment without hardcoding Chapter 2/3/4.

## v11 resume fix
When a learner completes a chapter and leaves before pressing Continue, the app now saves a pending resume point. Returning to a story generates/restores the next chapter from the exact saved choice instead of replaying Chapter 1. Older saved progress from previous versions is migrated automatically when a chapter-one choice has already been recorded.


## v15 visual polish
Stronger adventure-themed backdrop, ambient map/star details, and glassy layered surfaces for desktop and mobile.
