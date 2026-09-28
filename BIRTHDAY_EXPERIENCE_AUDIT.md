# Birthday Experience Audit — for Anjali

> **North star:** When Anjali opens this link, she should feel that her best friend sat down and made something *for her*: beautiful, thoughtful, a little playful, and full of the two of them.
>
> Every recommendation below is judged against that one sentence. Engineering only matters where it changes what she sees or feels.

This is an audit only. No project files were changed.

---

## 0. What exists today (inventory)

### Page flow (`src/app/page.jsx`)

```
Loader (fixed 4s, not skippable)
  └─▶ Countdown   (if now < birthdayDate)
      or Celebration  (if now ≥ birthdayDate)  — "Time to Celebrate!" + confetti from the sides
        └─▶ HappyBirthday — CSS cake, 5–20 balloons, "Happy Birthday Anjali🧡", song #1 autoplays
              └─▶ PhotoGallery — "Moments with You", Swiper cube, 5 photos + 1 video, song #2 autoplays
                    └─▶ Letter — envelope → typewriter letter (50ms/char) → confetti → "Read Again"
```

- It's one page with a `currentScreen` index. There is no back button, no URL per screen, and a refresh starts everything over, including the 4s loader.
- `birthdayDate` is hardcoded to **`2025-01-20`** (`page.jsx:17`). That date has passed, so the Countdown screen can never show and she always lands on "The countdown is over…".
  - ⚠️ The evidence points to an **October 20** birthday. The commits are from 8–19 Oct 2025, `IMG-20231020-WA0007.jpg` is a cake celebration dated 20 Oct 2023, and the letter was last edited on 19 Oct and says "finally *tomorrow* manam kalusthunam". So `01-20` is probably a month/day typo for `10-20`. **This needs confirming.** If it's right, her next birthday is about 3 weeks away (today is 27 Sep 2026).
- A permanent `@Kesava` watermark sits bottom-right on every screen (`page.jsx:60-70`).

### Components

| File | What it does | Notes |
|---|---|---|
| `Loader.jsx` | Uiverse "CSS heart" loader + "Preparing Something Special / For someone very special…" | Imports `framer-motion`, which isn't a direct dependency (it only works because `motion` pulls it in) |
| `Countdown.jsx` | 4 gradient boxes (pink→rose, purple→pink, indigo→purple, blue→indigo) that spin in at −180° | Never reachable with the current date |
| `Celebration.jsx` | Rotating gradient gift orb, shimmer sweep, confetti from both sides, "Let's Celebrate!" button | `onMusicStart` references an undefined `setMusicStarted`. It's never called, so it's dead code, but it's a trap |
| `HappyBirthday.jsx` | CSS cake with flickering candles, bobbing balloons, gradient "Happy Birthday", "Anjali🧡", "🎉 It's your special day! 🎉", "See Our Moments" | Plays `happy-birthday--song.mp3`. The music toggle is rendered with `hidden`, so she can't mute it |
| `PhotoGallery.jsx` | Camera icon, "Moments with You / Memorable Moments in college", Swiper **cube** effect, "Play/Pause Music" pill, "One Last Thing" | Plays a **second** track, `happy-birthday.mp3`. Pauses the music while the video plays |
| `Letter.jsx` | Envelope card with Mail/Heart/Sparkles icons → gradient letter card with 4 corner icons, typewriter from `/letter.txt`, confetti at the end | 288px scroll box, auto-scrolls on every character, no skip |

### Assets

| Asset | What it is (from viewing it) | Used? |
|---|---|---|
| `IMG-20231020-WA0007.jpg` | **A past birthday celebration (20 Oct 2023):** a cake on a boardroom table, Kesava spraying foam on Anjali, pink gift bag. Candid and funny, a real "us" moment. | ❌ **Not used anywhere** |
| `Snapchat-1233268129.jpg` | The two of them in a classroom in college uniform and lanyards, soft warm film tone. Very "college days". | ✅ |
| `image-5.jpg` | Black-and-white selfie with matching white rectangular sunglasses (Snapchat filter), college lanyard, trees behind. Playful. Has thick black letterboxing baked in. | ✅ |
| `IMG-20250216-WA0003.jpg` | 16 Feb 2025. Her selfie in a classroom, Kesava leaning in behind her, both smiling. Letterboxing baked in. Low resolution (25 KB). | ✅ |
| `IMG-20250126-WA0008.jpg` | 26 Jan 2025. Standing together on a rooftop or tower, with green paddy fields and town below. The most "cinematic" photo. 827 KB, 4160×3119. | ✅ |
| `image-6.jpg` | **"01/02/25"**, sharing one pair of wired earphones on a bus or train, heads together, window bars and sunlight. The date is baked in with a serif caption. **The photo is rotated 90°**, so it shows sideways. It may be the most tender image in the set. | ✅ (sideways) |
| `video-1.mp4` | 582 KB clip. Not reviewed: no media tools are available in this environment. | ✅ (last slide of the cube) |
| `happy-birthday--song.mp3` | ~2.7 MB track. Not listened to. | ✅ HappyBirthday screen |
| `happy-birthday.mp3` | ~2.5 MB track. Not listened to. | ✅ PhotoGallery screen |
| `letter.txt` | The personal letter, in Tenglish (Telugu–English), signed "Kesava 💛" | ✅ |
| `README.md` | The original template's README (Anuj's "Birthday Surprise V2", with "DM me for premium code") | — |

### Dependencies
`next 15.3.5`, `react 19`, `motion 12`, `canvas-confetti`, `lucide-react`, `swiper`, `tailwindcss 4`. That's a reasonable, light stack. Nothing new is *needed* for a much better experience.

---

## 1. What currently works well

1. **The letter itself.** It's the heart of the gift and it's genuinely personal. It's written in the language the two of them actually talk in (Telugu–English), it's honest ("Nenu sometimes fight chestha, jealous avutaa, possessive ga behave chestha…"), and it names the relationship directly ("naa one and only Best Friend"). No template can fake this.
2. **The photos are real and specific.** College uniforms, lanyards, a classroom wall, one pair of earphones shared on a bus, a rooftop over paddy fields. That texture is exactly what makes something feel personal rather than generic.
3. **The overall arc is right:** anticipation → celebration → memories → letter. The order of *emotions* is good; the execution of each step is what's generic.
4. **"Open the envelope" as the doorway to the letter** is a good instinct. A deliberate gesture before the most intimate part creates a small pause.
5. **Typing the letter out** gives a sense of it being "written for you now". The idea is right, even though the speed and container are wrong (see §4).
6. **The dark background** suits the photos and gives a cinematic base to build on.
7. **Video pauses the music.** That's a thoughtful detail worth keeping.
8. **One screen at a time.** Pacing the experience as scenes rather than a scrolling landing page is the right structure.

---

## 2. What feels generic / template-like

The whole project comes from a public template (`birthday-site-v2` by @anujbuilds, per `README.md`), and almost all of the *non-content* layer still reads as that template:

- **Copy that could be for anyone:** "Preparing Something Special", "For someone very special…", "Time to Celebrate!", "The magical moment approaches…", "Click to start the magic! ✨", "It's your special day!", "A Special Letter", "Just for you, on your special day 💌", "Moments with You". Only the name "Anjali" and the letter are hers.
- **The same gradient headline on every screen** (`from-pink-400 via-purple-400 to-indigo-400`, with `bg-clip-text` and a glow drop-shadow). Five screens, five identical hero treatments.
- **The same giant gradient pill button on every screen**, with the same white border, hover-scale and spring-in.
- **An icon above every headline:** Cake, Gift, Camera, Mail, each wobbling on an infinite loop. It's the classic template "icon + gradient title + subtitle + CTA" stack.
- **The Uiverse heart loader.** It's copy-pasted CSS, and it's included **twice** in `globals.css` (lines 74–381 and 383–692 are duplicates).
- **The CSS cake and balloons.** They're clip-art built from divs.
- **The Swiper cube.** It's a default demo effect from Swiper's docs.
- **The metadata:** `title: "Happy Birthday!"` and a generic description. This is also what shows in the WhatsApp/Instagram link preview, which is the very first thing she'll see (see §9).
- **The README** still advertises someone else's "premium version".

---

## 3. What feels visually outdated

- **Pink→purple→indigo gradients everywhere:** background blobs, text, buttons, countdown tiles, the gift orb, the letter paper, even the scrollbar and Swiper bullets. It's a 2019–2021 "aesthetic" palette, and it fights the warm, natural tones of the photos (paddy green, classroom white, film-warm skin tones, B&W).
- **Glow drop-shadows on text** (`drop-shadow(0 0 30px rgba(255,105,180,0.5))`).
- **Shantell Sans for everything**, including headings, buttons and the letter. It's a comic-handwriting font, and used everywhere it reads as childish rather than personal. Handwriting works best in small doses (a signature, a caption).
- **Rounded-2xl cards with thick borders and heavy shadows**, the standard component-library look.
- **Emoji inside headings and UI copy** (🎉 💖 💌 ✨ 🧡). Emoji belong in the letter, where Kesava typed them, not in the interface chrome.
- **The 3D cube transition**, which feels like a 2014 jQuery slider demo.

---

## 4. What feels excessive or distracting

| Issue | Where | Why it hurts |
|---|---|---|
| **Everything moves, forever** | Wobbling icons, bobbing cake, 20 bobbing balloons, pulsing loader text, shimmering orb, pulsing "Click to open" | When everything animates, nothing feels special. Constant motion reads as nervous rather than warm. |
| **Two different songs that restart per screen** | HappyBirthday starts track 1 and stops it on "next". Gallery starts track 2. Letter has **no music** | The soundtrack cuts out and switches at emotional transitions, and then there's silence at the most emotional moment (the letter). |
| **Music she can't control** | The HappyBirthday toggle has `className="… hidden"` | If she's opening this in class or at work, she can't mute it. |
| **Music resumes on its own** | `focus`/`blur` handlers call `play()` on every window focus, even after she paused it in the gallery | It feels broken. |
| **Confetti ×2** | Celebration (2.5s from both sides) + end of letter | The letter confetti is the worst one: she finishes an intimate letter and gets a burst of party confetti. That's the wrong emotional register. |
| **Forced 4-second loader** | `page.jsx:20-25` | Nothing actually loads in those 4s. It's a wait with a generic message, and it repeats on every refresh. |
| **Typewriter speed** | 50ms/char × ~1,300 chars ≈ **65 seconds**, no skip | Slower than she can read, and a re-read means the full 65s again. |
| **Tiny auto-scrolling letter box** | `min-h-72 max-h-72` + `scrollTo` on every character | She reads the letter through a 288px keyhole, and if she scrolls up to re-read a line, the next character yanks her back down. |
| **Corner decorations on the letter** | 4 lucide icons + a wobbling heart | They clutter the most important screen. |
| **`user-select: none` on body** | `globals.css:27` | She can't copy a line from the letter to send back or screenshot-quote. |

---

## 5. Emotional moments that already exist

Strong raw material, currently under-staged:

1. **Seeing her name.** "Anjali" is shown as a secondary `h2` under a generic "Happy Birthday". Her name should be *the* moment, not a subtitle.
2. **The shared-earphones photo (01/02/25).** It's quietly the most intimate image, and it's currently sideways, cropped by `object-cover`, and one face of a spinning cube.
3. **The rooftop photo.** It's wide, open and golden: a natural "look how far we've come" frame.
4. **The foam-on-birthday photo (Oct 2023).** It shows a *previous* birthday they celebrated together, and it's unused. This is a perfect "this isn't our first birthday together" beat.
5. **The letter's arc:** gratitude → honesty about being possessive → "no one can replace that place" → "communication tagina, mana friendship ade strength tho untundi" (even when we drift, the friendship holds). That last line is the emotional climax and deserves its own beat.
6. **Opening the envelope:** a real gesture, currently undermined by the icon-covered envelope.
7. **The signature, "Your friend always, Kesava".** It's the natural closing frame of the whole site, and right now it's just the last line of the typewriter output.

---

## 6. Assets that must be preserved

- **`letter.txt`**: all of it, in its own voice and language. Don't "clean up" the Tenglish. Only the time-bound line needs revisiting (see §7).
- **All six photos**, including the unused `IMG-20231020-WA0007.jpg`.
- **`video-1.mp4`**
- **One** of the two audio tracks. Kesava should pick the one that feels most like *them*. If neither does, a soft instrumental or "their song" would beat a generic Happy Birthday tune. A single short Happy Birthday sting could still play at the candle moment.
- **The scene-by-scene structure** and the envelope → letter gesture.
- **The favicon** can go. A custom one (see §9) is a small, lovely touch.

---

## 7. What should be redesigned

### Visual system (applies everywhere)
Replace the pink/purple/indigo template look with **one coherent, warm, cinematic identity**:

- **Palette:** a warm near-black "cinema" base (`#12100E`-ish), a cream "paper" (`#F2EADF`) for the letter and cards, and **one** accent pulled from the photos, such as marigold or turmeric (`#E0A43B`) or a soft terracotta. No multi-stop gradients. If there's any gradient at all, it's a subtle vignette.
- **Typography:** three roles, used with discipline.
  - A **serif display face** for names and titles (e.g. *Fraunces*, *Instrument Serif* or *Cormorant*). It's elegant, a little romantic-nostalgic, and matches the serif date on `image-6.jpg`.
  - A **clean sans** for UI and captions (e.g. *Inter* or *DM Sans*).
  - **Handwriting only for small personal marks:** the signature, a photo caption, a scribble (e.g. *Caveat*).
  - Optionally a **mono** face for the rare developer easter eggs.
- **Texture:** a subtle film grain overlay, and soft vignettes. Photos get a physical treatment (polaroid or print borders, slight rotation, date stamps) so they feel like *objects* rather than slides.
- **Motion language:** slow, deliberate and sparse. Fades and gentle rises of 600–1200ms with ease-out, slow Ken Burns pans on photos, and nothing that loops indefinitely on screen except maybe one candle flame. Respect `prefers-reduced-motion`.
- **Buttons:** understated text links or quiet outlined buttons, with copy that sounds like Kesava talking ("okay, next →", "open it"), not "Let's Celebrate! ✨".

### Screen by screen

| Current | Redesign direction |
|---|---|
| **Loader** | Replace with an intentional **"tap to begin"** screen that loads real assets in the background. It also unlocks audio, which browsers require anyway. |
| **Countdown** | Keep the *idea* for the case where she opens it early, but redesign it as a calm, typographic "not yet 🙂" screen: large serif numbers, one line of cheeky copy from Kesava, and no spinning gradient tiles. Fix the date. |
| **Celebration + HappyBirthday** | Merge into one cinematic **title sequence → name reveal → candle** moment (see §9). Drop the CSS cake, balloons and gift orb. |
| **PhotoGallery** | Replace the cube with a **chronological memory sequence**: one photo per beat, full attention, each with a date and a one-line caption *in Kesava's words*. Fix the rotation of `image-6.jpg`. Handle the baked-in black borders by cropping them in the image files, or by embracing them as film frames. |
| **Letter** | **Cream paper, full height, readable.** Reveal it paragraph by paragraph (faster, with tap-to-reveal-all), no auto-scroll hijacking, no corner icons, no confetti. The signature appears last, in handwriting. |
| **Music** | **One soundtrack**, managed globally, continuous across scenes, ducked (not stopped) during the video and gently lowered during the letter. A small, always-visible mute toggle. |

### Content to revisit
- The letter line **"After so long, finally tomorrow manam kalusthunam…"** was true on 19 Oct 2025. If the site is being re-sent for 2026, that line (and "farewell day" framing) should be updated by Kesava, not by us.
- Photo captions, inside jokes and nicknames: **only Kesava can write these.** The redesign should leave slots for them, not invent them.

---

## 8. What should be removed

- The Uiverse heart loader and its **~620 lines of duplicated CSS** in `globals.css`
- The CSS cake, balloons, gift orb, shimmer sweep and wobbling lucide icons above headlines
- The pink/purple/indigo gradient system: backgrounds, text, buttons, scrollbar, Swiper bullets
- The Swiper cube effect, and probably the `swiper` dependency entirely
- **Confetti after the letter** (keep at most **one** restrained moment, at the candle, or none)
- The second competing audio track (or repurpose it as the candle "sting")
- Emoji inside UI headings and buttons
- Generic copy ("magical moment", "special day", "someone very special")
- The forced 4s timer
- `user-select: none`
- The `hidden` music button and the dead `onMusicStart` prop
- The template README's promotion. Replace it with a short personal README or leave it minimal.
- The permanent `@Kesava` watermark. Move authorship into an end-credits moment where it *means* something.

---

## 9. New screens & interactions to introduce

Each one is here because it creates a feeling, not because it's clever.

1. **A link preview that's already a gift.** She'll almost certainly receive this on WhatsApp. Add a custom `og:image` (e.g. the rooftop photo with "for Anjali" in serif), a title like *"for Anjali — open when you're ready"*, and a matching favicon. The first impression happens *before* she taps.
2. **"Tap to begin" / headphones screen.** Black screen, one line: *"hi Anjali. put your earphones in 🎧"*. That quietly echoes the shared-earphones photo. Tapping starts the music (which also solves the autoplay block) and the experience.
3. **Opening title sequence.** A few lines fade in and out over black like film titles, in Kesava's voice. For example: *"a small thing I made"* → *"for my favourite person"* → **Anjali** (large serif, the hero moment). Around 10–15 seconds, skippable.
4. **The candle.** One single, well-drawn candle (not a clip-art cake). The prompt reads *"make a wish, then tap to blow"*, or *"blow into your mic"* as an optional progressive enhancement with a tap fallback. The flame goes out, a wisp of smoke rises, then the one celebratory beat: "Happy Birthday, Anjali" plus a short, restrained burst of warm-toned particles or a gentle light bloom. This replaces three screens of constant celebration with **one earned moment**.
5. **"This isn't our first one."** A beat that shows the Oct 2023 foam-birthday photo: *"remember this? 20.10.2023"*. It's funny, specific, and shows history.
6. **The memory reel (chronological).** Photos appear one at a time as prints or polaroids, with a date stamp and a caption slot. For example: classroom (college) → sunglasses selfie → rooftop (26.01.25) → shared earphones (01.02.25) → classroom selfie (16.02.25) → video. Swipe or tap to advance, with slow Ken Burns on each. The video plays inline and ducks the music.
7. **A "pause" beat before the letter.** A single line such as *"okay. one more thing. read this slowly."* It gives the tonal shift from playful to sincere a moment to breathe.
8. **The letter, redesigned.** A cream paper sheet that fills the screen. Paragraphs reveal in sequence; tap reveals everything. The signature "Your friend always, Kesava" is written in handwriting (an SVG stroke animation is a lovely touch). The line *"mana friendship ade strength tho untundi"* gets a subtle emphasis, such as a soft highlight.
9. **End credits.** The music swells slightly and the credits roll like a film:
   *starring Anjali* · *written by Kesava* · *photography: our phones* · *soundtrack: …* · *built with too many late nights and `npm run dev`*.
   Then a final frame: one photo, "Happy birthday. Stay the same. 💛", plus two quiet actions: **"watch again"** and **"reply to Kesava"** (a WhatsApp deep link with a pre-filled "🥹"). That closes the loop: the gift invites a response.

### Subtle "developer-made" touches (pick two or three, not all)
- A `console.log` greeting for if she (or a curious friend) opens DevTools: `// hi anjali. yes, I actually wrote this. happy birthday.`
- The end credits framed like a tiny `git log` of the friendship (commit dates = photo dates), e.g. `a1b2c3d  26 Jan 2025  rooftop, paddy fields, no filter`
- A custom 404 page: "this page doesn't exist, but our friendship does. ← go back"
- A version string in the footer: `v2026.10.20 — for anjali`

### Mobile & real-world behaviour (not optional)
She will most likely open it **on her phone, inside WhatsApp's or Instagram's in-app browser.** Design for that first:
- Use `100dvh` and safe-area insets. Tap targets should be at least 44px, and text should be readable without zooming.
- Audio must start from a user gesture (the "tap to begin" screen handles this). Test in the WhatsApp in-app browser on Android specifically.
- Compress and resize the images (the rooftop photo alone is 827 KB at 4160px) and preload the next scene.
- She should be able to leave and come back without the whole experience restarting: remember progress in `sessionStorage`/`localStorage` and offer "continue".
- Allow text selection in the letter.

---

## 10. How the experience should flow

**Emotional curve:** *curiosity → delight → nostalgia → sincerity → warmth → a smile at the end.*

The site should take about 4–6 minutes at her own pace, with no step that forces her to wait without a reason.

**Guiding rules:**
- **One idea per screen.** Each scene has a single focal point.
- **Restraint, then release.** Nearly all motion is slow and quiet, so the one celebratory moment (the candle) actually lands.
- **Her pace.** Every scene advances on tap or swipe. Timed sequences can be skipped. Nothing auto-advances away from something she's looking at.
- **Kesava's voice everywhere.** All micro-copy should sound like a message from Kesava, lowercase and casual, in the same Tenglish register as the letter where it fits.
- **One continuous soundtrack** that carries her through the scenes, softens for the letter, and swells for the credits.

---

## Open questions for Kesava (needed before implementation)

1. **Birthday date:** is it **20 October**? (The code says 20 Jan, but all the evidence says Oct.) And should the site be locked behind a countdown until midnight, or open immediately?
2. **Music:** which of the two tracks is it, or is there a song that's specifically *yours*?
3. **Photo captions:** a one-line memory for each photo. What was happening? Why do you remember it?
4. **Inside jokes / nicknames:** anything she'd instantly recognise, for micro-copy and credits.
5. **The letter:** keep it exactly as is, or update the "tomorrow we're meeting" and farewell lines for this year?
6. **Any more photos or voice notes?** Even one 10-second voice note saying "happy birthday" at the end would outweigh any animation we could build.
7. **Reply action:** OK to include a WhatsApp "reply to Kesava" link at the end? (It needs your number in the page.)

---

## Proposed complete user journey

> The timings are approximate. Every scene advances on her tap unless noted.

### Scene 0 — The link (before she opens it)
WhatsApp shows a custom preview card: the rooftop photo, warm-toned, with **"for Anjali"** in serif. Title: *"for Anjali — open when you're ready"*. The favicon is a tiny candle or an "A".
*Feeling: "wait, Kesava made something?"*

### Scene 1 — Not yet *(only if opened before the birthday)*
A dark screen with large, calm serif numbers counting down to midnight. One cheeky line: *"too early, Anjali. come back at 12 🙂"*. There are no spinning tiles. At zero it flows straight into Scene 2.
*Feeling: anticipation, a smile.*

### Scene 2 — Earphones in
Black screen, film grain, one line fading in: **"hi Anjali."** … then *"put your earphones in 🎧"* … then a quiet **"tap to begin"**. Assets preload behind it.
*The tap starts the soundtrack softly.*
*Feeling: intimate, like a private screening.*

### Scene 3 — Opening titles (≈12s, skippable)
Lines appear and dissolve over black, like film titles:
*"a small thing I made"* → *"about the best part of college"* → *"for my favourite person"* →
then, large and warm in serif: **Anjali**.
*Feeling: "this is about me."*

### Scene 4 — The candle
A single candle glows in the dark, and the flame is the only thing moving on screen. *"make a wish first."* … *"now tap to blow it out."* (The mic-blow option is a progressive enhancement.)
The flame goes out and a wisp of smoke rises. A beat of silence, the music lifts, and a warm light blooms across the screen:
**"Happy Birthday, Anjali."**
This is the one celebratory burst in the whole experience: soft, warm-toned and brief.
*Feeling: delight, the emotional "pop".*

### Scene 5 — "This isn't our first one"
A print of the Oct 2023 foam-birthday photo slides in, slightly rotated.
Handwritten caption: *"remember this? 20.10.2023"* plus a caption from Kesava.
*Feeling: laughter, shared history.*

### Scene 6 — The memory reel
Photos come one at a time, in chronological order, each as a physical print with a date stamp and Kesava's one-line caption. There's a slow Ken Burns drift and she swipes or taps to go on.
1. Classroom, college uniforms — *"college days"* (caption TBD)
2. Matching sunglasses selfie (B&W) — caption TBD
3. Rooftop over the paddy fields, 26.01.25 — caption TBD
4. **One pair of earphones, 01.02.25.** It's corrected to upright and held a beat longer. This quietly pays off Scene 2's "put your earphones in".
5. Classroom selfie, 16.02.25 — caption TBD
6. The video plays inline, and the music ducks underneath it.

A small progress indicator shows something like "4 / 6" in mono.
*Feeling: nostalgia, warmth.*

### Scene 7 — The pause
The screen goes quiet and the music softens. *"okay. one more thing."* … *"read this slowly."* … **"open it"**
*Feeling: the shift from playful to sincere.*

### Scene 8 — The envelope
A simple, elegant cream envelope with a wax-seal-style "A". There are no icons or pulsing text. She taps and the flap opens.
*Feeling: a gesture, a held breath.*

### Scene 9 — The letter
A full-screen cream paper sheet with a readable serif or sans body. **The words stay exactly as Kesava wrote them.**
Paragraphs arrive one after another at reading pace, and a tap reveals them all. She can scroll freely and select text.
The line *"Manaki konni rojul break ochina, communication tagina, mana friendship ade strength tho untundi."* gets a soft highlight as it appears.
Finally the signature, **"Your friend always, Kesava"**, is written on in handwriting.
No confetti. Just a pause, then a small **"→"** appears.
*Feeling: seen, moved, maybe teary.*

### Scene 10 — End credits
The music swells gently and credits roll over a slow slideshow of the photos:
*starring Anjali* · *written & directed by Kesava* · *photography: our phones* · *music: …* · *made with too many late nights and `npm run dev`* · (optionally, a tiny `git log` of the friendship)
*Feeling: a smile, "Kesava is such a nerd, I love this."*

### Scene 11 — The last frame
One photo (the rooftop or the earphones), and a single line: **"Happy birthday. Stay the same. 💛"**
Two quiet actions:
- **watch again** (restarts from Scene 3)
- **reply to Kesava** (opens WhatsApp with a pre-filled message)

Optionally, a 10-second voice note from Kesava plays here.
*Feeling: complete, warm, and the gift turns into a conversation.*

---

*The DevTools greeting, the custom 404 page and the version string (`v2026.10.20 — for anjali`) sit quietly in the background for anyone who goes looking.*
