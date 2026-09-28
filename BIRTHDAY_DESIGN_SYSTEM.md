# Birthday Design System — "for Anjali"

> **Note (28 Sep 2026):** the nickname “Chinnu” has since been removed at Kesava’s request — the site only ever calls her **Anjali**. Mentions of “Chinnu” below are kept as the historical record of earlier drafts.

> **Brief:** *"A beautifully designed private digital memory space created by a developer for his best friend."*
>
> This builds on `BIRTHDAY_EXPERIENCE_AUDIT.md`. The audit covers **what** the experience is. This document covers **how it looks, moves, sounds and feels**. No application code has been changed.

---

## 0. The idea in one paragraph

The site is a **private screening**. Its dark, cinematic "night" scenes feel like a small cinema room where the lights have just gone down, and her name, a candle and the photos are the only lit things in it. When it's time to say something sincere, the lights come up onto **warm paper**, a letter held in the hands. The palette, type and motion all come from those two materials, **night and paper**, plus one source of light: **candlelight gold**. Everything else is restraint.

**Three words to check every decision against: _warm · quiet · hers._**

If an element isn't warm, isn't quiet, or could have been made for anyone else, it doesn't belong.

---

## 1. Color system

### 1.1 Core surfaces

| Token | Hex | Use |
|---|---|---|
| `--night-950` | `#0E0C0B` | Base of every cinematic scene (a warm black, never pure `#000`) |
| `--night-900` | `#15120F` | Raised night surfaces, video letterbox |
| `--night-800` | `#1F1A16` | Hover/pressed states on night, subtle panels |
| `--night-700` | `#2B2520` | Hairline-strong dividers on night |
| `--paper-50` | `#FBF7F0` | Letter sheet highlight, photo print border |
| `--paper-100` | `#F4ECE0` | **Primary paper surface** (letter scene background) |
| `--paper-200` | `#E9DDCB` | Envelope body, paper shadows' mid-tone |
| `--paper-300` | `#D8C6AD` | Envelope flap, paper edges |

### 1.2 Text

| Token | Value | On | Contrast | Use |
|---|---|---|---|---|
| `--cream` | `#F2EADF` | night | ~16:1 | Primary text on night |
| `--cream-muted` | `rgb(242 234 223 / 0.66)` | night | ~7:1 | Secondary copy, captions |
| `--cream-faint` | `rgb(242 234 223 / 0.40)` | night | ~3.6:1 | **Large or decorative only:** hints ("tap to skip"), meta, credits labels |
| `--ink` | `#2A221D` | paper | ~13:1 | Letter body, headings on paper |
| `--ink-muted` | `#6B5D52` | paper | ~5.4:1 | Dates, secondary copy on paper |
| `--ink-faint` | `rgb(42 34 29 / 0.38)` | paper | — | Decorative only (rules, watermark "A") |

### 1.3 Accents (restrained, each with one job)

| Token | Hex | Job | Rule |
|---|---|---|---|
| `--gold` | `#D9A441` | **Light and warmth.** The candle, focus rings, primary action arrows, the progress mark | The only accent that can appear on every scene, but never as a large fill |
| `--gold-soft` | `#E8C47A` | Candle glow falloff, bloom highlights | Used as light, in radial gradients at ≤ 20% alpha |
| `--ember` | `#E0773A` | Flame core only | Nowhere else |
| `--rose` | `#C98C8C` | **Affection.** The "chinnu" annotation, the one highlighted letter line, the wax seal | At most 2 appearances per scene |
| `--rose-wash` | `rgb(201 140 140 / 0.18)` | Highlighter behind the key letter sentence | Letter only |
| `--lavender` | `#A99DC4` | **Dusk.** A faint tint in the credits sky and on the countdown | Only in the credits and countdown scenes, ≤ 10% alpha washes |

### 1.4 Color rules
- **No multi-stop gradients.** Gradients exist only as *light* (radial falloffs from a light source) or *vignettes*. A linear pink→purple→indigo anything is banned.
- **No pure white (`#FFF`) and no pure black (`#000`).** Everything is warm-shifted.
- **Accent budget per screen:** gold plus at most one of rose or lavender.
- **Photos are the most colorful thing on screen.** The UI never competes with them in saturation.
- The existing pink `#FF69B4` / `#FF1493` / `#9370DB` family is fully retired.

### 1.5 Tailwind v4 token sketch (for implementation)

```css
@theme {
  --color-night-950: #0E0C0B;  --color-night-900: #15120F;
  --color-night-800: #1F1A16;  --color-night-700: #2B2520;
  --color-paper-50:  #FBF7F0;  --color-paper-100: #F4ECE0;
  --color-paper-200: #E9DDCB;  --color-paper-300: #D8C6AD;
  --color-cream: #F2EADF;      --color-ink: #2A221D;  --color-ink-muted: #6B5D52;
  --color-gold: #D9A441;       --color-gold-soft: #E8C47A;  --color-ember: #E0773A;
  --color-rose: #C98C8C;       --color-lavender: #A99DC4;
}
```

---

## 2. Typography system

### 2.1 Typefaces (four roles, loaded via `next/font/google`)

| Role | Typeface | Why |
|---|---|---|
| **Display & Letter** | **Fraunces** (variable: `opsz`, `wght`, `SOFT`, italic) | A warm, slightly old-style serif with a "soft" axis that takes the sharpness off. It's editorial at large sizes and readable at letter size thanks to optical sizing, and it echoes the serif date stamp on the 01/02/25 photo. |
| **Interface** | **Inter** (variable) | Invisible, precise and neutral. Used for buttons, labels and small UI. It never shows up as "a voice". |
| **Annotation** | **Caveat** (500–600) | Kesava's "hand". Short personal notes only. |
| **Developer** | **JetBrains Mono** (400) | The quiet developer signature: dates, counters, credits metadata, the console greeting. |

Loading: `display: swap` with subset `latin` only. Fraunces and Inter are preloaded; Caveat and Mono are not (they're first needed a few seconds in).

### 2.2 Type scale (fluid, mobile-first)

| Token | Font | Size | Line height | Tracking | Use |
|---|---|---|---|---|---|
| `name` | Fraunces 300, opsz 144, SOFT 100 | `clamp(4.5rem, 20vw, 11rem)` | 0.9 | −0.03em | **"Anjali"**, used exactly once per scene where it appears |
| `display` | Fraunces 350, opsz 96 | `clamp(2.5rem, 9vw, 5rem)` | 1.0 | −0.02em | "Happy Birthday, Chinnu", countdown numbers |
| `title` | Fraunces 400 italic, opsz 48 | `clamp(1.75rem, 6vw, 2.75rem)` | 1.15 | −0.01em | Title-sequence lines, "read this slowly." |
| `caption` | Fraunces 400 italic, opsz 18 | `clamp(1.0625rem, 4.2vw, 1.25rem)` | 1.45 | 0 | Photo captions (the sentences Kesava wrote) |
| `letter` | Fraunces 380, opsz 14–18, SOFT 50 | `1.125rem` → `1.1875rem` ≥ 768px | 1.75 | 0.003em | Letter body |
| `ui` | Inter 500 | `0.9375rem` | 1.3 | 0.01em | Buttons, choices |
| `note` | Caveat 600 | `clamp(1.375rem, 6vw, 1.75rem)` | 1.1 | 0 | "chinnu", "remember this?", signature |
| `meta` | JetBrains Mono 400 | `0.75rem` | 1.4 | 0.08em, uppercase | Date stamps, "04 / 11", credits labels |

### 2.3 Typography rules
- **Lowercase voice.** UI and title lines are written in lowercase ("hi chinnu.", "okay. one more thing."). It reads as a message from Kesava, not a product. Proper names and the letter keep normal casing.
- **Hierarchy comes from size and weight, not color.** Headings are never gradient-filled, glowing or outlined.
- **One typographic hero per screen.** If "Anjali" is on screen, nothing else is larger than `title`.
- **Measure:** the letter caps at `34em` (~62 characters), and captions at `28em`.
- **Emoji live only in the letter** (Kesava's own) and the pre-filled WhatsApp reply. Never in headings, buttons or UI.
- **Punctuation:** real ellipses (…), curly quotes (“ ”), en/em dashes. Dates are written `20.10.2023` in `meta` style, except the 01/02/25 photo, which keeps its own `01/02/25`.

---

## 3. Font usage map

| Where | Font |
|---|---|
| "hi chinnu." (intro) | Fraunces `title` italic |
| "Anjali" reveal | Fraunces `name` |
| "chinnu" under the name | Caveat `note`, in rose |
| Countdown digits | Fraunces `display`, tabular figures (`font-variant-numeric: tabular-nums`) |
| Countdown labels (days/hrs/min/sec) | JetBrains Mono `meta` |
| "Happy Birthday, Chinnu" | Fraunces `display` |
| Photo date | JetBrains Mono `meta` |
| Photo caption | Fraunces `caption` italic |
| Short annotation ("remember this?") | Caveat `note` |
| Letter body | Fraunces `letter` |
| Letter signature "Kesava" | Caveat, 2.25rem, with an ink-draw animation |
| Buttons | Inter `ui` |
| Credits roles | JetBrains Mono `meta` |
| Credits names | Fraunces `title` (non-italic) |
| Console greeting, version string | JetBrains Mono |

**Caveat rule:** at most **6 words** per use. Anything longer goes in Fraunces italic. It's a hand, not a paragraph font.

---

## 4. Spacing scale

It's a 4px base, but the experience mostly uses the **generous** end: one idea per screen, surrounded by air.

| Token | px | Typical use |
|---|---|---|
| `space-1` | 4 | Icon-to-label gap |
| `space-2` | 8 | Meta to caption |
| `space-3` | 12 | Button inner vertical |
| `space-4` | 16 | **Mobile side gutter (minimum)**, stacked small elements |
| `space-6` | 24 | Button inner horizontal, paragraph spacing in the letter |
| `space-8` | 32 | Photo to caption block |
| `space-12` | 48 | Between title lines, section blocks |
| `space-16` | 64 | Top/bottom breathing room on mobile scenes |
| `space-24` | 96 | Desktop scene padding |
| `space-32` | 128 | Credits line spacing, the silence around "Anjali" |

**Layout rules**
- Side gutter: `max(16px, env(safe-area-inset-left))` on mobile and `clamp(24px, 6vw, 96px)` on larger screens.
- Scene content is vertically centered on the **optical center** (≈ 45% from the top, not 50%), so text doesn't feel like it's sinking.
- If an element can take more whitespace, give it more.

---

## 5. Border radius

The corners are nearly square. Premium, physical objects (prints, paper, envelopes) have tight corners. Large soft radii are what made the template feel like an app.

| Token | Value | Use |
|---|---|---|
| `radius-print` | 2px | Photo prints, envelope |
| `radius-sm` | 6px | Video frame, small panels |
| `radius-md` | 12px | Glass controls panel, chooser card on intro |
| `radius-sheet` | 4px | Letter sheet (paper has sharp-ish corners) |
| `radius-full` | 9999px | Circular icon buttons (sound, play), pill buttons |

---

## 6. Shadows

Shadows are **warm-tinted** (from `night-950`, never neutral grey), **layered** (a tight contact shadow plus a soft ambient one), and exist only to make paper objects feel physical.

| Token | Value | Use |
|---|---|---|
| `shadow-print` | `0 1px 2px rgb(14 12 11 / .35), 0 12px 32px -8px rgb(14 12 11 / .55)` | Photo prints on night |
| `shadow-print-lift` | `0 2px 4px rgb(14 12 11 / .30), 0 24px 56px -12px rgb(14 12 11 / .60)` | The active print in the reel |
| `shadow-sheet` | `0 1px 1px rgb(42 34 29 / .08), 0 18px 48px -18px rgb(42 34 29 / .28)` | Letter sheet on paper |
| `shadow-envelope` | `0 2px 3px rgb(14 12 11 / .30), 0 30px 60px -20px rgb(14 12 11 / .65)` | Envelope on night |
| `glow-candle` | `radial-gradient(circle at 50% 40%, rgb(232 196 122 / .22), transparent 55%)` | Light, not a box-shadow: the candle's pool of light |
| `focus-ring` | `0 0 0 3px var(--night-950), 0 0 0 5px var(--gold)` (on paper: `--paper-100` inner) | Keyboard focus |

**Never:** colored glows on text, neon box-shadows, or a shadow on a button.

---

## 7. Card styles

There are only four "card" types. Anything else is plain type on a surface.

### 7.1 Photo print *(night scenes)*
- Background `--paper-50`, padding `10px 10px 12px` (mobile `8px`). The border is the paper itself.
- `radius-print` + `shadow-print`. The active print gets `shadow-print-lift`.
- A resting rotation between **−1.5° and +1.5°**, fixed per photo (deterministic, not random on every render).
- The image inside has a very subtle inner edge: `inset 0 0 0 1px rgb(42 34 29 / .08)`.

### 7.2 Letter sheet *(paper scene)*
- Background `--paper-50` on a `--paper-100` scene, so the sheet reads as a slightly brighter page.
- Padding: `clamp(28px, 7vw, 64px)` horizontal, `clamp(40px, 8vw, 80px)` vertical.
- `radius-sheet` + `shadow-sheet` and a faint paper-fibre texture (see §11).
- A single hairline rule (`--ink-faint`) under the date line at the top.
- No icons, no corner decorations, no border.

### 7.3 Envelope *(night scene)*
- It's built from shapes, not icons: a body in `--paper-200`, a flap in `--paper-300`, a crisp fold shadow, `shadow-envelope`.
- A **wax seal** in `--rose`: a 44px circle with a Fraunces italic "A" pressed in, showing a subtle darker inner ring.
- Its size is `min(84vw, 360px)` wide at a 3:2 ratio.

### 7.4 Glass control *(the only glass in the system)*
- This is used **only** where a control sits over a photo or video: the sound toggle, the progress chip and the video play button.
- Background `rgb(21 18 15 / .45)`, `backdrop-filter: blur(12px) saturate(120%)`, border `1px solid rgb(242 234 223 / .10)`.
- If `backdrop-filter` is unsupported, it falls back to `rgb(21 18 15 / .78)`.
- Glass is **never** used for content panels, text blocks or the letter.

---

## 8. Button styles

Buttons should feel like invitations in Kesava's voice, not a checkout.

### 8.1 Primary: "text + arrow"
- Inter `ui`, in `--cream` on night or `--ink` on paper, with a gold `→` 14px after the label.
- Hit area at least **48px tall**, padding `12px 24px`, and no visible container at rest.
- A 1px underline sits at 30% opacity. On hover or focus it goes to 100% and the arrow moves `translateX(3px)` over 240ms. Pressed state is opacity 0.7.
- Example labels: `begin →`, `okay, next →`, `open it →`, `keep going →`.

### 8.2 Quiet pill (secondary and final actions)
- `1px solid` `--cream-faint` on night or `--ink-faint` on paper, `radius-full`, padding `12px 22px`, Inter `ui`.
- On hover the border shifts to `--gold` and the background to `rgb(217 164 65 / .06)`.
- Used for `watch again`, `start from the beginning`, `send something back`.

### 8.3 Icon button (circular)
- A **44px** circle (a 48px hit area on touch), in the glass-control style. Lucide icon at 18px, stroke 1.5.
- Used for sound and video play (64px for play).

### 8.4 Tap-to-advance surface
- Title-sequence and pause scenes: **the whole screen is the button.**
- A `meta`-style hint (`tap to continue` / `tap to skip`) fades in at the bottom in `--cream-faint`, 2.5s after the scene settles. It never pulses.

### 8.5 Button rules
- **Never:** gradient fills, hover scale, spring pop-in, or icons on both sides of a label.
- Only one primary action is visible per scene.

---

## 9. Photo treatment

Photos are **physical memories**: prints laid on a dark table under warm light.

### 9.1 Source handling (prepared in `public/memories/`)
- The baked-in black letterboxing has been cropped from `image-5`, `IMG-20250216-WA0003` and `image-6`.
- `image-6` (01/02/25) has been **rotated upright**. Its baked-in date is cropped out and re-set digitally in `meta` style.
- Every image is resized to at most 1600px on its long edge, as progressive JPEG at quality ~84 (38–306 KB each). The originals in `public/images/` are untouched.
- The five photos added on 25 Sep 2026 went through the same pipeline (resize only, no borders to crop). Any future photos should too: at most 1600px, and ≤ 350 KB where possible.

### 9.2 Visual grade
- The photos aren't filtered heavily. Their natural color is the point. A shared "warm room" overlay sits on top: `rgb(232 196 122 / .05)` with `mix-blend-mode: soft-light`, plus the global grain.
- The B&W sunglasses photo stays B&W.

### 9.3 Framing
- Mobile: max `86vw` wide and `60dvh` tall, with the aspect ratio preserved (`object-fit: contain` inside the print, not `cover`, so nothing gets cropped away).
- Desktop: max `min(560px, 44vw)` wide and `68vh` tall.
- The caption block sits **below** the print, never overlaid on the photo.

### 9.4 Motion (memory)
- **"Developing" arrival:** the print rises 16px and fades in over 900ms. The image inside starts at `saturate(0.6) brightness(1.08)` and settles to normal over 1400ms, like a print developing. This is the core metaphor for "memory".
- **Ken Burns:** a slow `scale(1.0 → 1.045)` with a slight translate, over 14s ease-in-out, on the active photo only, played once rather than looped.
- No 3D flips, cubes, or parallax tilt on device motion.

### 9.5 Captions (Kesava's words, used verbatim)

| Order | Photo | File | Date (`meta`) | Caption |
|---|---|---|---|---|
| — | Birthday cake (own scene, §19 S5) | `memories/cake-2023.jpg` | `20.10.2023` | "The birthday girl, caught somewhere between cake, chaos and a lot of happiness." |
| 1 | Standing together outdoors (campus, by the pillar) | `memories/standing-outdoors.jpg` | — | "Back when a normal college day could turn into a memory." |
| 2 | Sitting together (classroom) | `memories/sitting-together.jpg` | — | "No special occasion. Just us, existing in the same frame." |
| 3 | B&W sunglasses selfie | `memories/sunglasses.jpg` | — | "Somehow, even the random days became memories worth keeping." |
| 4 | Rooftop | `memories/rooftop.jpg` | `26.01.2025` | "A good view, a good day, and one of my favourite people." |
| 5 | Shared earphones | `memories/earphones.jpg` | `01/02/25` | "01/02/25 — one more ordinary day that somehow became ours." *(the date sits in the caption itself, so the `meta` date is hidden)* |
| 6 | Selfie, Kesava in the background | `memories/selfie-background.jpg` | `16.02.2025` | "You take the selfie. I just make sure I'm in the background." |
| 7 | Group selfie (campus, by the buses) | `memories/group-selfie-1.jpg` | — | "Some memories come with extra people, extra noise and extra stories." |
| 8 | Second group selfie | `memories/group-selfie-2.jpg` | — | "Same people, same chaos, another memory saved." |
| 9 | Funny outdoor photo (mid-conversation, thumbs up) | `memories/funny-outdoors.jpg` | — | "I don't even remember what we were talking about, but this photo remembers the laughter." |
| 10 | Video | `images/video-1.mp4` | — | *(no caption, just the film)* |
| 11 | Laughing outdoor photo (both laughing) | `memories/laughing-outdoors.jpg` | — | **"And somehow, after all this time, it still feels exactly the same."** *(the reel's closing line, held longer)* |

The dates come from the WhatsApp filenames. All 11 photos are now present (the five new WhatsApp images were processed into `public/memories/`). The implementation should still skip any entry whose file is missing, so the reel can grow or shrink safely. The two group selfies are near-identical, so Kesava may prefer to keep only one.

**Alt text** is written for every photo in plain description, for example: *"Anjali and Kesava sharing one pair of wired earphones on a bus, sunlight through the window bars."*

---

## 10. Video treatment

- **Framed as film, not a print.** The frame sits on `--night-900` with `radius-sm` and no paper border, which separates it clearly from the photos. Its native aspect ratio is preserved.
- **Poster:** a frame from the clip, graded with the same warm overlay. It still needs capturing, since no media tools were available for the audit. Until then the poster is the first frame via `preload="metadata"`.
- **Play control:** a 64px glass circle with a Lucide `Play` icon at 22px, and a `meta` label under it reading `press play · sound on`.
- **Once playing,** native controls take over (reliable on mobile), with `playsInline`.
- **Music ducking:** the soundtrack fades to 0 over 800ms when the video starts, and back to the scene level over 1500ms on pause or end. The music is never hard-stopped.
- **No autoplay** with sound, and no muted autoplay loop. The video is a deliberate moment she chooses.
- The video pauses automatically when she leaves the slide.

---

## 11. Background treatment

### 11.1 Night
1. Base `--night-950`.
2. **Vignette:** `radial-gradient(ellipse at 50% 45%, transparent 40%, rgb(0 0 0 / .45) 100%)`.
3. **Lamp:** a single warm light source above center: `radial-gradient(circle at 50% 35%, rgb(232 196 122 / .06), transparent 60%)`. In the candle scene the candle *is* the lamp, and its glow grows and shrinks with the flame.
4. **Grain:** a static SVG `feTurbulence` noise tile (baseFrequency ≈ 0.8, 2 octaves), fixed and `pointer-events: none`, at `opacity: .07` with `mix-blend-mode: overlay`. The grain is **static**, not animated (for battery and calm).

### 11.2 Paper
1. Base `--paper-100`.
2. **Fibre:** a similar noise tile at `opacity: .05` with `mix-blend-mode: multiply`.
3. **Edge falloff:** `radial-gradient(ellipse at 50% 40%, transparent 55%, rgb(42 34 29 / .08) 100%)`, like a page under a desk lamp.

### 11.3 Credits sky
`--night-950` with a very faint `--lavender` wash at the top (`rgb(169 157 196 / .06)`), like the last light after sunset.

### 11.4 Rules
- No blurred color blobs, no floating particles, no animated backgrounds.
- `background-attachment: fixed` is banned (it breaks on iOS). Use fixed-position layers instead.

---

## 12. Animation principles

### The philosophy
**Less animation, more intentional animation.** Every movement must answer *"what does this mean?"* If the answer is "it looks cool", cut it.

### 12.1 Six meanings, six motions

| Meaning | Motion | Spec |
|---|---|---|
| **Arrival:** something new is here | *Fade + rise + unblur* | opacity 0→1, y 12px→0, blur 6px→0 · 900ms · `ease-out-soft` |
| **Discovery:** she uncovered something | *Reveal / unmask* | clip-path or mask wipe from bottom (letter paragraphs) or envelope flap rotation · 700–1000ms · `ease-in-out-soft` |
| **Memory:** this is the past | *Developing + Ken Burns* | saturation 0.6→1 over 1400ms, scale 1→1.045 over 14s, once |
| **Emotion:** feel this | *Slowness + light* | the name reveal (2400ms tracking-in, from letter-spacing 0.08em to −0.03em, plus opacity), the bloom after the candle (radial light 0→1→0.3 over 2200ms) |
| **Transition:** we're moving on | *Dip through black / lights up / lights down* | see §13 |
| **Completion:** this chapter is finished | *Ink draw / settle* | the signature stroke draw (2200ms), the final credits resolve, the last frame's arrival |

### 12.2 Tokens

| Token | Value |
|---|---|
| `dur-press` | 120ms |
| `dur-ui` | 240ms |
| `dur-arrive` | 900ms |
| `dur-scene` | 1200ms |
| `dur-cinematic` | 2200–2400ms |
| `ease-out-soft` | `cubic-bezier(0.22, 1, 0.36, 1)` |
| `ease-in-out-soft` | `cubic-bezier(0.65, 0, 0.35, 1)` |
| `ease-exit` | `cubic-bezier(0.4, 0, 1, 1)` |
| `stagger` | 140ms between sibling arrivals |

### 12.3 Budgets and rules
- **Exits are faster than entrances:** an exit takes about 60% of its entrance duration.
- **No more than 3 elements arrive together**, staggered.
- **One continuous loop per screen, at most**, and only when it means something: the candle flame, and the sound indicator while music plays. Nothing else loops.
- **No springs with overshoot, no bounce, no wobble, no rotation loops, no pulsing.**
- **Hover** changes color, opacity or a 3px arrow nudge only. It never scales.
- Animate only `opacity`, `transform` and `filter` (limit `filter` to single elements), so it stays GPU-cheap on mid-range Android phones.
- **Every timed animation that blocks content can be skipped with a tap.**

---

## 13. Transition principles

The experience cuts between scenes like film, **never slides like a carousel.**

| From → To | Transition | Timing |
|---|---|---|
| Night → Night | **Dip through black:** out to `--night-950`, hold, in | 500ms out · 200ms hold · 900ms in |
| Night → Paper (pause → envelope → letter) | **Lights up:** paper glows up from the envelope's center outward | 1400ms `ease-in-out-soft` |
| Paper → Night (letter → credits) | **Lights down:** paper dims to night, the last line of the letter lingers a moment | 1600ms |
| Within the reel (photo → photo) | **Cross-dissolve with drift:** the outgoing print fades and drifts 24px in the swipe direction, the incoming one arrives (§9.4) | 500ms out, 900ms in, overlapping by 200ms |
| Title lines | **Dissolve in place:** each line fades out before the next fades in, and they never overlap | 700ms in · hold 1800–2600ms · 500ms out |
| Candle → celebration | **Breath:** flame out, 600ms of darkness and near-silence, then the bloom | see §19 S4 |

**Rules**
- Only one scene is visible at a time (`AnimatePresence mode="wait"` style).
- Transitions and audio move together: every scene change nudges the music level (§16), so visuals and sound "cut" as one.
- Pressing back plays the same transition. It never teleports.

---

## 14. Mobile design rules

**The primary device is her phone, very likely inside WhatsApp's in-app browser.** Design at **375 × 740** first, then scale up.

1. **Viewport:** use `100dvh` (with a `100vh` fallback), and respect `env(safe-area-inset-*)` on every edge.
2. **Single column, always.** No side-by-side layouts under 768px.
3. **Thumb zone:** every control sits in the bottom 35% of the screen, except the sound toggle (top-right, which is used rarely).
4. **Touch targets:** at least 44 × 44px, with 8px or more between targets.
5. **Text:** a 16px minimum for anything she's meant to read. The letter is 18px.
6. **Gestures:** tap to advance everywhere, plus horizontal swipe in the reel (with a threshold of at least 48px, and a vertical-scroll guard). No long-press, pinch or shake.
7. **No hover dependence.** Every hover affordance has a visible resting equivalent.
8. **Landscape phones:** the letter stays readable (scrolls), and prints size to `60dvh` tall. Nothing is locked to portrait.
9. **Performance budget:** interactive in under 2.5s on 4G. Images ≤ 350 KB, fonts ≤ 4 files preloaded, and `backdrop-filter` on no more than 2 small elements.
10. **In-app browser realities:** audio only after a tap, `playsInline` video, no reliance on `localStorage` (wrap it in try/catch), and it works without a Service Worker.
11. **Desktop is an enhancement:** more whitespace and larger type, with the same single-column story. Keyboard support is added (§15).

---

## 15. Accessibility rules

- **Contrast:** body text is AA at minimum (the tokens in §1.2 are already checked). `--cream-faint` is used only for large or decorative text.
- **Reduced motion (`prefers-reduced-motion: reduce`):** every motion becomes an opacity fade of 200ms or less. There's no Ken Burns, no developing effect, no blur, and no signature draw (it simply appears). The credits show as a static list, the letter shows in full at once, and the flame is still (a soft static glow).
- **Keyboard:** `Enter` / `Space` / `→` advance, `←` goes back (reel and letter), `M` toggles sound, and `Esc` skips a timed sequence. Focus is always visible (the gold ring, §6).
- **Semantics:** each scene is a `<section>` with an accessible name. "Anjali" is the page's `h1` in the name scene, and each scene title is an `h2`. The letter is a `<article>`.
- **Screen readers:** scene changes are announced politely (`aria-live="polite"`). Decorative layers (grain, glow, envelope art) are `aria-hidden`. The candle button reads "Blow out the candle".
- **Alt text** is written for every photo (§9.5). The video has an `aria-label`.
- **Audio is never required:** every word is on screen. Sound is always one tap away from off.
- **Selection:** letter text is selectable (`user-select: text`). The template's global `user-select: none` is removed.
- **No flashing:** nothing flashes more than 3 times a second. The bloom is a single slow rise.
- **Language:** `<html lang="en">`. The Tenglish letter stays in Latin script, and Fraunces covers it fully.

---

## 16. Music interaction

**Soundtrack: "Yaaron" by KK.** It's the only song, playing continuously from the first tap to the last frame.

- **Source:** one config value (e.g. `SONG_SRC = "/audio/yaaron.mp3"`), set once Kesava adds the file. **Fallback:** if that file is missing or fails to load, the existing `/audio/happy-birthday.mp3` plays in its place without any error message, so there's never dead air.
- **Start:** only after her tap on the intro screen (which also satisfies browser autoplay rules). It fades in from 0 to the intro level over 3s. Music is never started at full volume.
- **Looping:** if she's still exploring when the song ends, it fades out for 2s, rests 1s, and restarts with a 3s fade-in.
- **Levels by scene** (0–1 gain, all changes ramped over 1.2–2s so they're never abrupt):

| Scene | Level | Why |
|---|---|---|
| Countdown | — (silent) | No gesture yet, and anticipation is quiet |
| Intro → titles | 0.55 | Arrival |
| Candle (before the tap) | 0.25 | Anticipation: the room holds its breath |
| After blowing out | 0.70 | Release |
| "Not our first one" / reel | 0.50 | Companion to the memories |
| Video playing | 0.00 | The video speaks |
| Pause | 0.35 | The shift toward sincerity |
| Letter | 0.22 | Reading. Present, but underneath her thoughts |
| Credits | 0.65 | The swell |
| Last frame | 0.45 | Settling |

- **Sound toggle:** always visible, top-right, a 44px glass circle. The icon is **three tiny equalizer bars**. They move gently while playing (this is the screen's one allowed status loop, and it's static under reduced motion) and sit flat with a small slash when muted. Its accessible label is "Sound on" / "Sound off". Her choice persists across scenes and visits.
- **Leaving the tab:** the music fades out and pauses. When she comes back it resumes **only if she hadn't muted it**. The template's behavior of force-playing on focus is removed.
- **Credit:** the song is credited in the end credits: *music · "Yaaron" — KK*.

---

## 17. Loading experience

**There's no fake loader.** The template's 4-second heart animation is gone, and the intro screen *is* the loading experience.

1. **The first paint is instant:** night background, grain, and "hi chinnu." fading in with *arrival*. This is server-rendered text with fonts preloaded, so it shows within 300ms.
2. **While she reads it,** the critical assets preload in the background: the first 3 photos, the song (`preload="auto"`), and the Caveat and Mono fonts.
3. After 1.6s the second line arrives, *"put your earphones in."* (It quietly foreshadows the 01/02/25 photo.)
4. **`begin →`** appears when the song reports `canplaythrough`, or after 2.8s at most, whichever comes first. If the song isn't ready yet, it simply keeps buffering; it's never blocking.
5. **A developer whisper:** a `meta` line in `--cream-faint` at the bottom reads `loading memories · 4/6`. It counts real preloaded files, then settles to `ready`. It's subtle and truthful.
6. The remaining photos and the video poster preload progressively, one scene ahead.

**Returning visit:** if saved progress exists, the intro shows two choices instead of `begin →`: **`continue from "the letter" →`** (primary) and `start from the beginning` (quiet pill).

---

## 18. Navigation & section progression

- **Linear story, her pace.** Scenes advance on her tap. Timed sequences (titles, credits) run on their own but are always skippable. Nothing advances away from something she's looking at.
- **Chapter marker:** a `meta` counter in the top-left on night scenes, e.g. `03 / 10`, in `--cream-faint`. It's hidden on the countdown and letter scenes, where it would intrude.
- **The reel has its own counter** in the glass chip, `04 / 11`, and supports swipe, tap on the right or left third, and arrow keys.
- **Back:** available within the reel and from the letter (to the reel). The candle, once blown out, stays blown out. Moments don't un-happen.
- **Persistence:** the current scene and sound preference are saved (safely, via try/catch). A refresh brings her back to where she was, starting from the intro so audio can resume.
- **Countdown gate:** before **20 Oct 2026, 00:00 IST** she sees the countdown (§19 S1). At zero it moves on automatically. A `?preview` query parameter bypasses the gate so Kesava can test.
- **Hash links** (`#letter`, `#credits`) exist for Kesava's testing only and aren't shown in the UI.

---

## 19. Section personalities

Each scene has one surface, one hero, one motion, one sound level, and one thing it must never do.

### S0 · Link preview *(before she opens it)*
- **Personality:** a sealed invitation.
- **Visual:** a 1200×630 OG image of the rooftop photo, warm-graded and darkened on the left, with **"for Anjali"** in Fraunces `display` in cream, plus `20.10` in mono. The title is *"for Anjali — open when you're ready"*. The favicon is a gold candle-flame glyph on night.
- **Never:** the word "surprise!", emoji, or a generic cake.

### S1 · Countdown — "not yet" *(only before the birthday)*
- **Personality:** a teasing, calm friend saying "patience."
- **Surface:** night with the lavender dusk wash.
- **Hero:** four numbers in Fraunces `display` with tabular figures, on one baseline, separated by thin `--night-700` hairlines. Mono labels sit underneath.
- **Copy:** *"too early, chinnu."* then *"come back at midnight."*
- **Motion:** each digit changes with a 240ms cross-fade (no flipping or scaling).
- **Sound:** none.
- **Never:** colored tiles, spinning, or confetti.

### S2 · Intro — "hi chinnu."
- **Personality:** a private screening room. The lights are down and one person is speaking.
- **Surface:** night, grain, lamp.
- **Hero:** *"hi chinnu."* in Fraunces `title` italic.
- **Then:** *"put your earphones in."* followed by `begin →`, and the `loading memories` whisper.
- **Motion:** *arrival* only.
- **Sound:** starts on the tap.
- **Never:** a spinner, or anything that looks like software loading.

### S3 · Title sequence
- **Personality:** the opening credits of a small indie film.
- **Surface:** night, pure and dark.
- **Lines (dissolve in place):** *"so… I made you something."* → *"about the days I don't want either of us to forget."* → *"for my favourite person."* → then the name.
- **Hero:** **Anjali** in Fraunces `name`, arriving over 2400ms as the tracking tightens. A beat later, **"chinnu"** is handwritten beneath it in rose Caveat, with a single ❤️ (the one heart in the UI).
- **Sound:** 0.55.
- **Never:** more than one line on screen at a time before the name.

### S4 · The candle
- **Personality:** the hush before a wish. It's the emotional peak of the "celebration" half.
- **Surface:** night. The candle is the only light source, and its glow lights the scene.
- **Hero:** a single slim candle (cream wax, and a flame in `--ember` → `--gold-soft`), drawn in SVG and centered slightly low.
- **Copy:** *"make a wish first."* … (after 2.5s) *"now tap to blow it out."*
- **The moment:**
  1. She taps.
  2. The flame leans and gutters out over 500ms, and a thin smoke wisp rises and dissolves over 1800ms.
  3. There are 600ms of darkness, with the music dipped.
  4. A **warm bloom** of radial gold light rises from where the flame was, and **"Happy Birthday, Chinnu."** arrives in Fraunces `display`.
  5. **A single, restrained burst** of about 40 tiny warm particles (gold, cream, one rose) drifts *upward like embers*, not outward like party confetti, and fades within 2.5s.
- This is the **only** celebratory particle moment in the whole experience.
- **Sound:** 0.25 before the tap, lifting to 0.70 on the bloom.
- **Never:** a cake, balloons, a repeated burst, or confetti cannons.

### S5 · "This isn't our first one"
- **Personality:** the friend who shows you an embarrassing old photo and laughs.
- **Surface:** night.
- **Hero:** the cake-2023 print arriving slightly rotated (+1.5°) with the developing effect.
- **Copy:** a Caveat note above it, *"remember this?"*, then the `meta` date `20.10.2023`, and Kesava's caption in Fraunces italic.
- **Button:** `okay, next →`
- **Sound:** 0.50.
- **Personality detail:** the only scene allowed a little playful imperfection (the tilted print, the handwritten note).

### S6 · The memory reel
- **Personality:** sitting next to each other, going through a shoebox of prints.
- **Surface:** night, with the lamp above.
- **Hero:** one print at a time. Only the active print is fully lit; there's no stack of cards behind it.
- **Structure per photo:** print → date (`meta`) → caption (Fraunces italic), with a 32px gap between print and text.
- **Progress:** a glass chip showing `03 / 11`.
- **Special beats:**
  - The **earphones photo** is held with a slightly longer Ken Burns and no date chip (the date is in its caption).
  - The **video** switches to film framing (§10).
  - The **closing photo** ("And somehow, after all this time, it still feels exactly the same.") gets 400ms of extra stillness before its caption arrives.
- **Sound:** 0.50, dropping to 0 during the video.
- **Never:** cubes, carousels with visible neighbors, or thumbnails grids.

### S7 · The pause
- **Personality:** a deep breath. The tone turns from playful to sincere.
- **Surface:** night, with the lamp dimmed a little further.
- **Lines:** *"okay. one more thing."* → *"read this slowly."* then `open it →`.
- **Sound:** 0.35.
- **Never:** anything else on the screen.

### S8 · The envelope
- **Personality:** a real object being handed to her.
- **Surface:** night, with the envelope lit from above.
- **Hero:** the envelope with its rose wax seal "A". The prompt `tap to open` sits in `meta` below it (no pulsing).
- **The moment:** the seal fades, the flap rotates open (`rotateX`, 900ms), the sheet rises 40px out of the envelope, and then the **lights come up** into the paper scene (§13).
- **Never:** icons on the envelope, or wobble on hover.

### S9 · The letter
- **Personality:** quiet, sincere, unhurried. The most important screen, and the calmest.
- **Surface:** paper, fibre texture, desk-lamp falloff.
- **Hero:** the letter sheet (§7.2), which the page scrolls naturally; there's no inner scroll box.
- **Header:** `20.10.2026` in mono `--ink-muted` and a hairline. Then "Dear Chinnu ❤️" and the body in Fraunces `letter`.
- **Reveal:** paragraph by paragraph using *discovery* (each unmasks upward over 700ms, one every 2.2s, as a reading pace). A tap anywhere reveals everything at once, and she can scroll freely at any time. The page never auto-scrolls away from her. Instead, a small `↓` in `--ink-muted` appears when new text arrives below the fold.
- **The key line,** *"Manaki konni rojul break ochina, communication tagina, mana friendship ade strength tho untundi."*, gets a `--rose-wash` highlighter swept behind it (800ms) as it arrives.
- **Completion:** "Your friend always," then **"Kesava"** in Caveat with the ink-draw animation. After 1.5s of stillness, a single `→` appears.
- **Sound:** 0.22.
- **Never:** confetti, icons, typewriter cursor sounds, or a scroll box.
- **Content update (for Kesava's approval before implementation):** the old "finally tomorrow manam kalusthunam…" paragraph will be replaced with the feeling Kesava described. Draft:
  > *"Last birthday tarvatha manam malli kalavaledu… kani nijam cheppali ante, okka roju kooda mana friendship distant ga anipinchaledu. Inni rojula tarvatha kooda, repu manam kalisinappudu — emi maaraledu anipistundi. Same smile, same vibe, same us. 😄💛"*
  >
  > The greeting also changes to "Dear Chinnu ❤️". Everything else in the letter stays exactly as written.

### S10 · End credits
- **Personality:** the lights going down on a film you didn't want to end, with a wink.
- **Surface:** night with the lavender dusk wash. Faint, low-opacity (0.18) photos cross-dissolve slowly behind the text.
- **Content** (a mono role on the left and a Fraunces name on the right, rolling upward slowly at about 28px/s):
  ```
  starring            Anjali (chinnu)
  written & directed  Kesava
  photography         our phones
  music               "Yaaron" — KK
  locations           a classroom, a rooftop, one bus seat
  built with          next.js, too many late nights,
                      and npm run dev
  ```
  This is followed by a tiny **`git log`** of the friendship in mono:
  ```
  a3f9c1e  20.10.2023  birthday, cake, chaos
  7be21d0  26.01.2025  rooftop. good view. good day.
  c04e8aa  01/02/25    one pair of earphones
  e91f3b2  16.02.2025  photobombed (on purpose)
  HEAD     20.10.2026  still the same
  ```
- **Motion:** *completion*: a slow roll, skippable with a tap.
- **Sound:** swells to 0.65.

### S11 · The last frame
- **Personality:** a warm goodbye that's really a "see you tomorrow."
- **Surface:** night, lamp.
- **Hero:** one print (the earphones or the rooftop photo), then **"Happy birthday. Stay the same. 💛"** in Fraunces `title` italic.
- **Actions (quiet pills):**
  - `watch again`, which returns to S3.
  - `send something back`, which opens `https://wa.me/919493168166?text=…`. The link is generated in code from the number constant, and the number is never displayed on the page. The pre-filled text is short and warm (e.g. "🥹❤️"), and she can edit it before sending.
- **Footer whisper:** `v2026.10.20 · for anjali` in mono `--cream-faint`.
- **Sound:** 0.45, looping gently if she stays.

### Hidden layer *(for the curious)*
- **Console greeting**, in the browser's developer tools:
  `%c hi chinnu. yes, I actually wrote all of this. happy birthday. — k`, styled in gold on night.
- **Custom 404:** night surface with *"this page doesn't exist."* and then *"but we do. ← go back"*.

---

## 20. Things this system explicitly retires

- Pink/purple/indigo gradients, gradient text, glow text
- Shantell Sans as a global font
- The Uiverse heart loader and duplicated CSS
- The CSS cake, balloons, gift orb and shimmer
- Lucide icons as decoration (they remain only for functional controls: sound, play, arrow, replay, send)
- The Swiper cube
- Confetti anywhere except the single ember burst in S4
- Emoji in UI copy
- The two-song setup and forced autoplay on focus
- The fixed 4-second loader
- The permanent `@Kesava` watermark (authorship moves into the credits)

---

## 21. Open items before implementation

1. **Song file:** add "Yaaron" (e.g. `public/audio/yaaron.mp3`) and confirm the path. The fallback track covers everything until then.
2. **Photo mapping:** confirm that the five new WhatsApp images are matched to the right captions (§9.5), especially funny vs. laughing, and whether to keep both group selfies.
3. **Letter paragraph:** approve or adjust the Tenglish draft in §19 S9, including the change to "Dear Chinnu ❤️".
4. **Title-sequence lines** (§19 S3) and **credits wording** (§19 S10) are drafts in Kesava's voice. Kesava should change anything that doesn't sound like Kesava.
5. **Video poster frame:** capture one still from `video-1.mp4`.
