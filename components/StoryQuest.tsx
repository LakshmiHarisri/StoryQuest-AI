'use client';

import { useEffect, useMemo, useState } from 'react';

type Stage = 'choose' | 'read' | 'comprehension' | 'choice' | 'vocabulary' | 'summary' | 'progress';

type StoryProfile = {
  fluency: number;
  comprehension: number;
  vocabulary: number;
  focus: string;
};

type VisualScene = {
  sceneType: string;
  primaryEmoji: string;
  secondaryEmoji: string;
  particleEmoji: string;
  callout: string;
  motion: 'float' | 'pulse' | 'orbit' | 'drift' | 'breathe';
};

type ChapterContent = {
  title: string;
  text: string;
  question: string;
  answer: string;
  comprehensionChoices: string[];
  comprehensionCorrect: number;
  choiceQuestion: string;
  choices: StoryChoice[];
  branchOutcomes: string[];
  vocabWord: string;
  vocabChoices: string[];
  vocabCorrect: number;
  visualScene?: VisualScene;
};

type StoryChoice = {
  emoji: string;
  title: string;
  description: string;
};

type Story = {
  id: string;
  emoji: string;
  title: string;
  description: string;
  color: string;
  sections: string[];
  question: string;
  answer: string;
  comprehensionChoices: string[];
  comprehensionCorrect: number;
  choiceQuestion: string;
  choices: StoryChoice[];
  branchOutcomes: string[];
  vocabWord: string;
  vocabChoices: string[];
  vocabCorrect: number;
  chapter2: ChapterContent[];
};

type RewardState = {
  xp: number;
  stars: number;
  streak: number;
  lastCompletedDate: string;
  storiesCompleted: number;
  wordsLearned: string[];
  badges: string[];
};

const emptyRewards: RewardState = {
  xp: 0,
  stars: 0,
  streak: 0,
  lastCompletedDate: '',
  storiesCompleted: 0,
  wordsLearned: [],
  badges: [],
};

const badgeCatalog = [
  { id: 'brave-reader', emoji: '🧭', name: 'Brave Reader', description: 'Finish your first reading quest.' },
  { id: 'story-detective', emoji: '🕵️', name: 'Story Detective', description: 'Solve a story clue.' },
  { id: 'word-wizard', emoji: '🪄', name: 'Word Wizard', description: 'Learn your first magic word.' },
  { id: 'streak-3', emoji: '🔥', name: '3-Day Reader', description: 'Build a 3-day learning streak.' },
  { id: 'streak-7', emoji: '🌟', name: '7-Day Reader', description: 'Build a 7-day learning streak.' },
  { id: 'adventure-master', emoji: '🏆', name: 'Adventure Master', description: 'Complete 3 adventures.' },
];

const stories: Story[] = [
  {
    id: 'space',
    emoji: '🚀',
    title: 'The Lost Starship',
    description: 'Maya discovers an abandoned ship and has one chance to bring it home.',
    color: 'violet',
    sections: [
      `Maya stepped through the silver doorway and found a tiny control room glowing in the dark. A strange blue map floated above the console. It showed a starship drifting beyond the moon.`,
      `She pressed the map and a quiet message appeared: “The Starling needs a guide.” Maya looked at the empty pilot seat. She had never flown a starship before, but the ship was waiting for someone to try.`,
    ],
    question: 'Why did Maya decide to help the Starling?',
    answer: 'Because the ship needed a guide and she decided to try.',
    comprehensionChoices: [
      'The ship needed a guide.',
      'She wanted to build a new robot.',
      'She was looking for a moon rock.',
    ],
    comprehensionCorrect: 0,
    choiceQuestion: 'A warning flashes on the console. Which control should Maya try first?',
    choices: [
      { emoji: '🗺️', title: 'Open the blue map', description: 'Follow the safest route to the Starling.' },
      { emoji: '⚡', title: 'Touch the lightning symbol', description: 'See if it powers up the ship.' },
    ],
    branchOutcomes: [
      'Maya opens the blue map. A glowing route curls around the moon and points toward the Starling.',
      'Maya touches the lightning symbol. The console sparks gently and reveals a hidden emergency route.',
    ],
    vocabWord: 'drifting',
    vocabChoices: ['moving slowly without control', 'shining very brightly', 'making a loud sound'],
    vocabCorrect: 0,
    chapter2: [
      {
        title: 'The Route Around the Moon…',
        text: 'Maya opens the blue map. A glowing route curls around the moon and points toward the Starling. The map warns her about a field of glittering space dust ahead.',
        question: 'What does the blue map warn Maya about?',
        answer: 'It warns Maya about glittering space dust.',
        comprehensionChoices: ['Glittering space dust ahead.', 'A storm inside the starship.', 'A robot hiding on the moon.'],
        comprehensionCorrect: 0,
        choiceQuestion: 'The Starling reaches the space-dust field. Which move should Maya make?',
        choices: [
          { emoji: '🛡️', title: 'Raise the shield', description: 'Protect the ship and glide through safely.' },
          { emoji: '🌙', title: 'Follow the moonlight', description: 'Steer toward a bright opening between the clouds of dust.' },
        ],
        branchOutcomes: [
          'Maya raises the shield. The dust splashes harmlessly across the shimmering barrier and the Starling slips through.',
          'Maya follows the moonlight. A silver opening appears and leads the Starling to a safe landing path.',
        ],
        vocabWord: 'glittering',
        vocabChoices: ['shining with many tiny flashes', 'moving very slowly', 'making a quiet sound'],
        vocabCorrect: 0,
      },
      {
        title: 'The Emergency Route…',
        text: 'Maya touches the lightning symbol. The console sparks gently and reveals a hidden emergency route. A row of warning lights begins to blink as the Starling prepares to move.',
        question: 'What does the lightning symbol reveal?',
        answer: 'It reveals a hidden emergency route.',
        comprehensionChoices: ['A hidden emergency route.', 'A map to the moon rocks.', 'A message from Maya’s school.'],
        comprehensionCorrect: 0,
        choiceQuestion: 'Warning lights blink. What should Maya do?',
        choices: [
          { emoji: '🟢', title: 'Follow the green lights', description: 'Trust the route marked safe by the ship.' },
          { emoji: '🔴', title: 'Stop the engines', description: 'Pause and scan the warning before moving.' },
        ],
        branchOutcomes: [
          'Maya follows the green lights. The route opens into a calm tunnel of stars.',
          'Maya stops the engines. The warning screen reveals a hidden message and a safer path forward.',
        ],
        vocabWord: 'emergency',
        vocabChoices: ['a sudden dangerous situation needing quick action', 'a type of spaceship', 'a glowing map'],
        vocabCorrect: 0,
      },
    ],
  },
  {
    id: 'forest',
    emoji: '🌲',
    title: 'The Hidden Forest',
    description: 'Leo follows a trail of glowing leaves deep into a forest that keeps changing.',
    color: 'green',
    sections: [
      `Leo followed the glowing leaves until the familiar path disappeared behind him. The trees seemed to whisper whenever the wind moved through their branches. Ahead, a small wooden door stood between two ancient oaks.`,
      `He opened the door and found a room filled with maps. One map showed the forest as it looked today. Another showed a completely different forest from a hundred years ago.`,
    ],
    question: 'What made the forest feel unusual?',
    answer: 'The path disappeared and the trees seemed to whisper.',
    comprehensionChoices: [
      'The trees whispered and the path disappeared.',
      'The forest was full of noisy cars.',
      'A storm had destroyed every tree.',
    ],
    comprehensionCorrect: 0,
    choiceQuestion: 'The hidden door glows. What should Leo do?',
    choices: [
      { emoji: '🚪', title: 'Open the wooden door', description: 'Step inside and discover what the maps are hiding.' },
      { emoji: '🍃', title: 'Follow the glowing leaves', description: 'Search for another clue before entering.' },
    ],
    branchOutcomes: [
      'Leo opens the wooden door. A wall of glowing maps lights up and shows a path that does not exist on any modern map.',
      'Leo follows the glowing leaves. They spiral around an ancient oak and reveal a tiny compass buried under the roots.',
    ],
    vocabWord: 'ancient',
    vocabChoices: ['very old', 'very noisy', 'very small'],
    vocabCorrect: 0,
    chapter2: [
      {
        title: 'The Map That Should Not Exist…',
        text: 'Leo opens the wooden door. A wall of glowing maps lights up and shows a path that does not exist on any modern map. The newest map begins to redraw itself as Leo watches.',
        question: 'What is strange about the glowing maps?',
        answer: 'They show a path that does not exist on any modern map.',
        comprehensionChoices: ['They show a path missing from modern maps.', 'They show a busy city road.', 'They disappear every morning.'],
        comprehensionCorrect: 0,
        choiceQuestion: 'The map draws two possible paths. Which way should Leo go?',
        choices: [
          { emoji: '🗺️', title: 'Take the moon path', description: 'Follow the path that glows under the moon symbol.' },
          { emoji: '🌿', title: 'Take the root path', description: 'Follow the path that winds beneath the ancient trees.' },
        ],
        branchOutcomes: [
          'Leo takes the moon path. The map folds into a tiny compass pointing toward a hidden clearing.',
          'Leo takes the root path. The roots glow softly and uncover a forgotten wooden bridge.',
        ],
        vocabWord: 'modern',
        vocabChoices: ['belonging to the present time', 'covered in leaves', 'older than everything else'],
        vocabCorrect: 0,
      },
      {
        title: 'The Compass Under the Roots…',
        text: 'Leo follows the glowing leaves. They spiral around an ancient oak and reveal a tiny compass buried under the roots. The compass needle spins toward a secret trail.',
        question: 'What does Leo discover under the roots?',
        answer: 'A tiny compass.',
        comprehensionChoices: ['A tiny compass.', 'A golden key.', 'A sleeping animal.'],
        comprehensionCorrect: 0,
        choiceQuestion: 'The compass points in two directions. Which clue should Leo follow?',
        choices: [
          { emoji: '🌙', title: 'Follow the moon mark', description: 'Take the trail with the silver moon symbols.' },
          { emoji: '🌱', title: 'Follow the green sprouts', description: 'Take the trail where tiny plants are growing.' },
        ],
        branchOutcomes: [
          'Leo follows the moon mark. The trail opens beside a quiet lake with a mirror-like surface.',
          'Leo follows the green sprouts. The trail ends at a tiny garden hidden inside the roots.',
        ],
        vocabWord: 'compass',
        vocabChoices: ['a tool that helps show direction', 'a type of tree', 'a secret door'],
        vocabCorrect: 0,
      },
    ],
  },
  {
    id: 'castle',
    emoji: '🏰',
    title: 'The Midnight Castle',
    description: 'Nora enters a castle where every room reveals part of a forgotten mystery.',
    color: 'amber',
    sections: [
      `At midnight, Nora pushed open the castle gate. The hallway was quiet except for a clock ticking somewhere above her. A trail of silver footprints led toward a room she had never seen before.`,
      `Inside the room, she found a dusty book with a bright red ribbon. The first page described a secret passage under the castle, but the rest of the instructions had been torn away.`,
    ],
    question: 'What clue did Nora find inside the castle?',
    answer: 'She found a dusty book describing a secret passage.',
    comprehensionChoices: [
      'A dusty book about a secret passage.',
      'A golden crown on the floor.',
      'A dragon hiding in the hallway.',
    ],
    comprehensionCorrect: 0,
    choiceQuestion: 'The silver footprints stop at two doors. Which one should Nora open?',
    choices: [
      { emoji: '🚪', title: 'The Whispering Door', description: 'A soft voice seems to be calling from behind it.' },
      { emoji: '🔑', title: 'The Glowing Door', description: 'A golden key-shaped light shines around its handle.' },
    ],
    branchOutcomes: [
      'Nora chooses the Whispering Door. It creaks open and reveals a moonlit staircase leading beneath the castle.',
      'Nora chooses the Glowing Door. The golden handle warms in her hand and reveals a secret map beneath the frame.',
    ],
    vocabWord: 'passage',
    vocabChoices: ['a path or corridor through something', 'a kind of clock', 'a piece of clothing'],
    vocabCorrect: 0,
    chapter2: [
      {
        title: 'The Moonlit Staircase…',
        text: 'Nora chooses the Whispering Door. It creaks open and reveals a moonlit staircase leading beneath the castle. At the bottom, she sees three glowing symbols carved into the stone.',
        question: 'Where does the Whispering Door lead?',
        answer: 'It leads to a moonlit staircase beneath the castle.',
        comprehensionChoices: ['To a staircase beneath the castle.', 'To the castle garden.', 'To the roof of the castle.'],
        comprehensionCorrect: 0,
        choiceQuestion: 'Three symbols glow on the wall. Which one should Nora touch?',
        choices: [
          { emoji: '🌙', title: 'The moon', description: 'Choose the symbol that matches the light above.' },
          { emoji: '⭐', title: 'The star', description: 'Choose the symbol that sparkles the brightest.' },
        ],
        branchOutcomes: [
          'Nora touches the moon. A hidden lift rises from the floor and carries her toward the castle library.',
          'Nora touches the star. A secret window opens and reveals the castle garden at night.',
        ],
        vocabWord: 'staircase',
        vocabChoices: ['a set of steps leading between floors', 'a type of window', 'a glowing map'],
        vocabCorrect: 0,
      },
      {
        title: 'The Secret Map…',
        text: 'Nora chooses the Glowing Door. The golden handle warms in her hand and reveals a secret map beneath the frame. The map shows a hidden room marked with a silver crown.',
        question: 'What does the Glowing Door reveal?',
        answer: 'It reveals a secret map with a hidden room.',
        comprehensionChoices: ['A secret map and hidden room.', 'A treasure chest of gold.', 'A dragon in the castle yard.'],
        comprehensionCorrect: 0,
        choiceQuestion: 'The map points to two clues. Which should Nora follow?',
        choices: [
          { emoji: '👑', title: 'Follow the crown', description: 'Search for the hidden room marked by the silver crown.' },
          { emoji: '🕯️', title: 'Follow the candle', description: 'Follow the candle symbols into the old library wing.' },
        ],
        branchOutcomes: [
          'Nora follows the crown. A stone panel slides aside and reveals the hidden room.',
          'Nora follows the candle. A row of tiny lights leads her into the oldest library in the castle.',
        ],
        vocabWord: 'marked',
        vocabChoices: ['shown or identified with a sign', 'made of gold', 'hidden under water'],
        vocabCorrect: 0,
      },
    ],
  },
];

function visualForStory(storyId: string): VisualScene {
  if (storyId === 'space') return { sceneType: 'space', primaryEmoji: '🚀', secondaryEmoji: '🪐', particleEmoji: '✨', callout: 'The star map comes alive…', motion: 'float' };
  if (storyId === 'forest') return { sceneType: 'forest', primaryEmoji: '🌲', secondaryEmoji: '🧭', particleEmoji: '🍃', callout: 'The forest reveals a clue…', motion: 'drift' };
  return { sceneType: 'castle', primaryEmoji: '🏰', secondaryEmoji: '🚪', particleEmoji: '✨', callout: 'The castle mystery awakens…', motion: 'breathe' };
}

function initialChapterFor(story: Story): ChapterContent {
  return {
    title: 'A mysterious clue appears…',
    text: story.sections[0],
    question: story.question,
    answer: story.answer,
    comprehensionChoices: story.comprehensionChoices,
    comprehensionCorrect: story.comprehensionCorrect,
    choiceQuestion: story.choiceQuestion,
    choices: story.choices,
    branchOutcomes: story.branchOutcomes,
    vocabWord: story.vocabWord,
    vocabChoices: story.vocabChoices,
    vocabCorrect: story.vocabCorrect,
    visualScene: visualForStory(story.id),
  };
}

function visualFromText(text: string, world: string): VisualScene {
  const lower = text.toLowerCase();
  if (lower.includes('ocean') || lower.includes('river') || lower.includes('water')) return { sceneType: 'water', primaryEmoji: '🌊', secondaryEmoji: '🛶', particleEmoji: '💧', callout: 'The water shifts with your story…', motion: 'drift' };
  if (lower.includes('bridge')) return { sceneType: 'bridge', primaryEmoji: '🌉', secondaryEmoji: '🪵', particleEmoji: '✨', callout: 'A hidden crossing appears…', motion: 'breathe' };
  if (lower.includes('cave') || lower.includes('cavern')) return { sceneType: 'cave', primaryEmoji: '🪨', secondaryEmoji: '🔦', particleEmoji: '💫', callout: 'A secret cave opens ahead…', motion: 'pulse' };
  if (lower.includes('door') || lower.includes('portal')) return { sceneType: 'portal', primaryEmoji: '🚪', secondaryEmoji: '🔮', particleEmoji: '✨', callout: 'A new portal responds to your choice…', motion: 'pulse' };
  if (lower.includes('moon') || lower.includes('night') || lower.includes('star')) return { sceneType: 'night', primaryEmoji: '🌙', secondaryEmoji: '⭐', particleEmoji: '✨', callout: 'The night path lights up…', motion: 'orbit' };
  if (world === 'forest') return { sceneType: 'forest', primaryEmoji: '🌲', secondaryEmoji: '🧭', particleEmoji: '🍃', callout: 'The forest reveals a clue…', motion: 'drift' };
  if (world === 'space') return { sceneType: 'space', primaryEmoji: '🚀', secondaryEmoji: '🪐', particleEmoji: '✨', callout: 'The star map comes alive…', motion: 'float' };
  return { sceneType: 'castle', primaryEmoji: '🏰', secondaryEmoji: '🚪', particleEmoji: '✨', callout: 'The castle mystery awakens…', motion: 'breathe' };
}

const achievementFor = (score: number) => {
  if (score >= 90) return { emoji: '🏆', title: 'Reading Champion', text: 'You earned a champion badge!' };
  if (score >= 75) return { emoji: '🌟', title: 'Story Explorer', text: 'You earned a story explorer badge!' };
  return { emoji: '🧭', title: 'Brave Reader', text: 'You kept going and unlocked a brave reader badge!' };
};

function dayKey() {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string) {
  if (!a || !b) return Infinity;
  const start = new Date(`${a}T00:00:00`).getTime();
  const end = new Date(`${b}T00:00:00`).getTime();
  return Math.round(Math.abs(end - start) / 86400000);
}

export function StoryQuest() {
  const [stage, setStage] = useState<Stage>('choose');
  const [storyId, setStoryId] = useState('space');
  const [sectionIndex, setSectionIndex] = useState(0);
  const [profile, setProfile] = useState<StoryProfile>({ fluency: 0, comprehension: 0, vocabulary: 0, focus: 'Not measured yet' });
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedComprehension, setSelectedComprehension] = useState<number | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [selectedVocab, setSelectedVocab] = useState<number | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisMessage, setAnalysisMessage] = useState('');
  const [readingAnalysis, setReadingAnalysis] = useState<{
    fluencyScore: number;
    accuracyScore: number;
    matchedWords: number;
    missedWords: string[];
    difficultWords: string[];
    strength: string;
    focus: string;
    feedback: string;
    source?: string;
  } | null>(null);
  const [rewards, setRewards] = useState<RewardState>(emptyRewards);
  type StoryProgressRecord = {
    sectionIndex: number;
    resumeSectionIndex: number;
    branchReveal: string;
    branchIndex: number;
    completed: boolean;
    chapters: Record<number, ChapterContent>;
    choices: string[];
    pendingChoice?: StoryChoice | null;
    pendingBranchOutcome?: string;
  };
  const [storyProgress, setStoryProgress] = useState<Record<string, StoryProgressRecord>>({});
  const [branchIndex, setBranchIndex] = useState(0);
  const [lastQuestReward, setLastQuestReward] = useState('');
  const [readingPower, setReadingPower] = useState(0);
  const [branchReveal, setBranchReveal] = useState('');
  const [sceneBeat, setSceneBeat] = useState(0);

  const story = useMemo(() => stories.find((item) => item.id === storyId) ?? stories[0], [storyId]);
  const currentStoryProgress = storyProgress[story.id];
  const initialChapter = useMemo(() => initialChapterFor(story), [story]);
  const currentChapter = useMemo(() => {
    if (sectionIndex === 0) return initialChapter;
    return storyProgress[story.id]?.chapters?.[sectionIndex] ?? initialChapter;
  }, [initialChapter, story.id, storyProgress, sectionIndex]);
  const hasResume = Boolean(currentStoryProgress && !currentStoryProgress.completed);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('storyquest_rewards');
      if (saved) setRewards(JSON.parse(saved));
      const savedProgress = localStorage.getItem('storyquest_story_progress');
      if (savedProgress) setStoryProgress(JSON.parse(savedProgress));
    } catch {
      // Keep fresh local state if storage is unavailable.
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('storyquest_rewards', JSON.stringify(rewards));
      localStorage.setItem('storyquest_story_progress', JSON.stringify(storyProgress));
    } catch {
      // Ignore storage errors in private browsing / restricted environments.
    }
  }, [rewards, storyProgress]);

  useEffect(() => {
    if (stage === 'summary') {
      finishQuestTracking();
    }
    // finishQuestTracking intentionally runs when a quest reaches the summary screen.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  function awardBadge(id: string) {
    setRewards((current) => current.badges.includes(id) ? current : ({ ...current, badges: [...current.badges, id] }));
  }

  function addRewards({ xp = 0, stars = 0, word }: { xp?: number; stars?: number; word?: string }) {
    setRewards((current) => {
      const today = dayKey();
      let nextStreak = current.streak;
      if (current.lastCompletedDate !== today) {
        const gap = daysBetween(current.lastCompletedDate, today);
        nextStreak = gap === 1 ? current.streak + 1 : 1;
      }

      const nextStories = current.storiesCompleted;
      const nextWords = word && !current.wordsLearned.includes(word) ? [...current.wordsLearned, word] : current.wordsLearned;
      const nextBadges = [...current.badges];
      const addBadge = (id: string) => { if (!nextBadges.includes(id)) nextBadges.push(id); };
      if (nextStreak >= 3) addBadge('streak-3');
      if (nextStreak >= 7) addBadge('streak-7');
      if (word) addBadge('word-wizard');
      if (current.storiesCompleted >= 1) addBadge('brave-reader');

      return {
        ...current,
        xp: current.xp + xp,
        stars: current.stars + stars,
        streak: nextStreak,
        lastCompletedDate: today,
        wordsLearned: nextWords,
        badges: nextBadges,
      };
    });
  }

  function speak(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsSpeaking(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }

  function toggleListen() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setAnalysisMessage('🔊 Audio playback is not available in this browser.');
      return;
    }

    if (window.speechSynthesis.speaking || isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setAnalysisMessage('⏹️ Story audio paused. Tap Listen to play it again.');
      return;
    }

    speak(currentChapter.text);
    setAnalysisMessage('🔊 Playing the chapter aloud. Tap Stop anytime.');
  }

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  function listen() {
    const SpeechRecognition = (window as typeof window & { webkitSpeechRecognition?: any; SpeechRecognition?: any }).SpeechRecognition
      ?? (window as typeof window & { webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setTranscript('Speech recognition is not available in this browser. You can continue with the demo using the button below.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;
    setIsListening(true);
    setTranscript('');
    setReadingPower(0);
    setSceneBeat(0);
    recognition.start();

    recognition.onresult = (event: any) => {
      let combined = '';
      for (let i = 0; i < event.results.length; i += 1) {
        combined += `${event.results[i][0]?.transcript ?? ''} `;
      }
      const nextTranscript = combined.trim();
      setTranscript(nextTranscript);
      const targetWords = currentChapter.text.trim().split(/\s+/).length;
      const heardWords = nextTranscript ? nextTranscript.split(/\s+/).length : 0;
      const progress = Math.min(100, Math.round((heardWords / targetWords) * 100));
      setReadingPower(progress);
      setSceneBeat(progress >= 85 ? 3 : progress >= 50 ? 2 : progress >= 20 ? 1 : 0);
      if (event.results?.[event.results.length - 1]?.isFinal) setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
  }

  async function generateChapterFromSavedProgress(saved: StoryProgressRecord, nextIndex: number) {
    const previousIndex = Math.max(0, nextIndex - 1);
    const previousChapter = previousIndex === 0
      ? initialChapter
      : saved.chapters?.[previousIndex];
    if (!previousChapter) throw new Error('Previous chapter not found for resume.');

    const lastChoice = saved.pendingChoice ?? null;
    const lastBranchOutcome = saved.pendingBranchOutcome ?? saved.branchReveal ?? '';
    const response = await fetch('/api/generate-chapter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        storyTitle: story.title,
        storyDescription: story.description,
        world: story.id,
        chapterNumber: nextIndex + 1,
        previousChapter: { title: previousChapter.title, text: previousChapter.text },
        choice: lastChoice,
        branchOutcome: lastBranchOutcome,
        choiceHistory: saved.choices ?? [],
        learnerFocus: profile.focus,
        difficultWords: [],
        readingAccuracy: profile.fluency,
      }),
    });
    if (!response.ok) throw new Error('Chapter generation failed');
    const nextChapter = await response.json();
    if (!nextChapter?.title || !nextChapter?.text || !Array.isArray(nextChapter?.choices)) throw new Error('Invalid generated chapter');
    nextChapter.visualScene = nextChapter.visualScene ?? visualFromText(nextChapter.text, story.id);
    return nextChapter as ChapterContent;
  }

  async function startStory() {
    const saved = storyProgress[story.id];
    const resume = Boolean(saved && !saved.completed);
    // Migrate older saved progress: before v11, finishing Chapter 1 stored
    // sectionIndex=0 even after the child had already made a choice. In that
    // case, the correct resume point is the next chapter.
    const legacyPendingNextChapter = Boolean(
      saved &&
      !saved.completed &&
      saved.resumeSectionIndex === undefined &&
      saved.sectionIndex === 0 &&
      Array.isArray(saved.choices) &&
      saved.choices.length > 0,
    );
    const nextSection = resume
      ? (saved!.resumeSectionIndex ?? (legacyPendingNextChapter ? saved!.sectionIndex + 1 : saved!.sectionIndex))
      : 0;
    const inferredBranch = resume ? (saved!.branchIndex ?? 0) : 0;
    const nextBranch = resume ? (saved!.branchReveal ?? '') : '';

    setIsAnalyzing(true);
    setAnalysisMessage(resume && nextSection > (saved?.sectionIndex ?? 0) ? '🪄 Restoring your next chapter…' : '');

    try {
      let nextChapter: ChapterContent;
      let chapters = saved?.chapters ?? {};
      let progressRecord: StoryProgressRecord = saved ?? {
        sectionIndex: 0,
        resumeSectionIndex: 0,
        branchReveal: '',
        branchIndex: 0,
        completed: false,
        chapters: {},
        choices: [],
      };

      if (!resume) {
        nextChapter = initialChapter;
      } else if (chapters[nextSection]) {
        nextChapter = chapters[nextSection];
      } else if (nextSection > (saved?.sectionIndex ?? 0)) {
        nextChapter = await generateChapterFromSavedProgress(saved!, nextSection);
        chapters = { ...chapters, [nextSection]: nextChapter };
        progressRecord = { ...progressRecord, chapters };
      } else {
        nextChapter = initialChapter;
      }

      setSectionIndex(nextSection);
      setBranchIndex(inferredBranch);
      setTranscript('');
      setSelectedComprehension(null);
      setSelectedChoice(null);
      setSelectedVocab(null);
      setReadingAnalysis(null);
      setLastQuestReward('');
      setReadingPower(0);
      setSceneBeat(0);
      setBranchReveal(nextBranch);
      setStage('read');
      setStoryProgress((current) => ({
        ...current,
        [story.id]: {
          ...progressRecord,
          sectionIndex: nextSection,
          resumeSectionIndex: nextSection,
          completed: false,
          chapters,
          // Once the chapter is restored/generated, the pending choice has been consumed.
          pendingChoice: nextSection > (saved?.sectionIndex ?? 0) ? null : progressRecord.pendingChoice ?? null,
          pendingBranchOutcome: nextSection > (saved?.sectionIndex ?? 0) ? undefined : progressRecord.pendingBranchOutcome,
        },
      }));
    } catch (error) {
      console.error(error);
      setAnalysisMessage('✨ We could not restore the next chapter right now. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  }

  async function finishReading() {
    if (!transcript.trim()) {
      setAnalysisMessage('🎙️ Read the passage first to unlock your reading power-up.');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisMessage('🪄 StoryQuest is studying your reading…');

    try {
      const response = await fetch('/api/analyze-reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalText: currentChapter.text,
          transcript,
        }),
      });

      if (!response.ok) throw new Error('Analysis request failed');
      const analysis = await response.json();
      if (analysis.error) throw new Error(analysis.error);

      setReadingAnalysis(analysis);
      setProfile((p) => ({
        ...p,
        fluency: analysis.fluencyScore,
        focus: analysis.focus || 'Reading fluency',
      }));
      addRewards({ xp: 20, stars: 1 });
      setLastQuestReward('⭐ +1 Reading Star  ·  +20 XP');
      setAnalysisMessage(
        analysis.source === 'gemini'
          ? '✨ Gemini found clues about your reading.'
          : '✨ Your backup reading coach found a few clues.'
      );
      awardBadge('brave-reader');
      setStage('comprehension');
    } catch (error) {
      console.error(error);
      setAnalysisMessage('The reading coach is taking a break. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  }

  function finishComprehension() {
    const selected = selectedComprehension ?? -1;
    const comprehension = selected === currentChapter.comprehensionCorrect ? 95 : 65;
    setProfile((p) => ({ ...p, comprehension }));
    if (selected === currentChapter.comprehensionCorrect) {
      addRewards({ xp: 25, stars: 1 });
      awardBadge('story-detective');
      setLastQuestReward('⭐ +1 Detective Star  ·  +25 XP');
    } else {
      setLastQuestReward('💡 Clue unlocked — now choose your next move!');
    }
    setSelectedChoice(null);
    setStage('choice');
  }

  function finishChoice() {
    if (selectedChoice === null) return;
    const reveal = currentChapter.branchOutcomes[selectedChoice] ?? `Your choice changes what happens next.`;
    const nextBranchIndex = selectedChoice;
    setBranchReveal(reveal);
    setBranchIndex(nextBranchIndex);
    setStoryProgress((current) => {
      const saved = current[story.id];
      return {
        ...current,
        [story.id]: {
          sectionIndex,
          branchReveal: reveal,
          branchIndex: nextBranchIndex,
          resumeSectionIndex: saved?.resumeSectionIndex ?? sectionIndex,
          completed: false,
          chapters: saved?.chapters ?? {},
          choices: [...(saved?.choices ?? []), currentChapter.choices[selectedChoice]?.title ?? `Choice ${selectedChoice + 1}`],
          pendingChoice: currentChapter.choices[selectedChoice] ?? null,
          pendingBranchOutcome: reveal,
        },
      };
    });
    addRewards({ xp: 15, stars: 1 });
    setLastQuestReward('⭐ +1 Adventure Star  ·  +15 XP');
    setStage('vocabulary');
  }

  function finishVocabulary() {
    const vocabulary = selectedVocab === currentChapter.vocabCorrect ? 94 : 62;
    setProfile((p) => ({ ...p, vocabulary }));
    if (selectedVocab === currentChapter.vocabCorrect) {
      addRewards({ xp: 30, stars: 1, word: currentChapter.vocabWord });
      setLastQuestReward('⭐ +1 Word Star  ·  +30 XP');
    } else {
      addRewards({ word: currentChapter.vocabWord });
      setLastQuestReward(`🔎 Keep an eye out for “${currentChapter.vocabWord}” in the next scene.`);
    }
    setStoryProgress((current) => {
      const saved = current[story.id];
      return {
        ...current,
        [story.id]: {
          ...(saved ?? { sectionIndex, resumeSectionIndex: sectionIndex, branchReveal, branchIndex, completed: false, chapters: {}, choices: [] }),
          sectionIndex,
          resumeSectionIndex: sectionIndex + 1,
          branchReveal,
          branchIndex,
          completed: false,
          pendingChoice: selectedChoice !== null ? currentChapter.choices[selectedChoice] : saved?.pendingChoice ?? null,
          pendingBranchOutcome: branchReveal || saved?.pendingBranchOutcome || '',
        },
      };
    });
    setStage('summary');
  }

  function finishQuestTracking() {
    // A chapter is a milestone, not the end of the adventure.
    // The story only completes when the learner explicitly reaches a configured end.
    setStoryProgress((currentProgress) => {
      const saved = currentProgress[story.id];
      return {
        ...currentProgress,
        [story.id]: {
          sectionIndex,
          resumeSectionIndex: saved?.resumeSectionIndex ?? sectionIndex,
          branchReveal,
          branchIndex,
          completed: false,
          chapters: saved?.chapters ?? {},
          choices: saved?.choices ?? [],
          pendingChoice: saved?.pendingChoice ?? null,
          pendingBranchOutcome: saved?.pendingBranchOutcome ?? branchReveal,
        },
      };
    });
  }

  async function continueStory() {
    const nextIndex = sectionIndex + 1;
    setIsAnalyzing(true);
    setAnalysisMessage('🪄 Your choice is shaping the next chapter…');
    try {
      const saved = storyProgress[story.id] ?? {
        sectionIndex,
        resumeSectionIndex: nextIndex,
        branchReveal,
        branchIndex,
        completed: false,
        chapters: {},
        choices: [],
      };

      let nextChapter = saved.chapters?.[nextIndex];
      if (!nextChapter) {
        nextChapter = await generateChapterFromSavedProgress({
          ...saved,
          sectionIndex,
          resumeSectionIndex: nextIndex,
          pendingChoice: selectedChoice !== null ? currentChapter.choices[selectedChoice] : saved.pendingChoice ?? null,
          pendingBranchOutcome: branchReveal || saved.pendingBranchOutcome || '',
        }, nextIndex);
      }

      setStoryProgress((current) => ({
        ...current,
        [story.id]: {
          ...(current[story.id] ?? saved),
          sectionIndex: nextIndex,
          resumeSectionIndex: nextIndex,
          branchReveal,
          branchIndex,
          completed: false,
          chapters: { ...(current[story.id]?.chapters ?? {}), [nextIndex]: nextChapter! },
          choices: current[story.id]?.choices ?? saved.choices ?? [],
          pendingChoice: null,
          pendingBranchOutcome: undefined,
        },
      }));
      setSectionIndex(nextIndex);
      setTranscript('');
      setSelectedComprehension(null);
      setSelectedChoice(null);
      setSelectedVocab(null);
      setReadingAnalysis(null);
      setStage('read');
      setReadingPower(0);
      setSceneBeat(0);
    } catch (error) {
      console.error(error);
      setAnalysisMessage('✨ We could not summon the next chapter right now. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  }

  function viewProgress() {
    setStage('progress');
  }

  function openStoryWorld() {
    setStage('choose');
  }

  if (stage === 'progress') {
    const level = Math.max(1, Math.floor(rewards.xp / 100) + 1);
    const levelProgress = rewards.xp % 100;
    return (
      <main className={`shell app-shell app-${stage}`}>
        <header className="topbar">
          <button className="ghost-button" onClick={() => setStage('choose')}>←</button>
          <span>🏆 My Adventure</span>
          <span className="progress-pill">LEVEL {level}</span>
        </header>
        <section className="screen-content">
          <div className="hero-banner progress-hero">
            <div>
              <div className="eyebrow">YOUR STORY WORLD</div>
              <h2>Story Explorer · Level {level}</h2>
              <p className="subtle">Keep reading to unlock new places, words, and badges.</p>
            </div>
            <div className="hero-badge">🔥<span>{rewards.streak} day streak</span></div>
          </div>

          <div className="metric-grid progress-metrics">
            <div className="metric"><b>{rewards.xp}</b><span>⚡ XP</span></div>
            <div className="metric"><b>{rewards.stars}</b><span>⭐ Stars</span></div>
            <div className="metric"><b>{rewards.storiesCompleted}</b><span>📖 Quests</span></div>
          </div>

          <div className="level-card">
            <div className="small-label">NEXT LEVEL</div>
            <strong>Level {level + 1}</strong>
            <div className="level-track"><span style={{ width: `${levelProgress}%` }} /></div>
            <p>{100 - levelProgress} XP to go</p>
          </div>

          <section className="dashboard-card">
            <div className="dashboard-heading"><span>🏆 Badge Shelf</span><span>{rewards.badges.length}/{badgeCatalog.length}</span></div>
            <div className="badge-grid">
              {badgeCatalog.map((badge) => {
                const earned = rewards.badges.includes(badge.id);
                return (
                  <div key={badge.id} className={`badge-tile ${earned ? 'earned' : 'locked'}`}>
                    <div className="badge-icon">{earned ? badge.emoji : '🔒'}</div>
                    <strong>{badge.name}</strong>
                    <p>{earned ? badge.description : 'Complete a quest to unlock this.'}</p>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="dashboard-card">
            <div className="dashboard-heading"><span>🪄 Word Power Collection</span><span>{rewards.wordsLearned.length}</span></div>
            {rewards.wordsLearned.length ? (
              <div className="word-collection">
                {rewards.wordsLearned.map((word) => <button key={word} onClick={() => speak(word)}>🔊 {word}</button>)}
              </div>
            ) : (
              <p className="subtle">Your first magic word will appear here after a vocabulary quest.</p>
            )}
          </section>

          <button className="primary-button full playful-button" onClick={openStoryWorld}>Start today's adventure 🚀</button>
        </section>
      </main>
    );
  }

  if (stage === 'choose') {
    return (
      <main className={`shell app-shell app-${stage}`}>
        <header className="topbar topbar-choose">
          <span className="brand-mark">StoryQuest <small>AI</small></span>
          <div className="top-nav-actions">
            <div className="top-stats"><span>🔥 {rewards.streak}</span><span>⭐ {rewards.stars}</span><span>XP {rewards.xp}</span></div>
            <button className="nav-chip" onClick={viewProgress}>🏆 My progress</button>
          </div>
        </header>
        <section className="screen-content">
          <div className="hero-banner">
            <div>
              <div className="eyebrow">TODAY'S ADVENTURE</div>
              <h2>Pick a world. Unlock the story. 🗺️</h2>
              <p className="subtle">Three starter worlds, each with its own clues, choices, and branching adventure. Your place in every world is saved.</p>
            </div>
            <div className="hero-badge">🎒<span>Quest kit</span></div>
          </div>

          <div className="mission-strip">
            <span>🎯 Mission: earn 4 stars</span><span>🧠 Power: adaptive story</span>
          </div>

          <div className="story-grid">
            {stories.map((item) => {
              const saved = storyProgress[item.id];
              const status = saved?.completed ? '✅ Completed · Replay' : saved ? '↩️ Continue where you left off' : '+90 XP · 4 mini-missions';
              return (
                <button key={item.id} className={`story-card ${storyId === item.id ? 'selected' : ''} ${item.color}`} onClick={() => setStoryId(item.id)}>
                  <span className={`story-thumb story-thumb-${item.id}`} aria-hidden="true">
                    <span className="story-thumb-emoji">{item.emoji}</span>
                  </span>
                  <span className="story-content">
                    <span className="story-title">{item.title}</span>
                    <span className="story-description">{item.description}</span>
                    <span className="story-reward">{status}</span>
                  </span>
                </button>
              );
            })}
          </div>
          <p className="subtle" style={{ textAlign: 'center', marginTop: 8 }}>Each world is a replayable story path. Your place in every adventure is saved, so you can come back anytime.</p>
          <button className="primary-button full playful-button" onClick={startStory} disabled={isAnalyzing}>{isAnalyzing ? '🪄 Restoring your adventure…' : (hasResume ? 'Continue this adventure ↩️' : 'Start my quest 🚀')}</button>
        </section>
      </main>
    );
  }

  if (stage === 'read') {
    const progress = readingPower > 0 ? readingPower : sectionIndex === 0 ? 0 : 10;
    const readingBand = readingPower >= 85 ? 'read-high' : readingPower >= 45 ? 'read-mid' : 'read-low';
    const storyWorldClass = `${story.id}-world chapter-${sectionIndex + 1} branch-${branchIndex} beat-${sceneBeat} ${readingBand}`;
    return (
      <main className={`shell app-shell app-${stage}`}>
        <header className="topbar">
          <button className="ghost-button" onClick={() => setStage('choose')}>←</button>
          <span>{story.emoji} {story.title}</span>
          <div className="top-nav-actions"><div className="top-stats"><span>⭐ {rewards.stars}</span><span>XP {rewards.xp}</span></div><button className="nav-chip" onClick={viewProgress}>🏆</button></div>
        </header>
        <section className="screen-content">
          <div className="quest-header">
            <div><div className="eyebrow">STORY QUEST · CHAPTER {sectionIndex + 1}</div><strong>Reading mission</strong></div>
            <div className="streak-pill">🔥 {rewards.streak || 0} day streak</div>
          </div>
          <div className="quest-progress"><span style={{ width: `${progress}%` }} /></div>

          <div className="story-meta"><span>{sectionIndex === 0 ? 'READ ALOUD TO UNLOCK THE WORLD' : 'FOLLOW YOUR CHOICE'}</span><span>+20 XP</span></div>
          <div className="voice-power-card">
            <div className="voice-power-top"><div><span className="small-label">⚡ READING POWER</span><strong>{readingPower}%</strong></div><div className="voice-companion">{readingPower >= 90 ? '🦊 Nova is cheering!' : readingPower >= 60 ? '✨ The world is waking up!' : '🔋 Read to power the adventure!'}</div></div>
            <div className="voice-power-track"><span style={{ width: `${readingPower}%` }} /></div>
            <p>{readingPower >= 90 ? 'Portal unlocked! Reading progress is complete.' : readingPower >= 60 ? 'Keep going — more of the story world appears as you read.' : 'Your reading progress powers the scene.'}</p>
          </div>

          {(() => {
            const visual = currentChapter.visualScene ?? visualFromText(currentChapter.text, story.id);
            const motion = `visual-motion-${visual.motion}`;
            return (
              <div className={`story-world dynamic-world ${storyWorldClass} scene-${visual.sceneType}`} aria-hidden="true">
                <div className="world-sky" />
                <div className="world-vignette" />
                <div className="world-moon" />
                <div className="world-stars">✦ ･ ✧ ･ ✦ ･ ✧ ･ ✦</div>
                <div className="world-ground" />
                <div className={`scene-landmark ${motion}`}>{visual.primaryEmoji}</div>
                <div className={`scene-companion ${motion}`}>{visual.secondaryEmoji}</div>
                <div className={`scene-particles ${motion}`}>{visual.particleEmoji} {visual.particleEmoji} {visual.particleEmoji} {visual.particleEmoji}</div>
                <div className="scene-clue-glow" />
                {sceneBeat >= 1 && <div className="scene-action-pulse" />}
                {sceneBeat >= 2 && <div className="scene-path-line" />}
                {sceneBeat >= 2 && <span className="world-callout dynamic-callout">{visual.callout}</span>}
                {sceneBeat >= 3 && <span className="world-callout dynamic-callout-3">✨ The next part is unlocked!</span>}
                <span className="scene-caption">{visual.sceneType.replace(/[-_]/g, ' ')} · {sectionIndex + 1}</span>
              </div>
            );
          })()}

          <article className="story-panel playful-panel">
            <div className="chapter-tag">CHAPTER {sectionIndex + 1}</div>
            <h2>{currentChapter.title}</h2>
            <p>{currentChapter.text}</p>
          </article>

          {sectionIndex > 0 && readingAnalysis?.difficultWords?.length ? (
            <div className="power-up-card"><span>🪄 WORD POWER-UP</span><strong>Watch for: {readingAnalysis.difficultWords.slice(0, 2).join(' · ')}</strong><p>The story is giving you another chance to meet words from your last quest.</p></div>
          ) : null}

          <div className="action-row">
            <button className={`record-button ${isListening ? 'recording' : ''}`} onClick={listen}><span>{isListening ? '●' : '🎙️'}</span>{isListening ? 'Listening…' : 'Read aloud'}</button>
            <button className={`secondary-button tts-listen-button ${isSpeaking ? 'speaking' : ''}`} onClick={toggleListen} aria-pressed={isSpeaking}>
              <span className="tts-icon">{isSpeaking ? '⏹' : '🔊'}</span>
              <span>{isSpeaking ? 'Stop' : 'Listen'}</span>
              {isSpeaking && <span className="tts-wave" aria-hidden="true"><i /><i /><i /><i /></span>}
            </button>
          </div>
          {isSpeaking && (
            <div className="tts-playing" role="status">
              <span className="tts-dot" />
              <span><strong>Story audio is playing</strong> · Tap Stop when you’re ready to read it yourself.</span>
            </div>
          )}
          <div className="transcript-box"><div className="small-label">WHAT I HEARD</div><p>{transcript || 'Your reading will appear here.'}</p></div>
          {analysisMessage && <p className="status-message">{analysisMessage}</p>}
          <button className="primary-button full playful-button" disabled={isAnalyzing} onClick={finishReading}>{isAnalyzing ? '🪄 Unlocking the next scene…' : 'Power up the story ✨'}</button>
        </section>
      </main>
    );
  }

  if (stage === 'comprehension') {
    return (
      <main className={`shell app-shell app-${stage}`}>
        <header className="topbar"><span>🕵️ Story Detective · Chapter {sectionIndex + 1}</span><span className="progress-pill">CLUE 1/3</span></header>
        <section className="screen-content">
          <div className="quest-card teal"><span>🧠 THINK LIKE A DETECTIVE</span><strong>Find the best clue!</strong><p>One answer unlocks the next move.</p></div>
          <h2>{currentChapter.question}</h2>
          <p className="subtle">Choose the answer that best matches the story.</p>
          <div className="option-list">
            {currentChapter.comprehensionChoices.map((option, index) => (
              <button key={option} className={`option-button ${selectedComprehension === index ? 'selected' : ''}`} onClick={() => setSelectedComprehension(index)}>
                <span className="option-letter">{String.fromCharCode(65 + index)}</span>{option}
              </button>
            ))}
          </div>
          <button className="primary-button full playful-button" disabled={selectedComprehension === null} onClick={finishComprehension}>Unlock the clue 🔓</button>
          {readingAnalysis && <div className="mini-insight">✨ Your reading focus: <strong>{readingAnalysis.focus}</strong> · accuracy {readingAnalysis.accuracyScore}%</div>}
        </section>
      </main>
    );
  }

  if (stage === 'choice') {
    return (
      <main className={`shell app-shell app-${stage}`}>
        <header className="topbar"><span>🎮 Adventure Choice · Chapter {sectionIndex + 1}</span><span className="progress-pill">CLUE 2/3</span></header>
        <section className="screen-content">
          <div className="quest-card choice-quest"><span>✨ YOUR DECISION CHANGES THE STORY</span><strong>{currentChapter.choiceQuestion}</strong><p>Choose carefully — the next scene will remember your decision.</p></div>
          <div className="choice-grid">
            {currentChapter.choices.map((choice, index) => (
              <button key={choice.title} className={`story-choice ${selectedChoice === index ? 'selected' : ''}`} onClick={() => setSelectedChoice(index)}>
                <span className="choice-emoji">{choice.emoji}</span>
                <div><strong>{choice.title}</strong><p>{choice.description}</p></div>
              </button>
            ))}
          </div>
          <button className="primary-button full playful-button" disabled={selectedChoice === null} onClick={finishChoice}>Make my choice ✨</button>
        </section>
      </main>
    );
  }

  if (stage === 'vocabulary') {
    return (
      <main className={`shell app-shell app-${stage}`}>
        <header className="topbar"><span>🪄 Word Wizard · Chapter {sectionIndex + 1}</span><span className="progress-pill">CLUE 3/3</span></header>
        <section className="screen-content">
          {branchReveal && <div className="branch-reveal-card"><span>🎬 STORY CONSEQUENCE</span><strong>{branchReveal}</strong><p>Remember this clue — it will shape the next chapter.</p></div>}
          <div className="spell-card">
            <span>✨ MAGIC WORD</span>
            <strong>{currentChapter.vocabWord}</strong>
            <button className="listen-word" onClick={() => speak(currentChapter.vocabWord)}>🔊 Hear it</button>
          </div>
          <h2>Which meaning unlocks the word?</h2>
          <p className="subtle">Pick your answer and power up your vocabulary.</p>
          <div className="option-list">
            {currentChapter.vocabChoices.map((option, index) => (
              <button key={option} className={`option-button ${selectedVocab === index ? 'selected' : ''}`} onClick={() => setSelectedVocab(index)}>{option}</button>
            ))}
          </div>
          <button className="primary-button full playful-button" disabled={selectedVocab === null} onClick={finishVocabulary}>Cast the word spell ✨</button>
        </section>
      </main>
    );
  }

  const average = Math.round((profile.fluency + profile.comprehension + profile.vocabulary) / 3);
  const achievement = achievementFor(average);
  return (
    <main className={`shell app-shell app-${stage}`}>
      <header className="topbar"><span>🏆 Quest complete</span><div className="top-nav-actions"><div className="top-stats"><span>⭐ {rewards.stars}</span><span>XP {rewards.xp}</span></div><button className="nav-chip" onClick={viewProgress}>🏆 My progress</button></div></header>
      <section className="screen-content">
        <div className="success-icon celebration">{achievement.emoji}</div>
        <div className="eyebrow centered">YOU UNLOCKED A NEW BADGE</div>
        <h2 className="centered">{achievement.title}!</h2>
        <p className="subtle centered">{achievement.text}</p>
        {lastQuestReward && <div className="reward-banner">{lastQuestReward}</div>}
        <div className="metric-grid">
          <div className="metric"><b>{profile.fluency}%</b><span>Reading accuracy</span></div>
          <div className="metric"><b>{readingPower}%</b><span>Reading progress</span></div>
          <div className="metric"><b>{profile.vocabulary}%</b><span>Word power</span></div>
        </div>
        {readingAnalysis && (
          <div className="analysis-card">
            <div className="small-label">GEMINI AI READING INSIGHT</div>
            <p><strong>{readingAnalysis.strength}</strong> — {readingAnalysis.feedback}</p>
            <div className="analysis-columns">
              <div><span>Words matched</span><b>{readingAnalysis.matchedWords}</b></div>
              <div><span>Accuracy</span><b>{readingAnalysis.accuracyScore}%</b></div>
            </div>
            {readingAnalysis.difficultWords.length > 0 && <p className="analysis-words"><strong>Word power-up:</strong> {readingAnalysis.difficultWords.join(', ')}</p>}
          </div>
        )}
        <div className="focus-card"><span>🎯 NEXT QUEST</span><strong>{profile.focus}</strong><p>Your next chapter will give you another chance to use this skill.</p></div>
        <button className="secondary-button full playful-button" onClick={continueStory} disabled={isAnalyzing}>{isAnalyzing ? '🪄 Summoning the next chapter…' : 'Continue the story 📖'}</button>
        <button className="secondary-button full" onClick={viewProgress}>View my rewards 🏆</button>
        <button className="primary-button full" onClick={() => setStage('choose')}>Choose a new adventure 🌈</button>
      </section>
    </main>
  );
}
