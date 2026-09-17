# Deployment

## Environment variables

Configure these server-side environment variables in Vercel (or another server-side hosting platform):

```text
GEMINI_API_KEY
GEMINI_MODEL
```

Do not commit `.env.local`.

## Vercel

1. Import the GitHub repository.
2. Select the Next.js framework preset.
3. Add `GEMINI_API_KEY`.
4. Add `GEMINI_MODEL`.
5. Deploy.
6. Open the HTTPS deployment URL and test microphone permissions and AI flows.

## Local build check

Before pushing deployment changes:

```bash
npm install
npm run build
```

A successful production build should complete type checking and page generation without errors.

## Mobile testing

Use the HTTPS deployment URL on a phone for microphone and responsive-layout testing.
