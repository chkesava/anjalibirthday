// Everything Kesava might want to change lives here.

// Midnight IST on her birthday. Before this moment she sees the "too early" countdown.
// Add ?preview to the URL to skip the countdown while testing.
export const BIRTHDAY = "2026-10-20T00:00:00+05:30"

// Testing switch: true skips the "too early" countdown, but only in `npm run dev`.
// The deployed site ignores it, so she still gets the countdown if she opens it early.
export const SKIP_COUNTDOWN_IN_DEV = true

// The soundtrack. Sources are tried in order; if the first file is missing,
// the next one plays instead, so there's never silence or an error.
// Drop "Yaaron" at public/audio/yaaron.mp3 (or change the first path).
export const SONG_SOURCES = ["/audio/yaaron.mp3", "/audio/happy-birthday.mp3"]
export const SONG_CREDIT = "“Yaaron” — KK"

// Optional voice note for "one last thing" (e.g. "/audio/voice-note.m4a").
// Leave null to show the "see you soon" ticket instead.
export const VOICE_NOTE_SRC = null

// Optional details for the "see you soon" ticket (e.g. a date once you've planned one). Null values are hidden.
export const MEET_SOON = { time: null, place: null }

// Used only to build the wa.me reply link; never displayed on the page.
export const WHATSAPP_NUMBER = "919493168166"
export const REPLY_TEXT = "\u{1F979}❤️"

export const replyLink = () =>
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(REPLY_TEXT)}`

// The letter sentence that gets the soft highlighter.
export const LETTER_HIGHLIGHT =
    "Manaki konni rojul break ochina, communication tagina, mana friendship ade strength tho untundi."

export const VERSION = "v2026.10.20 · for anjali"
