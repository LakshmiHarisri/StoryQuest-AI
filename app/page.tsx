'use client';

import { useMemo, useState } from 'react';
import { StoryQuest } from '../components/StoryQuest';

export default function Home() {
  const [started, setStarted] = useState(false);

  const intro = useMemo(() => ({
    title: 'StoryQuest AI',
    tagline: 'Your story adapts to how you read.',
  }), []);

  if (started) return <StoryQuest />;

  return (
    <main className="shell landing-shell">
      <section className="hero-card">
        <div className="eyebrow">AI READING ADVENTURE</div>
        <h1>{intro.title}</h1>
        <p className="tagline">{intro.tagline}</p>
        <p className="body-copy">
          Read an interactive story aloud, answer quick comprehension challenges, and watch the next part adapt to your learning needs.
        </p>
        <button className="primary-button" onClick={() => setStarted(true)}>
          Start your adventure
        </button>
        <div className="trust-row">
          <span>📖 Reading fluency</span>
          <span>🧠 Comprehension</span>
          <span>✨ Vocabulary</span>
        </div>
      </section>
    </main>
  );
}
