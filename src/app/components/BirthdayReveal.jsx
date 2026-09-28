"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import confetti from "canvas-confetti"
import { useKeys } from "../hooks/useKey"
import { useSound } from "./sound/SoundProvider"
import { TextButton } from "./ui"
import { EASE_IN_OUT, EASE_SOFT, arrive, fade } from "./ui/motion"

// 02 — Birthday Reveal. The first big emotional payoff.
//
//   the candle (handed over from the arrival as a point of light) → make a wish → blow →
//   the room settles into darkness → a spark rises from the wick and opens into a gold line →
//   ANJALI. rises out of the line as the music swells → HAPPY BIRTHDAY, settles above it →
//   one elegant burst of confetti → "this is your present, Anjali." → continue.
//
// Layout sits on the shared stage (--flame-y, --reveal-y in globals.css) so the handoff
// light, the flame, the spark and the line all meet at exact positions on every screen.

// ms after the tap
const T = {
    settle: 900, // candle fades, the room goes dark
    spark: 1500, // spark leaves the wick
    line: 2700, // spark becomes the gold line
    name: 3100, // ANJALI. rises
    title: 4300, // HAPPY BIRTHDAY,
    confetti: 4700,
    message: 6200,
    aside: 7200,
    cta: 8400,
}

const ORDER = ["wish", "blown", "settle", "spark", "line", "name", "title", "confetti", "message", "aside", "cta"]

export default function BirthdayReveal({ onNext, onArrived }) {
    const reduced = useReducedMotion()
    const { ensure, setLevel } = useSound()
    const [stage, setStage] = useState("wish")
    const [prompt, setPrompt] = useState(false)
    const timers = useRef([])
    const fired = useRef(false)

    const reached = (name) => ORDER.indexOf(stage) >= ORDER.indexOf(name)

    // The arrival's point of light fades once the real flame is lit underneath it.
    useEffect(() => {
        const id = setTimeout(() => onArrived?.(), 1300)
        return () => clearTimeout(id)
    }, [onArrived])

    useEffect(() => {
        const id = setTimeout(() => setPrompt(true), 4200)
        const all = timers.current
        return () => {
            clearTimeout(id)
            all.forEach(clearTimeout)
        }
    }, [])

    const celebrate = () => {
        if (fired.current || reduced) return
        fired.current = true
        burst()
    }

    const blow = () => {
        if (stage !== "wish") return
        ensure() // this tap is a user gesture: make sure the soundtrack is actually playing
        setStage("blown")
        setLevel(0.1, 500)
        const at = (name, ms, fn) =>
            timers.current.push(
                setTimeout(() => {
                    setStage(name)
                    fn?.()
                }, reduced ? Math.min(ms / 6, 900) : ms)
            )
        at("settle", T.settle)
        at("spark", T.spark)
        at("line", T.line)
        at("name", T.name, () => setLevel(0.75, 2400)) // the release
        at("title", T.title)
        at("confetti", T.confetti, celebrate)
        at("message", T.message)
        at("aside", T.aside)
        at("cta", T.cta)
    }

    // A tap during the reveal fast-forwards to the finished frame (confetti still fires once).
    const finish = () => {
        if (stage === "wish" || stage === "cta") return
        timers.current.forEach(clearTimeout)
        timers.current = []
        setLevel(0.75, 1200)
        celebrate()
        setStage("cta")
    }

    useKeys({
        Enter: () => (stage === "wish" ? blow() : stage === "cta" ? onNext() : finish()),
        " ": () => (stage === "wish" ? blow() : finish()),
    })

    const lit = stage === "wish"
    const candleGone = reached("settle")

    return (
        <motion.div
            className="relative w-full overflow-hidden text-center"
            style={{ height: "var(--stage-h)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 1.4 } }}
            onClick={stage !== "wish" ? finish : undefined}
        >
            {/* The candle's pool of light — the only light in the room until the wish. */}
            <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                    background:
                        "radial-gradient(circle at 50% calc(var(--flame-ratio) * 100%), rgb(232 196 122 / 0.20), rgb(232 196 122 / 0.05) 30%, transparent 55%)",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: lit ? 1 : 0 }}
                transition={{ duration: lit ? 2.4 : 0.7 }}
            />

            {/* Warm light behind the name, rising with it. */}
            <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                    background:
                        "radial-gradient(ellipse 75% 45% at 50% calc(var(--reveal-ratio) * 100% - 4%), rgb(232 196 122 / 0.16), rgb(217 164 65 / 0.05) 45%, transparent 75%)",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: reached("name") ? (reached("confetti") ? 0.75 : 1) : 0 }}
                transition={{ duration: 2.4, ease: EASE_IN_OUT }}
            />

            {/* ---------- Before the wish ---------- */}

            {lit && (
                <button
                    type="button"
                    tabIndex={-1}
                    aria-hidden="true"
                    onClick={blow}
                    className="absolute inset-x-0 bottom-0 z-0 h-1/2 cursor-pointer"
                />
            )}

            <AnimatePresence>
                {lit && (
                    <motion.div
                        key="wish"
                        className="absolute inset-x-0 z-10 flex flex-col items-center px-6"
                        style={{ bottom: "calc(var(--stage-h) * (1 - var(--flame-ratio)) + 72px)" }}
                        exit={{ opacity: 0, y: -6, filter: "blur(4px)", transition: { duration: 0.6 } }}
                    >
                        <motion.p className="t-title text-cream" {...arrive(2)}>
                            make a wish first.
                        </motion.p>
                        <p className="t-caption mt-4 min-h-8 text-cream-muted">
                            {prompt && (
                                <motion.span {...fade(0, 0.9)} className="inline-block">
                                    now tap to blow it out.
                                </motion.span>
                            )}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* The candle: its flame centre sits exactly on --flame-y. */}
            <motion.button
                type="button"
                onClick={blow}
                disabled={!lit}
                aria-label="Blow out the candle"
                className="absolute left-1/2 z-10 -translate-x-1/2 cursor-pointer disabled:cursor-default"
                style={{ top: "calc(var(--flame-y) - var(--candle-h) * 0.1714)" }}
                animate={{ opacity: candleGone ? 0 : 1, y: candleGone ? 10 : 0 }}
                transition={{ duration: 1.4, ease: EASE_IN_OUT }}
            >
                <Candle lit={lit} blown={!lit} />
            </motion.button>

            {/* ---------- The reveal ---------- */}

            {/* The spark: leaves the wick and climbs to where the line will be. */}
            <AnimatePresence>
                {reached("spark") && !reached("line") && (
                    <motion.span
                        key="spark"
                        aria-hidden="true"
                        className="absolute left-1/2 z-10 block h-[5px] w-[5px] -translate-x-1/2 rounded-full bg-gold-soft"
                        style={{ boxShadow: "0 0 10px 3px rgb(232 196 122 / 0.55)" }}
                        initial={{ top: "calc(var(--flame-y) - 6px)", opacity: 0, scale: 0.6 }}
                        animate={{ top: "calc(var(--reveal-y) - 2px)", opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.6, transition: { duration: 0.35 } }}
                        transition={{ duration: 1.2, ease: EASE_IN_OUT }}
                    />
                )}
            </AnimatePresence>

            {/* HAPPY BIRTHDAY, / ANJALI. — sitting on the gold line. */}
            <div
                className="pointer-events-none absolute inset-x-0 z-10 flex flex-col items-center px-4"
                style={{ bottom: "calc(var(--stage-h) - var(--reveal-y))" }}
            >
                <h1 aria-label="Happy birthday, Anjali." className="flex flex-col items-center">
                    <motion.span
                        aria-hidden="true"
                        className="block font-display uppercase text-cream"
                        style={{
                            fontSize: "clamp(0.9375rem, min(4.4vw, 4.4dvh), 1.5rem)",
                            fontVariationSettings: '"SOFT" 50',
                            fontWeight: 420,
                        }}
                        initial={{ opacity: 0, y: 8, filter: "blur(6px)", letterSpacing: "0.5em" }}
                        animate={
                            reached("title")
                                ? { opacity: 1, y: 0, filter: "blur(0px)", letterSpacing: "0.34em" }
                                : { opacity: 0, y: 8, filter: "blur(6px)", letterSpacing: "0.5em" }
                        }
                        transition={{ duration: 1.8, ease: EASE_SOFT }}
                    >
                        <span style={{ paddingLeft: "0.34em" }}>Happy Birthday,</span>
                    </motion.span>

                    {/* The name rises out of the line, as if from behind it. */}
                    <span aria-hidden="true" className="mt-3 block overflow-hidden px-2 sm:mt-5" style={{ paddingBottom: "0.08em" }}>
                        <motion.span
                            className="block whitespace-nowrap font-display uppercase text-cream"
                            style={{
                                fontSize: "clamp(3.25rem, min(17vw, 17dvh), 9.5rem)",
                                lineHeight: 0.95,
                                letterSpacing: "0.04em",
                                fontWeight: 360,
                                fontVariationSettings: '"SOFT" 100, "opsz" 144',
                            }}
                            initial={{ y: "105%" }}
                            animate={{ y: reached("name") ? "0%" : "105%" }}
                            transition={{ duration: 1.5, ease: EASE_SOFT }}
                        >
                            Anjali<span className="text-gold">.</span>
                        </motion.span>
                    </span>
                </h1>
            </div>

            {/* The gold line — the spark, opened out. */}
            <motion.span
                aria-hidden="true"
                className="absolute left-1/2 z-10 block h-px -translate-x-1/2 bg-gold/80"
                style={{ top: "var(--reveal-y)", width: "min(56vw, 360px)" }}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={reached("line") ? { scaleX: 1, opacity: reached("title") ? 0.55 : 1 } : { scaleX: 0, opacity: 0 }}
                transition={{ duration: 0.9, ease: EASE_SOFT }}
            />

            {/* Supporting message, then the way forward. */}
            <div
                className="pointer-events-none absolute inset-x-0 z-10 flex flex-col items-center px-6"
                style={{ top: "calc(var(--reveal-y) + clamp(22px, 4dvh, 40px))" }}
            >
                <motion.p
                    className="t-caption text-cream"
                    initial={{ opacity: 0 }}
                    animate={reached("message") ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 8, filter: "blur(6px)" }}
                    transition={{ duration: 1.4, ease: EASE_SOFT }}
                >
                    this is your present, Anjali.
                </motion.p>
                <motion.p
                    className="t-caption mt-1 text-cream-muted"
                    initial={{ opacity: 0 }}
                    animate={reached("aside") ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 8, filter: "blur(6px)" }}
                    transition={{ duration: 1.4, ease: EASE_SOFT }}
                >
                    there&rsquo;s more inside. take your time.
                </motion.p>
            </div>

            <div
                className="absolute inset-x-0 z-20 flex justify-center"
                style={{ top: "calc(var(--reveal-y) + clamp(100px, 17dvh, 170px))" }}
            >
                {reached("cta") && (
                    <TextButton
                        onClick={(e) => {
                            e.stopPropagation()
                            onNext()
                        }}
                        delay={0.2}
                    >
                        see what&rsquo;s inside
                    </TextButton>
                )}
            </div>
        </motion.div>
    )
}

// One intentional celebration: two soft bursts of paper confetti rising from the lower
// corners in the site's own palette, then drifting down slowly. Fires once, never loops.
function burst() {
    const w = window.innerWidth
    const h = window.innerHeight
    const small = w < 640
    const shared = {
        particleCount: small ? 42 : 70,
        spread: small ? 48 : 55,
        startVelocity: Math.min(58, Math.max(34, h / 15)),
        gravity: 0.7,
        decay: 0.915,
        ticks: 340,
        scalar: small ? 0.85 : 1,
        drift: 0,
        shapes: ["square", "square", "circle"],
        colors: ["#D9A441", "#E8C47A", "#F2EADF", "#FBF7F0", "#D8C6AD", "#C98C8C"],
        zIndex: 30,
        disableForReducedMotion: true,
    }
    confetti({ ...shared, angle: small ? 72 : 62, origin: { x: small ? 0.08 : 0.12, y: 1.02 } })
    confetti({ ...shared, angle: small ? 108 : 118, origin: { x: small ? 0.92 : 0.88, y: 1.02 } })
    // A small, late sprinkle from above the name, so the air settles rather than just ends.
    setTimeout(() => {
        confetti({
            ...shared,
            particleCount: small ? 16 : 26,
            angle: 90,
            spread: 120,
            startVelocity: 8,
            gravity: 0.45,
            ticks: 300,
            origin: { x: 0.5, y: 0.18 },
        })
    }, 420)
}

function Candle({ lit, blown }) {
    return (
        <svg width="64" height="210" viewBox="0 0 64 210" aria-hidden="true" className="overflow-visible" style={{ height: "var(--candle-h)", width: "auto" }}>
            <defs>
                <linearGradient id="wax" x1="0" x2="1">
                    <stop offset="0" stopColor="#D8C6AD" />
                    <stop offset="0.45" stopColor="#FBF7F0" />
                    <stop offset="1" stopColor="#E9DDCB" />
                </linearGradient>
                <radialGradient id="flame" cx="0.5" cy="0.72" r="0.62">
                    <stop offset="0" stopColor="#FFF4DC" />
                    <stop offset="0.35" stopColor="#E8C47A" />
                    <stop offset="0.75" stopColor="#E0773A" />
                    <stop offset="1" stopColor="#E0773A" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="halo" cx="0.5" cy="0.5" r="0.5">
                    <stop offset="0" stopColor="#E8C47A" stopOpacity="0.45" />
                    <stop offset="1" stopColor="#E8C47A" stopOpacity="0" />
                </radialGradient>
            </defs>

            {/* halo */}
            <motion.circle
                className={lit ? "candle-glow" : undefined}
                cx="32" cy="36" r="34" fill="url(#halo)"
                initial={{ opacity: 1 }}
                animate={{ opacity: lit ? 1 : 0 }}
                transition={{ duration: 0.5 }}
            />

            {/* flame */}
            <motion.g
                style={{ originX: "32px", originY: "58px" }}
                initial={{ opacity: 1, scaleY: 1, skewX: 0 }}
                animate={lit ? { opacity: 1, scaleY: 1, skewX: 0 } : { opacity: 0, scaleY: 0.2, skewX: 14 }}
                transition={{ duration: lit ? 0.6 : 0.5, ease: EASE_SOFT }}
            >
                <path
                    className="flame"
                    d="M32 14 C 38 26, 43 36, 42 46 C 41 54, 36 58, 32 58 C 28 58, 23 54, 22 46 C 21 36, 26 26, 32 14 Z"
                    fill="url(#flame)"
                />
            </motion.g>

            {/* smoke, once */}
            {blown && (
                <motion.path
                    d="M32 56 C 26 44, 38 36, 31 24 C 25 14, 36 6, 32 -8"
                    fill="none"
                    stroke="rgb(242 234 223 / 0.35)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0, y: 0 }}
                    animate={{ pathLength: 1, opacity: [0, 0.8, 0], y: -26 }}
                    transition={{ duration: 1.8, ease: "easeOut" }}
                />
            )}

            {/* wick */}
            <line x1="32" y1="52" x2="32" y2="64" stroke="#2A221D" strokeWidth="2" strokeLinecap="round" />

            {/* wax */}
            <rect x="21" y="62" width="22" height="146" rx="3" fill="url(#wax)" />
            <ellipse cx="32" cy="63" rx="11" ry="2.5" fill="#FBF7F0" />
        </svg>
    )
}
