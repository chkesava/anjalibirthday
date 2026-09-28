// ─────────────────────────────────────────────────────────────────────────────
// Every memory in the site lives here. Edit freely — the pages adapt.
//
// Each memory:
//   id       stable key
//   type     how it's laid out (see each list below)
//   date     "26.01.2025" style, or null → no date is shown
//   title    a few words, or null → no title is shown
//   caption  Kesava's line for the photo (verbatim)
//   memory   EDIT: a sentence or two about the day, in Kesava's words — null hides it
//   joke     EDIT: an inside joke, ≤ 6 words (shown in handwriting) — null hides it
//   note     a small handwritten annotation — null hides it
//   image    { src, w, h, alt } — photos live in public/memories/
//            (web-sized copies; the untouched originals stay in public/images/)
//
// Nothing here is invented: captions are Kesava's, dates come from the photos' own
// filenames/stamps, and titles are taken from the captions. Everything unknown is null.
// ─────────────────────────────────────────────────────────────────────────────

// 03 — The Chaos Archive (laughter). type: "photo"
export const archive = [
    {
        id: "birthday-2023",
        type: "photo",
        date: "20.10.2023",
        title: "the birthday incident",
        caption: "The birthday girl, caught somewhere between cake, chaos and a lot of happiness.",
        memory: null,
        joke: null, // EDIT
        note: "remember this?",
        image: {
            src: "/memories/cake-2023.jpg", w: 720, h: 1280,
            alt: "Kesava spraying party foam over Anjali at her birthday, a blue cake on the table in front of her.",
        },
    },
    {
        id: "sunglasses",
        type: "photo",
        date: null, // EDIT
        title: null,
        caption: "Somehow, even the random days became memories worth keeping.",
        memory: null,
        joke: null, // EDIT
        note: null,
        image: {
            src: "/memories/sunglasses.jpg", w: 799, h: 1030,
            alt: "Black-and-white selfie of Anjali and Kesava wearing matching white sunglasses.",
        },
    },
    {
        id: "photobomb",
        type: "photo",
        date: "16.02.2025",
        title: "the photobomb",
        caption: "You take the selfie. I just make sure I’m in the background.",
        memory: null,
        joke: null, // EDIT
        note: null,
        image: {
            src: "/memories/selfie-background.jpg", w: 488, h: 583,
            alt: "Anjali smiling in a classroom selfie while Kesava leans in and grins in the background.",
        },
    },
    {
        id: "group-1",
        type: "photo",
        date: null, // EDIT
        title: null,
        caption: "Some memories come with extra people, extra noise and extra stories.",
        memory: null,
        joke: null, // EDIT
        note: null,
        image: {
            src: "/memories/group-selfie-1.jpg", w: 1280, h: 960,
            alt: "Group selfie of Anjali, Kesava and two others beside the yellow college buses.",
        },
    },
    {
        id: "group-2",
        type: "photo",
        date: null, // EDIT
        title: null,
        caption: "Same people, same chaos, another memory saved.",
        memory: null,
        joke: null,
        note: null,
        image: {
            src: "/memories/group-selfie-2.jpg", w: 1280, h: 960,
            alt: "A second, almost identical group selfie of the same four beside the college buses.",
        },
    },
    {
        id: "unknown-topic",
        type: "photo",
        date: null, // EDIT
        title: "unknown topic",
        caption: "I don’t even remember what we were talking about, but this photo remembers the laughter.",
        memory: null,
        joke: null, // EDIT
        note: null,
        image: {
            src: "/memories/funny-outdoors.jpg", w: 720, h: 1599,
            alt: "Anjali, in a green cap, laughing at Kesava mid-conversation on campus while he gives a thumbs up.",
        },
    },
]

export const exhibitLabel = (i) => {
    const title = archive[i]?.title
    return `exhibit ${String(i + 1).padStart(2, "0")}${title ? ` · ${title}` : ""}`
}

// The one piece of film in the archive. 4 seconds, portrait, with black bars baked in.
export const archiveFilm = {
    id: "film-01",
    type: "film",
    label: "film 01",
    date: null, // EDIT
    caption: null, // EDIT — shown on the film card and in the viewer
    src: "/images/video-1.mp4",
    poster: "/memories/film-poster.jpg", // a frame from 0:03, full frame
    card: "/memories/film-card.jpg", // the same frame without the black bars
    w: 480, h: 848,
    cardW: 480, cardH: 470,
    duration: 4, // seconds, shown on the film card
    alt: "A few seconds of film: riding through the city at night, street lights going past.",
}

// 04 — Our Timeline (nostalgia), read top to bottom as chapters. type:
//   "chapter"  a photo with its words beside it; chapters alternate sides
//   "wide"     a full-width moment
//   "moment"   THE MOMENT — a pinned, scroll-driven scene (see BIRTHDAY_STORYBOARD.md)
//   "set"      a few photos from the same day, shown together (uses `images`)
//   "finale"   the last chapter; its caption arrives phrase by phrase
export const timeline = [
    {
        id: "a-normal-college-day",
        type: "chapter",
        date: null, // EDIT
        title: "a normal college day",
        caption: "Back when a normal college day could turn into a memory.",
        memory: null, // EDIT
        joke: null, // EDIT
        note: null,
        image: {
            src: "/memories/standing-outdoors.jpg", w: 720, h: 1599,
            alt: "Anjali and Kesava standing together on campus in college uniform, beside a pillar.",
        },
    },
    {
        id: "the-same-frame",
        type: "chapter",
        date: null, // EDIT
        title: "no special occasion",
        caption: "No special occasion. Just us, existing in the same frame.",
        memory: null, // EDIT
        joke: null, // EDIT
        note: null,
        image: {
            src: "/memories/sitting-together.jpg", w: 1600, h: 900,
            alt: "Anjali and Kesava sitting side by side in a classroom, both smiling softly.",
        },
    },
    {
        id: "a-good-view",
        type: "wide",
        date: "26.01.2025",
        title: "a good view",
        caption: "A good view, a good day, and one of my favourite people.",
        memory: null, // EDIT
        joke: null, // EDIT
        note: null,
        image: {
            src: "/memories/rooftop.jpg", w: 1600, h: 1200,
            alt: "Anjali and Kesava on a rooftop, green paddy fields and the town stretching out behind them.",
        },
    },
    {
        id: "one-pair-of-earphones",
        type: "moment",
        date: "01/02/25", // the photo's own date stamp
        title: "one pair of earphones",
        caption: "01/02/25 — one more ordinary day that somehow became ours.",
        memory: null, // EDIT
        joke: null,
        note: "you’re wearing earphones right now, aren’t you?",
        image: {
            src: "/memories/earphones.jpg", w: 968, h: 968,
            alt: "Two shoulders side by side on a bus, one pair of wired earphones shared between them, sunlight through the window bars.",
        },
    },
    {
        // Her birthday last year. Per the letter ("Last birthday tarvatha manam malli
        // kalavaledu…"), this is the last time they met — the caption says only that.
        id: "last-birthday",
        type: "set",
        date: "20.10.2025",
        title: "last birthday",
        caption: "Your birthday, last year — the last time we met.", // EDIT: your own line, if you like
        memory: null, // EDIT
        joke: null, // EDIT
        note: null,
        image: null, // set below to the first of `images`
        images: [
            {
                src: "/memories/birthday-2025-1.jpg", w: 561, h: 998,
                alt: "Kesava feeding Anjali a piece of birthday cake under a HAPPY BIRTHDAY banner.",
            },
            {
                src: "/memories/birthday-2025-2.jpg", w: 561, h: 998,
                alt: "Anjali in her birthday sash with her eyes shut as Kesava throws something her way.",
            },
            {
                src: "/memories/birthday-2025-3.jpg", w: 561, h: 998,
                alt: "Anjali in a Happy Birthday sash and Kesava standing together, a purple cake and red roses in front of them.",
            },
        ],
    },
    {
        id: "still-the-same",
        type: "finale",
        date: null, // EDIT
        title: "still the same",
        caption: "And somehow, after all this time, it still feels exactly the same.",
        phrases: ["And somehow,", "after all this time,", "it still feels exactly the same."],
        memory: null, // EDIT
        joke: null,
        note: null,
        image: {
            src: "/memories/laughing-outdoors.jpg", w: 720, h: 1599,
            alt: "Anjali and Kesava laughing together on campus.",
        },
    },
]

// A "set" uses its first photo wherever a single image is needed (credits backdrop, preloading).
for (const m of timeline) if (m.images && !m.image) m.image = m.images[0]

// The earphones photo closes the whole experience, too.
export const finalPhoto = timeline.find((m) => m.type === "moment").image

// Everything the arrival preloads while she reads the first lines.
export const preloadImages = [...archive, ...timeline]
    .flatMap((m) => (m.images ?? [m.image]).map((i) => i.src))
    .concat(archiveFilm.card)
