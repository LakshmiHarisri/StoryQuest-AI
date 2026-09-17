import { NextResponse } from 'next/server';

const chapterSchema = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    text: { type: 'string' },
    question: { type: 'string' },
    answer: { type: 'string' },
    comprehensionChoices: { type: 'array', items: { type: 'string' } },
    comprehensionCorrect: { type: 'integer', minimum: 0, maximum: 2 },
    choiceQuestion: { type: 'string' },
    choices: { type: 'array', items: {
      type: 'object', properties: { emoji: { type: 'string' }, title: { type: 'string' }, description: { type: 'string' } },
      required: ['emoji', 'title', 'description']
    } },
    branchOutcomes: { type: 'array', items: { type: 'string' } },
    vocabWord: { type: 'string' },
    vocabChoices: { type: 'array', items: { type: 'string' } },
    vocabCorrect: { type: 'integer', minimum: 0, maximum: 2 },
    visualScene: {
      type: 'object',
      properties: {
        sceneType: { type: 'string' },
        primaryEmoji: { type: 'string' },
        secondaryEmoji: { type: 'string' },
        particleEmoji: { type: 'string' },
        callout: { type: 'string' },
        motion: { type: 'string', enum: ['float','pulse','orbit','drift','breathe'] },
      },
      required: ['sceneType','primaryEmoji','secondaryEmoji','particleEmoji','callout','motion'],
    },
  },
  required: ['title','text','question','answer','comprehensionChoices','comprehensionCorrect','choiceQuestion','choices','branchOutcomes','vocabWord','vocabChoices','vocabCorrect','visualScene'],
};

function fallback(body: any) {
  const choice = body?.choice?.title || 'your chosen path';
  const focusWord = String(body?.difficultWords?.[0] || 'mysterious').replace(/[^a-zA-Z]/g, '') || 'mysterious';
  return {
    title: `The Next Clue from ${choice}`,
    text: `The adventure moved forward because you chose ${choice.toLowerCase()}. A new clue appeared nearby, and the world seemed to shift around the hero. The clue looked ${focusWord.toLowerCase()} at first, but it soon began to make sense. A new path waited ahead, and the next choice would decide where the story went next.`,
    question: 'What caused the adventure to move in this new direction?',
    answer: 'The learner’s previous choice changed what happened next.',
    comprehensionChoices: ['The learner’s previous choice.', 'A random weather change.', 'A character leaving the story.'],
    comprehensionCorrect: 0,
    choiceQuestion: 'What should the hero do next?',
    choices: [
      { emoji: '🔎', title: 'Follow the clue', description: 'Investigate the new clue carefully.' },
      { emoji: '🧭', title: 'Explore a new path', description: 'Take the unexpected route ahead.' },
      { emoji: '🛡️', title: 'Pause and prepare', description: 'Get ready before moving deeper into the adventure.' },
    ],
    branchOutcomes: [
      'The hero follows the clue and discovers a new secret.',
      'The hero explores the new path and finds an unexpected landmark.',
      'The hero pauses, prepares, and notices a hidden detail before continuing.',
    ],
    vocabWord: focusWord,
    vocabChoices: ['hard to understand or explain', 'very loud', 'very ordinary'],
    vocabCorrect: 0,
    visualScene: {
      sceneType: 'dynamic',
      primaryEmoji: body?.world === 'space' ? '🚀' : body?.world === 'forest' ? '🌲' : '🏰',
      secondaryEmoji: body?.world === 'space' ? '🪐' : body?.world === 'forest' ? '🧭' : '🔮',
      particleEmoji: '✨',
      callout: 'Your choice changes what appears next…',
      motion: 'float',
    },
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';
    if (!apiKey) return NextResponse.json(fallback(body), { headers: { 'X-StoryQuest-Source': 'fallback' } });

    const prompt = `You are the narrative director and elementary literacy designer for StoryQuest, an adaptive reading adventure.

Generate the NEXT chapter dynamically. There is NO fixed chapter limit: this same system must be able to create chapter 2, 3, 4, 5, and beyond for as long as the learner continues.

Rules:
- Preserve continuity with the story, all prior choices, and the learner’s chosen branch.
- The previous choice must materially affect the next scene and its consequences.
- Never reset to the opening scene and do not repeat prior chapter text or the same decision.
- Write 120-180 words at an age-appropriate level for children around 8-12.
- Make the scene vivid, playful, and easy to visualize; include a clear visual/motion cue.
- Create a chapter-specific comprehension question with exactly 3 answers and one correct index.
- Create a new decision with exactly 3 meaningfully different choices. Each should produce a distinct future direction.
- Give one branch outcome sentence for each choice.
- Include one useful vocabulary word from the chapter with exactly 3 meaning choices and one correct index.
- Reuse a learner’s difficult word naturally when useful, without becoming repetitive.
- Keep the story open-ended unless an explicit end condition is provided. This keeps infinite continuation possible.
- Create a chapter-specific visualScene object that describes what the child should SEE while reading. Do not reuse a generic opening scene. Choose a sceneType that matches the current chapter (examples: portal, bridge, cave, water, night, space, forest, castle). Pick a primaryEmoji, secondaryEmoji, and particleEmoji that directly match the current events. The callout should describe the visual moment the scene is building toward. Choose motion from float, pulse, orbit, drift, or breathe.
- The visualScene must be meaningfully different when the learner chooses a different branch.
- Return JSON only.

WORLD: ${body?.world}
STORY: ${body?.storyTitle} — ${body?.storyDescription}
CHAPTER NUMBER: ${body?.chapterNumber}
PREVIOUS CHAPTER: ${body?.previousChapter?.title}\n${body?.previousChapter?.text}
LEARNER CHOICE: ${body?.choice?.title} — ${body?.choice?.description}
BRANCH OUTCOME: ${body?.branchOutcome}
CHOICE HISTORY: ${(body?.choiceHistory || []).join(' -> ')}
LEARNER FOCUS: ${body?.learnerFocus || 'Reading fluency'}
DIFFICULT WORDS: ${(body?.difficultWords || []).join(', ')}
READING ACCURACY: ${body?.readingAccuracy || 0}
`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json', responseSchema: chapterSchema, temperature: 0.8 },
      }),
    });

    if (!response.ok) {
      console.error('Gemini chapter generation failed:', response.status, await response.text());
      return NextResponse.json(fallback(body), { headers: { 'X-StoryQuest-Source': 'fallback' } });
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text || '').join('').trim();
    if (!text) return NextResponse.json(fallback(body), { headers: { 'X-StoryQuest-Source': 'fallback' } });
    return NextResponse.json(JSON.parse(text), { headers: { 'X-StoryQuest-Source': 'gemini' } });
  } catch (error) {
    console.error('Dynamic chapter error:', error);
    return NextResponse.json(fallback({}), { headers: { 'X-StoryQuest-Source': 'fallback' } });
  }
}
