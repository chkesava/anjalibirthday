"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { neverSay, neverSayClosing, neverSayCta } from "../data/story"
import { useKeys } from "../hooks/useKey"
import { useSound } from "./sound/SoundProvider"
import { TapHint, TextButton } from "./ui"
import { EASE_EXIT, EASE_IN_OUT, EASE_SOFT } from "./ui/motion"

// 05 — Things I Never Say.
//
// Quiet on purpose: no images, no ornaments — just type and a lot of dark space.
// Each thought surfaces a word at a time, as if being decided on, stays a moment, then drifts
// off. After the last one, a silence; then the line that turns toward the letter.
// Tap anywhere to finish a thought or move to the next. Words live in src/app/data/story.js.

const WORD_GAP = 0.19 // s between words
const PUNCT_PAUSE = 0.42 // extra pause after , . — …
const two = (n) => String(n).padStart(2, "0")

// Delay for each word so the phrasing breathes at commas and full stops.
function timing(text) {
    const words = text.split(" ")
    let t = 0
    const delays = words.map((w) => {
        const d = t
        t += WORD_GAP + (/[,.—…;:?!]$/.test(w) ? PUNCT_PAUSE : 0)
        return d
    })
    return { words, delays, total: t + 0.9 }
}

export default function ThingsISay({ onNext }) {
    const reduced = useReducedMotion()
    const { setLevel } = useSound()
    // title → thought 0..n-1 → hush → closing → leaving
    const [phase, setPhase] = useState("title")
    const [i, setI] = useState(0)
    const [full, setFull] = useState(false) // current thought fully shown
    const timer = useRef(0)

    const clear = () => clearTimeout(timer.current)
    const after = (ms, fn) => {
        clear()
        timer.current = setTimeout(fn, reduced ? Math.min(ms, 1200) : ms)
    }
    useEffect(() => () => clearTimeout(timer.current), [])

    const nextThought = () => {
        setFull(false)
        if (i + 1 < neverSay.length) setI(i + 1)
        else {
            setPhase("hush")
            setLevel(0.24, 3200) // the room gets quieter before the last line
        }
    }

    // Drive the sequence. Each step schedules the next; a tap can jump ahead.
    useEffect(() => {
        if (phase === "title") after(3600, () => setPhase("thought"))
        if (phase === "thought") {
            const { total, words } = timing(neverSay[i].text)
            if (!full) after(700 + total * 1000, () => setFull(true))
            else after(2300 + words.length * 90, nextThought)
        }
        if (phase === "hush") after(1900, () => setPhase("closing"))
        return clear
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [phase, i, full])

    const tap = () => {
        if (phase === "title") setPhase("thought")
        else if (phase === "thought") (full ? nextThought() : setFull(true))
        else if (phase === "hush") setPhase("closing")
    }

    const open = () => {
        if (phase !== "closing") return
        setPhase("leaving")
        setTimeout(onNext, 1300)
    }

    useKeys({
        Enter: () => (phase === "closing" ? open() : tap()),
        " ": tap,
        ArrowRight: tap,
    })

    // The light warms, very slightly, with each thought.
    const warmth = phase === "title" ? 0.35 : phase === "thought" ? 0.45 + (i / neverSay.length) * 0.45 : 1

    return (
        <div
            className="relative flex min-h-dvh w-full items-center justify-center overflow-hidden px-8"
            onClick={phase === "closing" || phase === "leaving" ? undefined : tap}
        >
            <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{ background: "radial-gradient(ellipse 60% 45% at 50% 46%, rgb(232 196 122 / 0.07), transparent 70%)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: phase === "leaving" ? 0 : warmth }}
                transition={{ duration: 3, ease: EASE_IN_OUT }}
            />

            <div className="relative w-full max-w-[21em]" style={{ fontSize: "clamp(1.5rem, 6.2vw, 2.5rem)" }}>
                <AnimatePresence mode="wait">
                    {phase === "title" && (
                        <motion.h2
                            key="title"
                            className="text-center font-display italic text-cream-muted"
                            style={{ fontSize: "0.72em", fontVariationSettings: '"SOFT" 100' }}
                            initial={{ opacity: 0, filter: "blur(6px)" }}
                            animate={{ opacity: 1, filter: "blur(0px)", transition: { duration: 1.6, ease: EASE_SOFT } }}
                            exit={{ opacity: 0, transition: { duration: 1, ease: EASE_EXIT } }}
                        >
                            things I never say.
                        </motion.h2>
                    )}

                    {phase === "thought" && (
                        <motion.div
                            key={`thought-${i}`}
                            exit={{ opacity: 0, y: -12, filter: "blur(5px)", transition: { duration: 1, ease: EASE_EXIT } }}
                        >
                            <motion.p
                                aria-hidden="true"
                                className="t-meta mb-6 text-cream-faint"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 1.2 }}
                            >
                                {two(i + 1)}
                            </motion.p>
                            <Thought text={neverSay[i].text} instant={full} />
                        </motion.div>
                    )}

                    {(phase === "closing" || phase === "leaving") && (
                        <motion.div
                            key="closing"
                            className="flex flex-col items-center text-center"
                            animate={{ opacity: phase === "leaving" ? 0 : 1, filter: phase === "leaving" ? "blur(4px)" : "blur(0px)" }}
                            transition={{ duration: 1.1, ease: EASE_IN_OUT }}
                        >
                            <Thought text={neverSayClosing} upright slow />
                            <div className="mt-14 min-h-12" style={{ fontSize: "1rem" }}>
                                <TextButton onClick={open} delay={reduced ? 0.3 : timing(neverSayClosing).total * 1.35 + 1.2}>
                                    {neverSayCta}
                                </TextButton>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {phase === "thought" && i === 0 && <TapHint delay={4.5} />}
        </div>
    )
}

// A thought, surfacing a word at a time. `instant` shows whatever hasn't arrived yet.
function Thought({ text, instant = false, upright = false, slow = false }) {
    const reduced = useReducedMotion()
    const { words, delays } = timing(text)
    const k = slow ? 1.35 : 1
    return (
        <p
            className={`font-display text-cream ${upright ? "" : "italic"}`}
            style={{ lineHeight: 1.32, letterSpacing: "-0.005em", fontVariationSettings: '"SOFT" 100' }}
        >
            <span className="sr-only" aria-live="polite">
                {text}
            </span>
            <span aria-hidden="true">
                {words.map((w, n) => (
                    <motion.span
                        key={n}
                        className="inline-block"
                        initial={{ opacity: 0, y: 6, filter: "blur(6px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={
                            instant || reduced
                                ? { duration: 0.35 }
                                : { duration: 0.9 * k, delay: 0.5 + delays[n] * k, ease: EASE_SOFT }
                        }
                    >
                        {w}&nbsp;
                    </motion.span>
                ))}
            </span>
        </p>
    )
}
