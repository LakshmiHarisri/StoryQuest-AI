import { NextResponse } from 'next/server';

const schema = {
  type: 'object',
  properties: {
    fluencyScore: { type: 'integer', minimum: 0, maximum: 100 },
    accuracyScore: { type: 'integer', minimum: 0, maximum: 100 },
    matchedWords: { type: 'integer', minimum: 0 },
    missedWords: { type: 'array', items: { type: 'string' } },
    difficultWords: { type: 'array', items: { type: 'string' } },
    strength: { type: 'string' },
    focus: { type: 'string' },
    feedback: { type: 'string' },
  },
  required: [
    'fluencyScore',
    'accuracyScore',
    'matchedWords',
    'missedWords',
    'difficultWords',
    'strength',
    'focus',
    'feedback',
  ],
};

function fallback(originalText: string, transcript: string, reason?: string) {
  const original: string[] =
  originalText.toLowerCase().match(/[a-z']+/g) ?? [];

const heard: string[] =
  transcript.toLowerCase().match(/[a-z']+/g) ?? [];

const heardSet = new Set<string>(heard);

const missed: string[] = Array.from(
  new Set<string>(
    original.filter((word: string) => !heardSet.has(word))
  )
).slice(0, 6);

const matchedCount = heard.filter(
  (word: string) => original.includes(word)
).length;

const accuracy =
  original.length > 0
    ? Math.round((matchedCount / original.length) * 100)
    : 0;

  return {
    fluencyScore: Math.max(55, Math.min(98, accuracy)),
    accuracyScore: Math.max(55, Math.min(98, accuracy)),
    matchedWords: Math.max(0, original.length - missed.length),
    missedWords: missed,
    difficultWords: missed.slice(0, 3),
    strength: accuracy >= 85 ? 'Accurate story reading' : 'Keeping up with the story',
    focus: missed.length ? 'Descriptive vocabulary' : 'Reading fluency',
    feedback: reason
      ? `Gemini analysis was unavailable, so we used a local reading comparison. (${reason})`
      : 'We used a local reading comparison because Gemini analysis was unavailable.',
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const originalText = String(body?.originalText ?? '').trim();
    const transcript = String(body?.transcript ?? '').trim();

    if (!originalText || !transcript) {
      return NextResponse.json({ error: 'originalText and transcript are required.' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is missing; using fallback analysis.');
      return NextResponse.json({ ...fallback(originalText, transcript, 'missing API key'), source: 'fallback' });
    }

    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

    const prompt = `
You are an expert elementary literacy coach.

Analyze how closely the learner's transcript matches the target passage.
Important constraints:
- Speech-to-text can omit, normalize, or slightly alter words, so do not invent pronunciation errors.
- Treat the transcript as evidence of words recognized/read, not a perfect phonics measurement.
- Keep feedback encouraging, age-appropriate, and specific.
- Identify a small number of useful words to revisit.
- The focus should describe the most useful next learning skill.
- Return only valid JSON matching the supplied schema.

TARGET PASSAGE:
${originalText}

LEARNER TRANSCRIPT:
${transcript}
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            responseSchema: schema,
            temperature: 0.2,
          },
        }),
      },
    );

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Gemini API error:', response.status, errorBody);
      return NextResponse.json({
        ...fallback(originalText, transcript, `Gemini returned ${response.status}`),
        source: 'fallback',
      });
    }

    const data = await response.json();
    const outputText = data?.candidates?.[0]?.content?.parts
      ?.map((part: { text?: string }) => part.text ?? '')
      .join('')
      .trim();

    if (!outputText) {
      console.error('Gemini response did not contain text:', JSON.stringify(data));
      return NextResponse.json({
        ...fallback(originalText, transcript, 'empty Gemini response'),
        source: 'fallback',
      });
    }

    const parsed = JSON.parse(outputText);
    return NextResponse.json({ ...parsed, source: 'gemini' });
  } catch (error) {
    console.error('Reading analysis failed:', error);
    return NextResponse.json({ error: 'Unable to analyze reading right now.' }, { status: 500 });
  }
}
