# Birthday Storyboard — "for Anjali"

> **Note (28 Sep 2026):** the nickname “Chinnu” has since been removed at Kesava’s request — the site only ever calls her **Anjali**. Mentions of “Chinnu” below are kept as the historical record of earlier drafts.

> This is the screen-by-screen script for the birthday experience. It builds on `BIRTHDAY_EXPERIENCE_AUDIT.md` (what and why) and `BIRTHDAY_DESIGN_SYSTEM.md` (look, type, motion and sound tokens). All visual tokens referenced here, such as `--gold`, `caption`, `dur-arrive` and "print", are defined in the design system.
>
> **Sequence:** this storyboard **supersedes the scene list in Design System §19**. The visual rules in that document still apply.
>
> **No invented memories.** Every caption below is Kesava's own, verbatim. Dates come only from photo filenames or the photos themselves. Anything unknown is a `[PLACEHOLDER]`, and screens that depend on placeholders have a defined fallback so the experience never shows an empty slot.
>
> No application code has been changed.

---

## The shape of it

```
CURIOUS ──▶ SURPRISE ──▶ JOY ──▶ LAUGHTER ──▶ NOSTALGIA ──▶ EMOTION ──▶ WARMTH ──▶ MEMORABLE ENDING
   01          02         02        03            04            05          06        07 · 08
Arrival   Birthday Reveal      Chaos Archive  Our Timeline  Things I   The Letter  One Last Surprise
                                                             Never Say              · Final Ending
```

### Structure change and why

The proposed structure had **Our Timeline (03) before The Chaos Archive (04)**. I've swapped them:

1. **The emotional progression asks for laughter before nostalgia.** The funny photos (the foam birthday, the sunglasses, the photobomb, the group chaos, the "I don't even remember what we were talking about" photo) produce laughter. The quieter ones (the rooftop, the shared earphones, "no special occasion") produce nostalgia.
2. **Kesava's captions already form this arc.** The Timeline's natural last photo carries the caption *"And somehow, after all this time, it still feels exactly the same."* That's the perfect bridge out of nostalgia into **Things I Never Say** and the letter. If the Timeline came first, that line would be spent too early and the Chaos Archive would break the mood right before the letter.
3. **Laughter first lowers her guard.** Once she's laughing, the sincere turn lands harder.

### Section overview

| # | Section | Emotion | Surface | Music (gain) | Approx. time |
|---|---|---|---|---|---|
| 01 | The Arrival | Curious | Night | 0 → 0.55 | 0:30–0:45 |
| 02 | Birthday Reveal | Surprise → Joy | Night + candlelight | 0.25 → 0.70 | 0:45 |
| 03 | The Chaos Archive | Laughter | Night, "desk" | 0.55 | 1:00–1:30 |
| 04 | Our Timeline | Nostalgia | Night, lamp | 0.50 (0 during video) | 1:30–2:00 |
| 05 | Things I Never Say | Emotion | Night, dimmest | 0.35 | 0:40 |
| 06 | The Letter | Emotion → Warmth | Paper | 0.22 | 2:00–3:00 |
| 07 | One Last Surprise | Warmth | Night → soft light | 0.10 / 0.45 | 0:30 |
| 08 | Final Ending | Memorable ending | Night, dusk | 0.65 → 0.45 | 0:45 + |

Total: about **7–9 minutes at her own pace.** Every screen waits for her, except timed title lines and credits, which can always be skipped.

---

## Global elements (present across screens)

| Element | Behavior |
|---|---|
| **Sound toggle** | Top-right, 44px glass circle with equalizer bars. It appears from 01.3 onward (after the first tap). `M` toggles it. |
| **Chapter marker** | Top-left, mono `meta` in `--cream-faint`, e.g. `03 · the chaos archive`. It's hidden in 01.1, 01.2 and 06. It changes with a 240ms cross-fade. |
| **Grain** | A static noise overlay on every screen: overlay on night, multiply on paper. |
| **Progress memory** | The current screen is saved. Coming back resumes via 01.2's "continue" option. |
| **Keyboard** | `Enter` / `Space` / `→` advance, `←` goes back where allowed, `Esc` skips a timed sequence. |
| **Reduced motion** | All motion becomes ≤ 200ms fades (Design System §15). |

---

# 01 — The Arrival
**Emotion: CURIOUS.** *"Wait… Kesava made something? For me?"*

> **Revised (as built):** 01.2 and 01.3 and the old 02.1 name screen are now **one continuous scene**:
> dark → *"I made something for you."* → *"Don't rush this."* → **ENTER →** (music begins) → **ANJALI** (letters come into focus as the tracking tightens) → *"today is yours."* → the name pushes forward and dissolves, leaving one warm point of light that **becomes the candle's flame** in 02 (a match cut; both sit on `--flame-y`).
> The earphones setup survives as a quiet line under Enter: `best with earphones in`. The notes below for 01.2 / 01.3 / 02.1 are kept for history.

## 01.0 · The link preview *(before the site opens)*

| | |
|---|---|
| **Purpose** | Make the first impression, in WhatsApp, feel like a sealed invitation rather than a random link |
| **Emotional goal** | Curiosity and a tiny flutter: "what is this?" |
| **Visual composition** | 1200×630 OG image. The rooftop photo is warm-graded and darkened on the left third. "for Anjali" sits in Fraunces `display` in cream, left-aligned at optical center, with `20.10` below it in mono `--gold`. |
| **Exact headline** | OG title: **for Anjali — open when you're ready** |
| **Supporting text** | OG description: *a small thing I made.* |
| **CTA** | The link itself |
| **Interaction** | Tap the link |
| **Animation** | None (it's a static image) |
| **Transition** | → 01.1 or 01.2, depending on the date |
| **Desktop** | The same card in WhatsApp Web |
| **Mobile** | WhatsApp shows a large-image preview. The text stays clear of the bottom 20%, where WhatsApp overlays the domain. |
| **Existing assets** | `public/memories/rooftop.jpg` |
| **New assets** | Generated OG image (`opengraph-image`), candle-flame favicon (`icon.svg`) |
| **Components** | `opengraph-image` route, metadata in `layout.js`, `icon.svg` |

## 01.1 · Not yet *(only shown before 20 Oct 2026, 00:00 IST)*

| | |
|---|---|
| **Purpose** | Handle her opening it early, playfully, without spoiling anything |
| **Emotional goal** | Anticipation and a smile: "he's making me wait?!" |
| **Visual composition** | Night with the lavender dusk wash. Four Fraunces `display` numbers on one baseline, separated by thin `--night-700` hairlines, with mono labels underneath. The headline sits above in `title` italic. Nothing else. |
| **Exact headline** | **too early, chinnu.** |
| **Supporting text** | *come back at midnight.* |
| **CTA** | None. She waits. |
| **Interaction** | None. Tapping does nothing (on purpose). |
| **Animation** | Each digit cross-fades over 240ms. The headline uses *arrival*. |
| **Transition** | At 00:00:00 the numbers dissolve (900ms), 1.2s of pure night follows, then 01.2 arrives |
| **Desktop** | Numbers in one row, max width 720px |
| **Mobile** | Numbers in one row at a smaller `display` size (`clamp` keeps all four digits on one line at 360px), labels in `meta` |
| **Existing assets** | — |
| **New assets** | — |
| **Components** | `CountdownGate`, `NightSurface`, `Grain` |

## 01.2 · "hi chinnu." *(the screening room)*

| | |
|---|---|
| **Purpose** | Greet her personally, set the intimate tone, preload assets, and get the tap that unlocks audio |
| **Emotional goal** | Intimacy: "this is just for me." |
| **Visual composition** | Night, grain, and a faint lamp above center. The headline is centered at the optical center. The second line appears 48px below it and the CTA sits in the thumb zone. A mono loading whisper sits at the very bottom in `--cream-faint`. |
| **Exact headline** | **hi chinnu.** |
| **Supporting text** | *put your earphones in.* (This is the setup for **THE MOMENT**; see the final section.) |
| **CTA** | `begin →`. For a returning visit: `continue from "[section name]" →` plus a quiet pill `start from the beginning` |
| **Interaction** | Tap `begin`. This starts the music (a 3s fade-in to 0.55) and moves on. |
| **Animation** | The headline arrives (fade + rise + unblur, 900ms). The second line follows at +1.6s. The CTA arrives when the song reports `canplaythrough`, or at +2.8s at the latest. The mono whisper counts real preloads: `loading memories · 7/11` → `ready`. |
| **Transition** | Dip through black (500 / 200 / 900ms) → 01.3 |
| **Desktop** | The same composition with larger type. `Enter` also begins. |
| **Mobile** | The CTA sits in the bottom 35%, with safe-area padding |
| **Existing assets** | Song (`[SONG PATH]`, the Yaaron file; falls back to `audio/happy-birthday.mp3`) |
| **New assets** | Yaaron audio file |
| **Components** | `IntroScreen`, `SoundProvider`, `usePreload`, `useProgress`, `TextButton`, `QuietPill` |

## 01.3 · Opening titles

| | |
|---|---|
| **Purpose** | Build a small film-like overture, so the name reveal feels earned |
| **Emotional goal** | Curiosity deepening into "oh… this is real." |
| **Visual composition** | Pure night. One centered line at a time in Fraunces `title` italic. No chrome except the sound toggle and a `tap to skip` hint. |
| **Exact headline** | The lines play in sequence (these are drafts in Kesava's voice, to be approved): 1. **so… I made you something.** 2. **about the days I don't want either of us to forget.** 3. **for my favourite person.** |
| **Supporting text** | `tap to skip` (mono, `--cream-faint`, appears at +2.5s) |
| **CTA** | None. It auto-advances, and tapping skips to the next line. |
| **Interaction** | Tap = next line. `Esc` jumps to 02. |
| **Animation** | Each line dissolves in place: 700ms in, 1800–2600ms hold (proportional to length), 500ms out. Lines never overlap. |
| **Transition** | After line 3 fades, 800ms of darkness → 02.1. The screen stays black, so the name emerges from darkness. |
| **Desktop** | Lines at `title` max size, centered, measure ≤ 24em |
| **Mobile** | Lines wrap to at most 2 lines each, with generous side gutters |
| **Existing assets** | — |
| **New assets** | — |
| **Components** | `TitleSequence`, `TapToAdvance` |

---

# 02 — Birthday Reveal
**Emotion: SURPRISE → JOY.** *Her name, a candle, a wish.*

> **Revised (as built):** after the candle is blown out, the reveal is progressive:
> the room settles into darkness → a spark rises from the wick and opens into a gold line → **ANJALI.** rises out of the line as the music swells →
> **HAPPY BIRTHDAY,** settles above it → one burst of warm paper confetti from the lower corners (fires once) → *"this is your present, chinnu."* / *"there's more inside. take your time."* → `see what's inside →`.
> A tap during the sequence skips to the finished frame. The two supporting lines are drafts in Kesava's voice.

## 02.1 · The name

| | |
|---|---|
| **Purpose** | The first peak: her name, as big and beautiful as it deserves |
| **Emotional goal** | Surprise: "that's me." |
| **Visual composition** | Night. **Anjali** in Fraunces `name` (up to 11rem) at the optical center, the only element on screen. A beat later, **chinnu ❤️** is handwritten in rose Caveat just below and slightly right, like an annotation in the margin. |
| **Exact headline** | **Anjali** |
| **Supporting text** | *chinnu ❤️* (the only heart in the interface chrome) |
| **CTA** | `tap to continue` hint at +3s |
| **Interaction** | Tap to continue |
| **Animation** | **Emotion:** the name fades in over 2400ms while its tracking tightens from 0.08em to −0.03em, as if coming into focus. "chinnu ❤️" writes on as a 900ms stroke draw, 600ms after the name settles. |
| **Transition** | The name dims to 0 (700ms) and the candle's glow rises in the same space (cross-fade through warm dark) → 02.2 |
| **Desktop** | The name at max size with plenty of air around it |
| **Mobile** | `clamp(4.5rem, 20vw, …)` keeps "Anjali" on one line at 360px |
| **Existing assets** | — |
| **New assets** | — |
| **Components** | `NameReveal`, `HandNote` |

## 02.2 · The candle

| | |
|---|---|
| **Purpose** | Give her one real, participatory birthday ritual instead of a cartoon cake |
| **Emotional goal** | Anticipation, then **joy** |
| **Visual composition** | Night, where the candle *is* the light. A single slim SVG candle (cream wax, an `--ember` core and `--gold-soft` flame) sits slightly below center, and its radial glow lights the scene. The copy sits above the candle and the prompt below it. |
| **Exact headline** | **make a wish first.** |
| **Supporting text** | At +2.5s: *now tap to blow it out.* |
| **CTA** | The candle itself (accessible name: "Blow out the candle") |
| **Interaction** | A tap on the candle, or anywhere in the bottom half, blows it out. There's no microphone permission prompt, since it's unreliable in in-app browsers. |
| **Animation** | Idle: the flame flickers (the screen's one loop), and the glow breathes with it. On tap: the flame leans and gutters out (500ms), then a thin smoke wisp rises and dissolves (1800ms). The music dips to 0.1. There's 600ms of near-darkness. |
| **Transition** | Stays on the same screen → 02.3 |
| **Desktop** | Click or `Space` |
| **Mobile** | The whole lower half is the tap target (thumb-friendly) |
| **Existing assets** | — |
| **New assets** | Candle SVG and smoke (built in code) |
| **Components** | `Candle`, `useSound().setLevel()` |

## 02.3 · Happy Birthday

| | |
|---|---|
| **Purpose** | Joy: the single celebratory release of the whole experience |
| **Emotional goal** | Joy, a grin |
| **Visual composition** | From where the flame was, a warm radial gold bloom fills the upper two-thirds. The headline sits in Fraunces `display` at the optical center, and the extinguished candle stays visible below it, softly lit. |
| **Exact headline** | **Happy Birthday, Chinnu.** |
| **Supporting text** | *[AGE, optional — e.g. "[AGE] looks good on you."]* If Kesava doesn't provide it, there's no supporting line. |
| **CTA** | `okay, next →` (arrives at +2.5s) |
| **Interaction** | Tap CTA |
| **Animation** | The bloom rises from 0 to 1 and settles at 0.3 (2200ms). The headline arrives (900ms, +400ms). **The one ember burst:** about 40 tiny warm particles (gold and cream, a few rose) drift *upward* from the wick like embers and fade within 2.5s. It plays once and never repeats. The music swells to 0.70. |
| **Transition** | The bloom fades down to night, then dip → 03 intro card |
| **Desktop** | The same composition. Particles are limited to a 600px column. |
| **Mobile** | Particles are limited to the center column. There's no burst if the device is low-power or has reduced motion; the bloom alone is enough. |
| **Existing assets** | — |
| **New assets** | — |
| **Components** | `Bloom`, `EmberBurst` (canvas-confetti with a custom upward gravity and warm palette, or a small custom canvas) |

---

# 03 — The Chaos Archive
**Emotion: LAUGHTER.** *"Oh no, not THAT photo."*

> **Revised (as built):** the desk/pile became a **scrolling scrapbook**: editorial spreads (a hero print, an overlapping pair, a stacked duplicate, a tall feature), paper prints with a writing margin (`no. 03 · 16.02.2025`), three strips of tape, and captions set beside the prints.
> Any print opens a fullscreen viewer (swipe / ← → / Esc). **The video moved here from the timeline** as "film 01": a dark strip of film stock that opens its own cinema viewer; the song pauses while it plays, returns 1.4s after it ends, and returns immediately if she closes it.

A playful, messy desk of prints: evidence of years of chaos. This is the one section where the design system allows imperfection: tilted prints, handwritten labels, a slightly developer-ish "archive" framing.

## 03.0 · Archive title card

| | |
|---|---|
| **Purpose** | Change the tone from celebration to fun, and set up the "evidence" framing |
| **Emotional goal** | Amused anticipation |
| **Visual composition** | Night. A mono label sits above the headline like a folder path. The headline is in Fraunces `title`. |
| **Exact headline** | **the chaos archive** |
| **Supporting text** | Mono above: `~/memories/chaos_archive · 6 files`. Italic below: *evidence, in no particular order.* |
| **CTA** | `open it →` |
| **Interaction** | Tap |
| **Animation** | Mono label, headline, then subtitle, each *arriving* with a 140ms stagger |
| **Transition** | The title fades while prints "drop" onto the desk one by one → 03.1 |
| **Desktop / Mobile** | Centered, identical |
| **Existing assets** | — |
| **New assets** | — |
| **Components** | `SectionCard` |

## 03.1 · The desk (exhibits)

| | |
|---|---|
| **Purpose** | Let her rediscover the funny moments at her own pace, with physical, playful interaction |
| **Emotional goal** | **Laughter:** recognition, "I remember this", teasing |
| **Visual composition** | **Desktop:** six prints scattered across a dark "desk", each at a different tilt (−6° to +6°) and slightly overlapping, with a mono label next to each (`exhibit 01`…). **Mobile:** a **stacked pile** in the center, with the top print fully visible and the edges of the others peeking out at different angles beneath it. |
| **Exact headline** | None on the desk itself. Each exhibit has a mono label, then its caption when opened. |
| **Supporting text** | Per exhibit (Kesava's captions, verbatim; see the table below) |
| **CTA** | After the last exhibit: `that's enough chaos →` |
| **Interaction** | **Desktop:** click a print to *lift* it (it straightens to 0°, enlarges to the center, and dims the others). The caption appears below. Click outside or press `Esc` to put it back. **Mobile:** tap the top print to flip it toward her and show the caption, then **flick it aside** (swipe in any direction) to reveal the next one. A counter shows `exhibit 02 / 06`. |
| **Animation** | Prints drop in with a slight settle (300ms each, 120ms stagger, no bounce). Lift: 600ms `ease-out-soft`. The *developing* effect runs on lift. A flicked print slides away with momentum and fades out (400ms). The caption *arrives*. Each optional `[INSIDE JOKE]` sticky note appears as a Caveat annotation tilted beside the print. |
| **Transition** | After exhibit 06 and the CTA: the prints sweep together into a neat pile, then dip → 04 |
| **Existing assets** | See the table |
| **New assets** | Optional `[INSIDE JOKE]` annotations (≤ 6 words each, Caveat) |
| **Components** | `ArchiveDesk` (desktop scatter), `ArchivePile` (mobile stack with swipe), `PhotoPrint`, `CaptionBlock`, `HandNote`, `Counter` |

### Exhibits (in order)

| # | Mono label | File | Date | Caption (verbatim) | Handwritten note |
|---|---|---|---|---|---|
| 01 | `exhibit 01 · the birthday incident` | `memories/cake-2023.jpg` | `20.10.2023` | "The birthday girl, caught somewhere between cake, chaos and a lot of happiness." | *remember this?* |
| 02 | `exhibit 02` | `memories/sunglasses.jpg` | `[DATE]` | "Somehow, even the random days became memories worth keeping." | `[INSIDE JOKE]` |
| 03 | `exhibit 03 · the photobomb` | `memories/selfie-background.jpg` | `16.02.2025` | "You take the selfie. I just make sure I'm in the background." | `[INSIDE JOKE]` |
| 04 | `exhibit 04` | `memories/group-selfie-1.jpg` | `[DATE]` | "Some memories come with extra people, extra noise and extra stories." | `[INSIDE JOKE]` |
| 05 | `exhibit 05` | `memories/group-selfie-2.jpg` | `[DATE]` | "Same people, same chaos, another memory saved." | — |
| 06 | `exhibit 06 · unknown topic` | `memories/funny-outdoors.jpg` | `[DATE]` | "I don't even remember what we were talking about, but this photo remembers the laughter." | — |

- Exhibits 04 and 05 are near-identical shots. Showing them back to back *is* the joke ("same people, same chaos"), so both stay unless Kesava prefers otherwise.
- The subtitle labels ("the birthday incident", "the photobomb", "unknown topic") are derived only from Kesava's captions. Kesava can remove them.
- The rule for `[DATE]` placeholders: if no date is provided, the date line is simply omitted, not shown as "unknown".

---

# 04 — Our Timeline
**Emotion: NOSTALGIA.** *The ordinary days that became ours.*

> **Revised (as built):** a scrolling page of **chapters** along a gold thread that fills as she scrolls.
> 01 *a normal college day* and 02 *no special occasion* alternate sides · 03 *a good view* (26.01.2025) opens up **full width** ·
> 04 *one pair of earphones* is **THE MOMENT as a pinned, scroll-driven scene** (the room dims → `01/02/25` alone → the print develops → caption → the handwritten note; music lifts to 0.6 while inside) ·
> 05 *still the same* — the caption arrives phrase by phrase, then `→` and the page dims out.
> **Added (28 Sep 2026):** chapter 05 *last birthday* (20.10.2025) — three photos from her birthday last year, laid down together as a set; caption *"Your birthday, last year — the last time we met."* (from the letter). *still the same* becomes chapter 06. The letter and the ticket now say they'll meet **soon** (not "tomorrow").
> Titles are taken from Kesava's captions. Each chapter also supports `memory`, `joke` and `note` fields (all editable in `src/app/data/memories.js`; null = not shown).

Where the archive was a messy desk, the timeline is **calm and linear**: one print at a time, under a warm lamp, with a thin line of dates running along the bottom.

## 04.0 · Timeline title card

| | |
|---|---|
| **Purpose** | Shift from laughter to reflection |
| **Emotional goal** | Softening |
| **Visual composition** | Night, with the lamp slightly dimmer than in 03. The headline is in Fraunces `title` italic. |
| **Exact headline** | **our timeline** |
| **Supporting text** | *the ordinary days. the ones that turned out to matter.* |
| **CTA** | `keep going →` |
| **Interaction** | Tap |
| **Animation** | *arrival* |
| **Transition** | Dip → 04.1. A thin timeline rule draws itself left to right along the bottom (1200ms). |
| **Desktop / Mobile** | Identical, centered |
| **Components** | `SectionCard`, `TimelineRule` |

## 04.1 · The reel

| | |
|---|---|
| **Purpose** | Walk through the relationship's quiet, tender moments in order |
| **Emotional goal** | **Nostalgia:** a lump in the throat |
| **Visual composition** | One print, centered and upright (no tilt here, because this is calmer than the archive). Below it, a mono date, then the caption in Fraunces `caption` italic. At the very bottom, a thin horizontal **timeline rule** with one tick per memory, where the current tick glows gold. The ticks carry dates where known, and only a dot where not. |
| **Exact headline** | None. The photo is the headline. |
| **Supporting text** | Per memory (see the table below) |
| **CTA** | Swipe or tap on the right third / `→`. The last memory shows `→` after its caption settles. |
| **Interaction** | Swipe left/right (≥ 48px threshold), or tap the right or left third of the screen, or use the arrow keys. Going back is allowed. |
| **Animation** | **Memory:** the print rises 16px and fades in (900ms) while the image *develops* (saturation 0.6→1 over 1400ms), then a slow Ken Burns (scale 1→1.045 over 14s, once). The caption arrives 600ms after the print. Photo to photo: a cross-dissolve with a 24px drift in the swipe direction. The gold tick glides along the rule. |
| **Transition** | See 04.2 for the special final memory → 05 |
| **Desktop** | The print is at most `min(560px, 44vw)` wide and `68vh` tall. The timeline rule spans 60% width. Hovering a tick shows its date. |
| **Mobile** | The print is at most `86vw` × `60dvh`. The rule spans the full width minus gutters. Tall portrait prints (the campus photos are 720×1599) are capped by height, and the caption stays visible without scrolling. |
| **Existing assets** | See the table |
| **New assets** | `[DATE]` for undated photos, a video poster frame, and optional `[VIDEO CAPTION]` |
| **Components** | `TimelineReel`, `PhotoPrint`, `CaptionBlock`, `TimelineRule`, `FilmFrame` (video), `useSwipe` |

### Memories (in order)

| # | File | Date | Caption (verbatim) | Notes |
|---|---|---|---|---|
| 1 | `memories/standing-outdoors.jpg` | `[DATE]` | "Back when a normal college day could turn into a memory." | Opens the timeline: the campus, the uniforms, the pillar |
| 2 | `memories/sitting-together.jpg` | `[DATE]` | "No special occasion. Just us, existing in the same frame." | |
| 3 | `memories/rooftop.jpg` | `26.01.2025` | "A good view, a good day, and one of my favourite people." | The widest, most open frame. Ken Burns pans slowly across the fields. |
| 4 | `memories/earphones.jpg` | *(the date is in the caption)* | "01/02/25 — one more ordinary day that somehow became ours." | **THE MOMENT** (see the final section). It has its own staging. |
| 5 | `images/video-1.mp4` | `[DATE]` | `[VIDEO CAPTION]` (optional; if none, no caption) | Film framing, a 64px glass play button, and the label `press play · sound on`. The music ducks to 0 during playback and fades back afterward. |
| 6 | `memories/laughing-outdoors.jpg` | `[DATE]` | **"And somehow, after all this time, it still feels exactly the same."** | The final memory (see 04.2) |

## 04.2 · The last memory *(special staging)*

| | |
|---|---|
| **Purpose** | Turn nostalgia into the present, a bridge to sincerity |
| **Emotional goal** | "It really does still feel the same." |
| **Visual composition** | The laughing photo arrives normally, but the caption waits: **400ms of extra stillness**, then it arrives word group by word group ("And somehow," / "after all this time," / "it still feels exactly the same."). The timeline rule's final tick glows and then the whole rule fades away, because the timeline "ends" at now. |
| **Exact headline** | (the caption) |
| **CTA** | `→` after 2s |
| **Interaction** | Tap |
| **Animation** | Caption phrases arrive 500ms apart. The rule fades out over 1200ms. |
| **Transition** | **The print stays in place and slowly dims to darkness (1600ms)**, leaving only night → 05. This is the only transition that lingers instead of dipping. |
| **Components** | `TimelineReel` (final-item variant) |

---

# 05 — Things I Never Say
**Emotion: EMOTION.** *The things Kesava types and never sends.*

> **Revised (as built):** no message bubbles — type and darkness only. *"things I never say."* → five numbered thoughts (`01`–`05`), each surfacing a word at a time with pauses at commas, holding, then drifting away; the light warms slightly with each one →
> a silence, the music lowers → *"And there's something I actually wanted to tell you."* → `Open it →` → the envelope (which she opens herself — see 06).
> The thoughts are Kesava's own captions re-read as thoughts (sources noted in `src/app/data/story.js` → `neverSay`), so nothing is invented; replace them with new lines any time. About 45s untouched; a tap finishes or advances a thought.

## Concept
Most friendships carry things that never get said out loud. This section shows them as **unsent drafts**: short messages that appear as if being typed into a message box… and then, for once, get **sent**.

It's subtly developer-made (a typing cursor, a quiet "sent" tick) without imitating any real app's branding. The bubble is a neutral cream-on-night shape designed in this system.

**Content rule:** these lines must be written by Kesava. They are **not** taken from the letter (to avoid repetition) and not invented here.

## 05.0 · The setup

| | |
|---|---|
| **Purpose** | Move into the most sincere register before the letter |
| **Emotional goal** | Vulnerability |
| **Visual composition** | Night at its dimmest. There's no lamp, and a single line sits centered. |
| **Exact headline** | **things I never say.** |
| **Supporting text** | *I type them sometimes. I just never send them.* |
| **CTA** | `tap to continue` hint |
| **Interaction** | Tap |
| **Animation** | *arrival*, then the supporting line at +1.2s |
| **Transition** | The text moves up and shrinks to a mono label at the top of the screen: `drafts · 3` |
| **Components** | `SectionCard` |

## 05.1 · The drafts

| | |
|---|---|
| **Purpose** | Say the unsaid things, one at a time |
| **Emotional goal** | **Emotion:** "he never told me that." |
| **Visual composition** | A single message-input-style bar near the bottom third (a cream hairline border, `radius-full`, 90vw wide on mobile). Above it, the "sent" messages stack upward as quiet bubbles (`--night-800` fill, cream text in Fraunces `caption`, not Inter, so it reads as feeling rather than chat). |
| **Exact headline** | (none) |
| **Supporting text** | The draft lines, 3–5 of them, each ≤ 20 words: `[THING I NEVER SAY 1]`, `[THING I NEVER SAY 2]`, `[THING I NEVER SAY 3]`, optionally `[THING I NEVER SAY 4]` and `[THING I NEVER SAY 5]` |
| **CTA** | A small gold `send ↑` button inside the input bar, which she taps to send each draft. After the last one: `→` |
| **Interaction** | Each draft types itself into the input bar at a natural pace (~35ms/char, with tiny pauses at commas). The cursor blinks once after the text is complete, **then she taps `send`**, so she is the one who finally "sends" it. The bubble rises into the stack with a small mono `✓ sent · just now`. |
| **Animation** | Typing uses a caret in `--gold`. Send: the text lifts out of the bar into a bubble (500ms, `ease-out-soft`). Older bubbles drift up and fade to 60%. |
| **Transition** | After the last bubble, a 1.5s pause. Then one final line types itself into the bar and **isn't** sent. It stays there as the screen dims: *"okay. one more thing. read this slowly."* → the input bar morphs into the envelope's outline → 06.1 |
| **Desktop** | Column max width 520px, centered. `Enter` sends. |
| **Mobile** | The input bar sits above the safe area in the thumb zone, and bubbles stack above it. It never triggers the real keyboard (there's no actual input element; it's a styled display). |
| **Existing assets** | — |
| **New assets** | **3–5 short lines from Kesava** (required) |
| **Components** | `DraftComposer`, `DraftBubble`, `Caret` |
| **Fallback** | If Kesava provides no lines, section 05 collapses to a single pause screen: **"okay. one more thing."** / *"read this slowly."* / `open it →` (the original Pause beat), then 06. |

---

# 06 — The Letter
**Emotion: EMOTION → WARMTH.** *Kesava's own words, in their own language.*

> **Revised (as built):** a layered paper envelope (lined flap, hairline side folds, "Anjali" in handwriting, a dashed postmark `20.10 / 2026`) sealed with a poured wax seal. **She presses and holds the seal** — a thin gold ring fills; a quick tap asks her to "hold it a moment longer". The seal cracks in two, the flap swings up to show the lining, the letter rises out, the room lights up onto paper and the sheet settles into place.
> The sheet: paper grain, a letterhead (`a letter · for Anjali` / handwritten *20 October 2026*), the greeting and signature in handwriting, the body in serif at 18px/1.75. Paragraphs surface at **reading pace** (≈150ms per word of the previous paragraph, 1.9–5.2s); tap to show all; it never scrolls on its own. The key line keeps its highlighter; the signature is written on with a single rose underline.
> The ending: **fold it & keep it** — the letter slips back into the envelope, the flap closes, the seal is pressed on again, *"kept."* — or **read it again** (back to the top). The words are exactly `public/letter.txt`.

## 06.1 · The envelope

| | |
|---|---|
| **Purpose** | Turn reading into receiving, a physical gesture before the most intimate content |
| **Emotional goal** | A held breath |
| **Visual composition** | Night, with a single soft light from above onto a cream envelope (`--paper-200` body, `--paper-300` flap) centered at `min(84vw, 360px)`. A rose wax seal with a Fraunces italic "A". "for Chinnu" is handwritten on the envelope face in Caveat, `--ink`. The prompt sits below. |
| **Exact headline** | (on the envelope) *for Chinnu* |
| **Supporting text** | `tap to open` (mono, no pulse) |
| **CTA** | The envelope |
| **Interaction** | Tap the envelope |
| **Animation** | **Discovery:** the seal fades and lifts (400ms), the flap rotates open (`rotateX`, 900ms), and the letter sheet slides 40px up out of the envelope. |
| **Transition** | **Lights up:** the paper color blooms outward from the envelope until the whole screen is paper (1400ms). The envelope dissolves and the sheet settles into the page → 06.2 |
| **Desktop** | Hovering the envelope brightens the light slightly (no scale) |
| **Mobile** | The envelope sits at the vertical optical center, and the tap target is the whole envelope |
| **Existing assets** | — |
| **New assets** | Envelope and seal (built in code) |
| **Components** | `Envelope`, `WaxSeal`, `LightsUp` transition |

## 06.2 · The letter

| | |
|---|---|
| **Purpose** | Deliver the heart of the gift, fully readable, at her pace |
| **Emotional goal** | **Emotion → warmth:** seen, understood, maybe teary |
| **Visual composition** | A paper scene with fibre texture and desk-lamp falloff. The letter sheet (`--paper-50`) is centered with a max measure of 34em. At the top sits `20.10.2026` in mono `--ink-muted` with a hairline under it. Then the greeting, the body paragraphs in Fraunces `letter`, the closing, and the signature. The page scrolls naturally; there's no inner scroll box. |
| **Exact headline** | **Dear Chinnu ❤️** |
| **Supporting text** | The letter body from `public/letter.txt`: verbatim, **except** that the "tomorrow we meet" paragraph is replaced with the approved update (draft in Design System §19 S9), and the greeting changes to "Dear Chinnu ❤️" |
| **CTA** | After the signature: `→` (at +1.5s) |
| **Interaction** | Paragraphs reveal in sequence. **Tap anywhere to reveal all at once.** She can scroll freely at any time, and the page never auto-scrolls her. When new text appears below the fold, a small `↓` in `--ink-muted` shows at the bottom edge. Text is selectable. `←` returns to the timeline. |
| **Animation** | **Discovery:** each paragraph unmasks upward over 700ms, one every ~2.2s (a reading pace). The key line, *"Manaki konni rojul break ochina, communication tagina, mana friendship ade strength tho untundi."*, gets a `--rose-wash` highlighter swept behind it (800ms) as it appears. **Completion:** "Your friend always," and then **Kesava** is written on in Caveat with an ink-draw stroke (2200ms). |
| **Transition** | **Lights down:** the paper dims to night over 1600ms, and the signature is the last thing to fade → 07 |
| **Desktop** | The sheet has generous padding (64 / 80px) and a `shadow-sheet`, floating on the paper scene |
| **Mobile** | The sheet is full-bleed with 28px padding. Body text is 18px with 1.75 line height. The date and greeting are visible on first paint. |
| **Existing assets** | `public/letter.txt` (updated) |
| **New assets** | The approved replacement paragraph (Tenglish) |
| **Components** | `LetterSheet`, `RevealParagraph`, `Highlighter`, `SignatureDraw`, `ScrollHint` |

---

# 07 — One Last Surprise

> **Replaced (as built): "Before you leave…"** — after the letter is kept, three small paper cards: 🌸 *something nice* (a line from the letter), 🎁 *one last thing* (the song, *Yaaron*, and that Kesava picked it — or his voice note if one is added; a neutral fallback while the fallback track plays), 🫶 *for the future* (*"Twaralone manam definitely kalustham."* + the unchecked TODO, and the quiet *send something back* link). All three opened → `that's everything →`. The ticket and credits-roll screens below were retired; the git log now lives in the developer corner (see 08).

**Emotion: WARMTH.** *After reading Kesava's words, she hears their voice.*

## Concept (recommended)
A **voice note from Kesava**: 10–30 seconds of simply saying happy birthday, however it comes out. After a site full of designed words, a real voice is the most disarming thing possible. The audit already noted that this would outweigh any animation.

## 07.1 · "one last thing"

| | |
|---|---|
| **Purpose** | An unexpected, human finale beat after the letter |
| **Emotional goal** | **Warmth:** a smile through tears, "his actual voice" |
| **Visual composition** | Night with a soft lamp. Centered: the headline in `title` italic. Below it, a 72px glass circle play button with a slim waveform ring around it (static bars in `--cream-faint`). The duration sits in mono underneath. |
| **Exact headline** | **okay, one last thing.** |
| **Supporting text** | *this one I couldn't type.* Then the duration in mono: `[VOICE NOTE LENGTH]` |
| **CTA** | The play button (accessible name: "Play voice note from Kesava") |
| **Interaction** | Tap to play and tap again to pause. When it ends, `→` appears. |
| **Animation** | While playing, the waveform ring fills in `--gold` clockwise (the only motion). On end, the ring completes and softly glows (600ms). |
| **Sound** | The music ducks to 0.10 before playback (800ms) and returns to 0.45 after it ends (1500ms) |
| **Transition** | Dip → 08.1 |
| **Desktop / Mobile** | Identical, centered. On mobile the button sits in the thumb zone. |
| **Existing assets** | — |
| **New assets** | **`[VOICE NOTE]` audio file from Kesava** (e.g. `public/audio/voice-note.m4a`) |
| **Components** | `VoiceNote`, `useSound().duck()` |

### Fallback (if there's no voice note): "see you tomorrow"
This grows from the updated letter's own promise ("repu manam kalisinappudu…"), so nothing is invented.

| | |
|---|---|
| **Visual composition** | A small cream **ticket stub** print on night: Fraunces text, a perforated edge, and mono details |
| **Exact headline** | **see you tomorrow, chinnu.** |
| **Supporting text** | Mono lines, shown only if provided: `[TIME]` · `[PLACE]`. If neither is provided, only the headline and *"it'll feel like nothing changed."* (from the approved letter update) |
| **Interaction** | Tap the ticket and it tears along the perforation (a 500ms split), then `→` |
| **Components** | `TicketStub` |

---

# 08 — Final Ending

> **Replaced (as built): the quiet ending, no buttons.** *That's it.* → *No fancy ending.* → *Just…* → **HAPPY BIRTHDAY, / ANJALI. ❤** → *I'm really glad you're my friend.* → *— Kesava* (written on) → a faint *made with way too much code.* which, tapped, opens the developer corner (status, TODO, git log, *watch it again*). A tap fast-forwards to the finished frame. The song settles to a low level and keeps looping softly. About 18s.

**Emotion: MEMORABLE ENDING.** *The lights go down on a film she didn't want to end, and then it hands the conversation back to her.*

## 08.1 · End credits

| | |
|---|---|
| **Purpose** | Close the story with warmth and a wink, and let the developer-made nature show proudly for a moment |
| **Emotional goal** | A smile: "Kesava is such a nerd. I love this." |
| **Visual composition** | Night with the lavender dusk wash. Faint (18% opacity) photos from the timeline cross-dissolve slowly behind the text. The credits are two-column: mono roles on the left, Fraunces names on the right, centered as a block. |
| **Exact headline** | (no headline; the credits roll) |
| **Supporting text** | Credits (real facts only): `starring` · **Anjali (chinnu)**; `written & directed` · **Kesava**; `photography` · **our phones**; `music` · **"Yaaron" — KK**; `locations` · **a classroom, a rooftop, one bus seat, [LOCATION]**; `built with` · **next.js, too many late nights, and npm run dev**. Then a mono **`git log`** of the friendship, with every line derived from dates and captions already provided: `a3f9c1e  20.10.2023  cake. chaos. a lot of happiness.` · `7be21d0  26.01.2025  a good view, a good day` · `c04e8aa  01/02/25    one pair of earphones` · `e91f3b2  16.02.2025  in the background (on purpose)` · `HEAD     20.10.2026  still exactly the same` |
| **CTA** | `tap to skip` hint |
| **Interaction** | Auto-rolls (~28px/s), and a tap skips to 08.2 |
| **Animation** | **Completion:** a slow roll. Background photos cross-dissolve every 5s. |
| **Sound** | Swells to 0.65 |
| **Transition** | The last credit line (`HEAD … still exactly the same`) holds at center for 2s, then dissolves → 08.2 |
| **Desktop** | Two columns with a 48px gutter |
| **Mobile** | Roles stack above names (single column), with mono roles at 0.75rem. The `git log` block scrolls horizontally if it's too wide: it wraps the message column, but hashes and dates stay aligned. |
| **Existing assets** | Timeline photos (as backgrounds) |
| **New assets** | Optional `[LOCATION]` |
| **Components** | `Credits`, `GitLog`, `BackdropDissolve` |

## 08.2 · The last frame

| | |
|---|---|
| **Purpose** | A warm, lasting final image, and a way for her to answer |
| **Emotional goal** | Completion, warmth, and the urge to reply right now |
| **Visual composition** | Night, lamp. One print (the **earphones** photo, closing the loop with THE MOMENT) slightly above center and upright. Below it, the headline in Fraunces `title` italic, then two quiet pills side by side (stacked on narrow screens). A mono footer whisper sits at the bottom. |
| **Exact headline** | **Happy birthday. Stay the same. 💛** |
| **Supporting text** | Footer: `v2026.10.20 · for anjali` |
| **CTA** | Primary pill **`send something back`**, secondary pill **`watch again`** |
| **Interaction** | `send something back` opens WhatsApp via a `wa.me` link generated in code from the number constant (the number is never rendered on the page). The pre-filled message is `🥹❤️`, which she can edit before sending. `watch again` returns to 01.3 (the music continues; there's no second tap gate). |
| **Animation** | The print *arrives* with *developing*, the headline arrives at +600ms, and the pills at +1400ms. Nothing moves after that. The scene is still. |
| **Sound** | Settles to 0.45, and the song loops gently if she stays |
| **Transition** | None. This is the end. |
| **Desktop** | The pills sit side by side, with keyboard focus starting on `send something back` |
| **Mobile** | The pills stack full-width in the thumb zone, with `send something back` on top |
| **Existing assets** | `memories/earphones.jpg` |
| **New assets** | — |
| **Components** | `FinalFrame`, `ReplyLink` (builds `https://wa.me/919493168166?text=…`), `QuietPill` |

### Hidden layer
> **As built (all easter eggs):**
> - **System status** — the faint `v2026.10.20 · for anjali` line on the last frame is a button: tap it for `$ status --all` (friendship ● online · memories 100% · chaos 99.9% · good times ∞ · status never delete) and a `// todo` list whose only unchecked item is *do this again next year*. Esc / tap outside closes it.
> - **Tab title** — leave the tab and it reads *"come back, Anjali"*.
> - **Console** — the greeting, the status, the TODO, and `return "Happy Birthday, Anjali ❤️";`.
> - **Page source** — `author: Kesava`, `generator: way too much code`, and a non-executing note ending in the same `return` line.
> - Already present: the credits' `git log` and *"built with … npm run dev"*, the `~/memories/chaos_archive` path, the custom 404.
> Content lives in `src/app/data/story.js` (`systemStatus`, `devTodo`, `devReturn`).
- **DevTools console greeting** (on load): `hi chinnu. yes, I actually wrote all of this. happy birthday. — k`
- **Custom 404:** *"this page doesn't exist."* / *"but we do."* / `← go back`

---

## Asset checklist

### Existing (ready)
| Asset | Used in |
|---|---|
| `memories/rooftop.jpg` | 01.0 (OG), 04 |
| `memories/cake-2023.jpg` | 03 · exhibit 01 |
| `memories/sunglasses.jpg` | 03 · exhibit 02 |
| `memories/selfie-background.jpg` | 03 · exhibit 03 |
| `memories/group-selfie-1.jpg`, `group-selfie-2.jpg` | 03 · exhibits 04–05 |
| `memories/funny-outdoors.jpg` | 03 · exhibit 06 |
| `memories/standing-outdoors.jpg` | 04 · memory 1 |
| `memories/sitting-together.jpg` | 04 · memory 2 |
| `memories/earphones.jpg` | 04 · memory 4 (THE MOMENT), 08.2 |
| `images/video-1.mp4` | 04 · memory 5 |
| `memories/laughing-outdoors.jpg` | 04 · memory 6 (final) |
| `letter.txt` | 06.2 (needs the approved paragraph update) |
| `audio/happy-birthday.mp3` | Fallback soundtrack only |

`audio/happy-birthday--song.mp3` is no longer used.

### Needed from Kesava
| Placeholder | Where | Required? | If missing |
|---|---|---|---|
| Yaaron audio file (`[SONG PATH]`) | Global | **Yes** | The fallback track plays |
| Approved letter paragraph | 06.2 | **Yes** | The current letter text is used, with only the greeting changed |
| `[THING I NEVER SAY 1–5]` | 05.1 | Strongly recommended | 05 collapses to a single pause screen |
| `[VOICE NOTE]` | 07.1 | Strongly recommended | The "see you tomorrow" ticket |
| `[DATE]` for the undated photos | 03, 04 | Optional | The date line is omitted |
| `[INSIDE JOKE]` annotations | 03 | Optional | No annotation |
| `[VIDEO CAPTION]` | 04 · memory 5 | Optional | No caption |
| `[AGE]` | 02.3 | Optional | No supporting line |
| `[TIME]`, `[PLACE]` | 07 fallback | Optional | Omitted |
| `[LOCATION]` | 08.1 credits | Optional | Omitted |
| Approval of the title lines (01.3) and credits wording (08.1) | — | Yes | The drafts are used |

### To be generated during implementation
The OG image, the favicon, the video poster frame, the candle/smoke SVG, the envelope and wax seal, and the grain and paper textures.

---

## Component inventory

| Layer | Components |
|---|---|
| **Shell** | `Experience` (scene state machine), `SceneShell`, `NightSurface`, `PaperSurface`, `Grain`, `ChapterMarker`, `SoundProvider` / `SoundToggle`, `useProgress`, `usePreload`, `useSwipe`, `useReducedMotion` |
| **Primitives** | `TextButton`, `QuietPill`, `TapToAdvance`, `HandNote`, `Counter`, `SectionCard`, `PhotoPrint`, `CaptionBlock` |
| **01** | `CountdownGate`, `IntroScreen`, `TitleSequence` |
| **02** | `NameReveal`, `Candle`, `Bloom`, `EmberBurst` |
| **03** | `ArchiveDesk`, `ArchivePile` |
| **04** | `TimelineReel`, `TimelineRule`, `FilmFrame` |
| **05** | `DraftComposer`, `DraftBubble`, `Caret` |
| **06** | `Envelope`, `WaxSeal`, `LetterSheet`, `RevealParagraph`, `Highlighter`, `SignatureDraw`, `ScrollHint` |
| **07** | `VoiceNote` or `TicketStub` |
| **08** | `Credits`, `GitLog`, `BackdropDissolve`, `FinalFrame`, `ReplyLink` |
| **Meta** | `opengraph-image`, `icon.svg`, `not-found`, console greeting |
| **Data** | `content/memories.js` (archive and timeline entries: file, date, caption, alt, note), `content/drafts.js`, `content/config.js` (birthday date, song path, WhatsApp number, voice-note path) |

---

# THE MOMENT SHE SHOULD REMEMBER

## One pair of earphones.

On **01/02/25** they shared one pair of wired earphones on a bus: one earbud each, the cable running between them, sunlight through the window bars. The photo doesn't even show their faces properly. It's just two shoulders, a cable, and an ordinary afternoon. Kesava's caption says it exactly: *"one more ordinary day that somehow became ours."*

The website quietly turns her into that photo again.

### The setup: 01.2, the very first screen
> **hi chinnu.**
> *put your earphones in.*

It reads like a normal, practical instruction ("the site has music"). She puts her earphones in, and "Yaaron", a song about friends, starts playing in her ears. She won't think about it again.

### The payoff: Our Timeline, memory 4
After the rooftop photo, the next swipe doesn't show a photo straight away:

1. **The lamp dims** and the timeline rule fades to nearly nothing. The screen is almost black.
2. **The music rises slightly** (0.50 → 0.60), filling her earphones.
3. A single mono line arrives, centered and alone: `01/02/25`
4. Beat (1.2s).
5. The earphones print **develops slowly**, longer than any other photo (2000ms instead of 1400ms): the cable, the two shoulders, the light through the bars.
6. Below it, the caption arrives:
   *"01/02/25 — one more ordinary day that somehow became ours."*
7. Then, after a 1.5s pause, one small Caveat annotation appears beside the print in rose. It's the only extra line in the whole timeline:
   ***you're wearing earphones right now, aren't you?***

That's when it lands: she's listening to a friendship song through her earphones, looking at the day they shared one pair. The website wasn't just *showing* her a memory; for a few seconds it **recreated** it. It's the one moment where a designer's choice (the intro line), a developer's choice (the soundtrack) and a friend's memory (the photo) all meet.

### The echo: 08.2, the last frame
The final screen uses the same earphones photo under *"Happy birthday. Stay the same. 💛"*, so the image she ends on is the moment she'll remember.

### Why this, and not the candle or the letter?
- **The candle** is joyful, but every birthday has a candle.
- **The letter** is the emotional core and will move her, but she knows Kesava can write words.
- **The earphones moment** is something only these two people share, staged in a way only a website could do it. It's specific, quiet, a little clever, and entirely theirs. It's the thing she'll describe to someone later: *"and then he told me to put my earphones in, and I didn't get it until…"*

### Protecting the moment
- Nothing else in the experience mentions earphones or points toward the photo, so the payoff isn't spoiled.
- The annotation line is the only rose Caveat note in section 04, so it stands alone.
- If she has the sound muted, the annotation still works (the instruction was given, so she'll still make the connection), and the music level change is simply skipped.
- In reduced-motion mode the sequence keeps its **pauses** (the beats are timing, not motion) but uses plain fades.
- The annotation line is a design suggestion. Kesava should approve it, since it speaks in Kesava's voice.
