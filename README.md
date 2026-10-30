# Arturo Jiménez — personal website

A bilingual Next.js portfolio with an ivory, charcoal, and vermilion visual identity. It includes an AI Digital Twin that answers questions about Arturo's career using OpenAI's Responses API and the `gpt-6-luna` model.

## Run locally

Requires Node.js 22 or newer, npm, and an OpenAI API key.

```sh
npm install
cp .env.example .env
npm run dev
```

Set `OPENAI_API_KEY` in `.env` before starting the app. The key is read only by the server-side route and is never sent to the browser.

Open http://localhost:3000. English is at `/en`, Spanish at `/es`. The language switch preserves the current page and section.

For the production build:

```sh
npm run build
npm start
```

## Content

- `src/lib/content.ts`: English and Spanish text, career history, project links, skills, and contact information.
- `src/app/[lang]/page.tsx`: portfolio homepage.
- `src/app/[lang]/cv/page.tsx`: complete, accessible, printable online CV.
- `src/app/api/digital-twin/route.ts`: validated, rate-limited server endpoint for the AI Digital Twin.
- `src/components/digital-twin-chat.tsx`: bilingual chat interface.
- `src/lib/digital-twin.ts`: server-only career context and grounding instructions.
- `src/app/globals.css`: responsive design, motion preferences, and A4 print styles.
- `public/documents/Arturo-Jimenez-CV.pdf`: English CV generated from the online version.
- `public/documents/Arturo-Jimenez-CV-ES.pdf`: Spanish CV generated from the online version.

The provided CV is the source of truth where its dates differ from the LinkedIn export. Project links point to the real Oracle, Stoa, and Dance Tutor repositories. Photography is copied from Arturo’s existing website; the architecture and project illustrations are original SVG/CSS. Manrope and IBM Plex Mono are hosted locally, under their respective SIL Open Font Licenses. There are no analytics or tracking cookies.

## Verify

```sh
npm run typecheck
npm run build
# With the site running:
npm run test:browser
```

Browser checks use Playwright and system Chrome/Chromium, or Playwright's installed browser. Set `BROWSER_EXECUTABLE_PATH` if needed. On a machine without a browser, run `npx playwright install chromium` once. `SITE_URL` overrides the default test address of http://localhost:3000.

To regenerate both PDF downloads after editing CV content, keep the website running and execute:

```sh
npm run cv:pdfs
```

Both online CVs also support **Print CV / Imprimir CV**, including the browser's Save as PDF option.
