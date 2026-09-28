# for Anjali

A small private website made by Kesava for Anjali's birthday (20 October).

It's a short, cinematic story you move through at your own pace: the arrival, a candle, the chaos archive, our timeline, the letter, and the credits.

## Run it

```bash
npm install
npm run dev
```

Then open <http://localhost:3000/?preview>. The `?preview` part skips the "too early" countdown before the birthday.

## Where things live

| What | Where |
|---|---|
| Birthday date, song path, voice note, WhatsApp number | `src/app/data/config.js` |
| Photos, captions, dates, chapter titles, memories, inside jokes, notes | `src/app/data/memories.js` (images in `public/memories/`). Fields marked `EDIT` are empty until you fill them — empty fields are simply not shown. |
| Opening lines, "things I never say", credits | `src/app/data/story.js` |
| The letter | `public/letter.txt` |
| The soundtrack | `public/audio/` (drop `yaaron.mp3` here) |
| Original, untouched photos | `public/images/` |

Design and story notes: `BIRTHDAY_EXPERIENCE_AUDIT.md`, `BIRTHDAY_DESIGN_SYSTEM.md`, `BIRTHDAY_STORYBOARD.md`.
