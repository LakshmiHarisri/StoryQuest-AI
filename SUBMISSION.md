# StoryQuest AI — Submission Notes

## What did you build?

StoryQuest AI is an adaptive reading adventure for young learners.

The learner chooses a story world, reads the story aloud, receives AI-powered reading feedback, solves a comprehension challenge, and makes decisions that shape the next part of the adventure.

The key idea is that the story and the learning experience evolve together.

## What makes it different?

StoryQuest combines:

- reading aloud
- AI reading analysis
- interactive storytelling
- comprehension
- vocabulary reinforcement
- branching decisions
- dynamic chapter generation
- rewards and learner progression

A learner's previous choices and learning signals become part of the context for the next chapter.

## AI usage

Gemini is used for:

- analyzing the learner's reading transcript against the target passage
- identifying useful words to revisit
- generating encouraging, age-appropriate feedback
- generating the next story chapter from the adventure history and learner context
- generating the next comprehension and vocabulary experience as part of the story flow

The app also has a local comparison fallback for reading analysis when AI analysis is temporarily unavailable.

## Demo flow

The recommended demo sequence is:

1. Choose a story world.
2. Read a passage aloud.
3. Show the animated story world and reading progress.
4. Complete the Story Detective challenge.
5. Make a story choice.
6. Continue to the next adaptive chapter.
7. Show vocabulary reinforcement and rewards.
8. Open My Progress.
9. Leave the adventure and return to demonstrate saved progress.

## Live demo

https://story-quest-ai.vercel.app

## Source code

https://github.com/LakshmiHarisri/StoryQuest-AI
