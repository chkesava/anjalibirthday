// The order of the experience. `chapter` is the small label shown top-left,
// `level` is the soundtrack volume (0–1) for that scene.
export const SCENES = [
    { id: "countdown", level: 0 },
    { id: "intro", level: 0.55 },
    { id: "reveal", chapter: "02 · happy birthday", level: 0.25, resume: "the birthday candle" },
    { id: "archive", chapter: "03 · the chaos archive", level: 0.55, resume: "the chaos archive" },
    { id: "timeline", chapter: "04 · our timeline", level: 0.5, resume: "our timeline" },
    { id: "things", chapter: "05 · things i never say", level: 0.35, resume: "things i never say" },
    { id: "letter", level: 0.22, resume: "the letter" },
    { id: "before", chapter: "07 · before you leave", level: 0.45, resume: "before you leave" },
    { id: "ending", level: 0.36, resume: "the ending" },
]

// 05 — Things I Never Say. Short thoughts, revealed slowly, one at a time.
// These are Kesava's own words — his photo captions, re-read as thoughts (source noted on
// each), so nothing here is invented. EDIT: replace or add lines any time (keep them short).
export const neverSay = [
    { text: "Somehow, even the random days became memories worth keeping.", from: "archive · sunglasses caption" },
    { text: "No special occasion. Just us.", from: "timeline · chapter 02 caption" },
    { text: "I don’t even remember what we were talking about.", from: "archive · exhibit 06 caption" },
    { text: "One more ordinary day that somehow became ours.", from: "timeline · 01/02/25 caption" },
    { text: "And somehow, after all this time, it still feels exactly the same.", from: "timeline · finale caption" },
]

// The line that turns the page toward the letter, and the button under it.
export const neverSayClosing = "And there’s something I actually wanted to tell you."
export const neverSayCta = "Open it"

// 07 — Before you leave: three small cards, each unfolding one short message.
// Every line is Kesava's own (from the letter / his choices) — see `from`. EDIT freely.
export const beforeYouLeave = {
    title: "Before you leave…",
    cards: [
        {
            id: "something-nice",
            icon: "🌸",
            label: "something nice",
            lines: ["Nuvvu navvuthune unte surroundings motham light ayipotayi."],
            from: "the letter",
        },
        {
            // Plays the voice note instead, if VOICE_NOTE_SRC is set in config.js.
            id: "one-last-thing",
            icon: "🎁",
            label: "one last thing",
            lines: ["The song that’s been playing this whole time is “Yaaron” by KK.", "I picked it for us."],
            // shown instead while the fallback track is playing (Yaaron not added yet)
            fallback: ["All of this took way too many late nights.", "Worth every one of them."],
            from: "Kesava's song choice",
        },
        {
            id: "for-the-future",
            icon: "🫶",
            label: "for the future",
            lines: ["Twaralone manam definitely kalustham.", "And next year, I’ll make something even more unnecessary."],
            from: "the letter + the TODO list",
        },
    ],
    done: "that’s everything",
}

// 08 — The ending. Quiet on purpose.
export const ending = {
    lead: ["That’s it.", "No fancy ending.", "Just…"],
    title: ["Happy Birthday,", "Anjali."],
    glad: "I’m really glad you’re my friend.",
    from: "— Kesava",
    signature: "made with way too much code.",
}

export const gitLog = [
    { hash: "a3f9c1e", date: "20.10.2023", msg: "cake. chaos. a lot of happiness." },
    { hash: "7be21d0", date: "26.01.2025", msg: "a good view, a good day" },
    { hash: "c04e8aa", date: "01/02/25", msg: "one pair of earphones" },
    { hash: "e91f3b2", date: "16.02.2025", msg: "in the background (on purpose)" },
    { hash: "b58d2f4", date: "20.10.2025", msg: "your birthday, last year" },
    { hash: "HEAD", date: "20.10.2026", msg: "still exactly the same" },
]

// ─── Easter eggs (hidden; the ending's last line, the console, and the page source) ───

export const systemStatus = [
    { key: "friendship", value: "online", tone: "gold" },
    { key: "memories", value: "100%" },
    { key: "chaos", value: "99.9%" },
    { key: "good times", value: "∞" },
    { key: "status", value: "never delete", tone: "rose" },
]

export const devTodo = [
    { done: true, text: "make Anjali smile" },
    { done: true, text: "preserve embarrassing memories" },
    { done: true, text: "create unnecessary animations" },
    { done: true, text: "remind her she’s awesome" },
    { done: false, text: "do this again next year" },
]

export const devReturn = 'return "Happy Birthday, Anjali ❤️";'
