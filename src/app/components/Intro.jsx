"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { preloadImages } from "../data/memories"
import { usePreload } from "../hooks/usePreload"
import { useKeys } from "../hooks/useKey"
import { EASE_EXIT, EASE_IN_OUT, EASE_SOFT } from "./ui/motion"

// 01 — The Arrival.
//
//   dark → "I made something for you." → "Don't rush this." → Enter →
//   (music begins) → ANJALI → "today is yours." → push-in dissolve, leaving one warm
//   point of light that becomes the candle's flame in the next scene (a match cut).
//
// The photos preload quietly the whole time; this screen is the loader.

const NAME = "ANJALI"

// Timings (ms) for the pre-Enter sequence and the post-Enter reveal.
const T = {
    line1: 900,
    line2: 3900,
    enter: 6300,
    dissolve: 1300, // after Enter: the first screen dissolves
    name: 1500, // ANJALI begins
    yours: 4300, // "today is yours."
    handoff: 8200, // push-in + point of light
    next: 10000, // cut to the candle
}

export default function Intro({ onBegin, onHandoff, onDone, resumeLabel, onResume }) {
    const reduced = useReducedMotion()
    usePreload(preloadImages)

    // before: 0 = dark, 1 = line one, 2 = line two, 3 = Enter visible
    const [step, setStep] = useState(0)
    // after Enter: "idle" → "dissolve" → "name" → "yours" → "handoff"
    const [act, setAct] = useState("idle")
    const timers = useRef([])

    const later = (fn, ms) => timers.current.push(setTimeout(fn, reduced ? Math.min(ms, 400) : ms))
    useEffect(() => () => timers.current.forEach(clearTimeout), [])

    useEffect(() => {
        const ids = [
            setTimeout(() => setStep((s) => Math.max(s, 1)), reduced ? 100 : T.line1),
            setTimeout(() => setStep((s) => Math.max(s, 2)), reduced ? 200 : T.line2),
            setTimeout(() => setStep(3), reduced ? 300 : T.enter),
        ]
        return () => ids.forEach(clearTimeout)
    }, [reduced])

    const enter = () => {
        if (act !== "idle") return
        onBegin() // starts the soundtrack — this is the user gesture
        setAct("dissolve")
        later(() => setAct("name"), T.name)
        later(() => setAct("yours"), T.yours)
        later(() => {
            setAct("handoff")
            onHandoff()
        }, T.handoff)
        later(onDone, T.next)
    }

    // A tap before Enter appears doesn't skip the moment — it just brings Enter forward.
    const hurry = () => step < 3 && setStep(3)
    // During the name, a tap moves to the hand-off early (never skips the name entirely).
    const skipHold = () => {
        if (act !== "yours") return
        timers.current.forEach(clearTimeout)
        timers.current = []
        setAct("handoff")
        onHandoff()
        later(onDone, T.next - T.handoff)
    }

    useKeys(
        {
            Enter: () => (step < 3 ? hurry() : enter()),
            " ": () => (step < 3 ? hurry() : enter()),
        },
        act === "idle"
    )
    useKeys({ Enter: skipHold, " ": skipHold }, act === "yours")

    const before = act === "idle" || act === "dissolve"

    return (
        <div
            className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden"
            onClick={act === "idle" ? hurry : act === "yours" ? skipHold : undefined}
        >
            <Lamp act={act} />
            <Dust visible={act === "idle" || act === "dissolve"} />

            <AnimatePresence>
                {before && (
                    <motion.div
                        key="before"
                        className="relative z-10 flex flex-col items-center px-6 text-center"
                        animate={
                            act === "dissolve"
                                ? { opacity: 0, y: -10, filter: "blur(8px)" }
                                : { opacity: 1, y: 0, filter: "blur(0px)" }
                        }
                        transition={{ duration: 1.1, ease: EASE_IN_OUT }}
                        style={{ marginTop: "-6vh" }}
                    >
                        <Line show={step >= 1} dim={step >= 2}>
                            I made something for you.
                        </Line>
                        <div className="h-5" />
                        <Line show={step >= 2} muted>
                            Don&rsquo;t rush this.
                        </Line>

                        <div className="mt-16 flex min-h-[7.5rem] flex-col items-center">
                            {step >= 3 && <EnterButton onEnter={enter} pressed={act !== "idle"} />}
                            {step >= 3 && resumeLabel && act === "idle" && (
                                <motion.button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        onResume()
                                    }}
                                    className="t-meta mt-5 min-h-11 px-3 normal-case tracking-[0.04em] text-cream-faint underline decoration-cream/20 underline-offset-4 transition-colors hover:text-cream-muted"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 1, delay: 1.2 }}
                                >
                                    or continue from &ldquo;{resumeLabel}&rdquo;
                                </motion.button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Sets up the earphones moment in the timeline — quietly. */}
            <AnimatePresence>
                {step >= 3 && act === "idle" && (
                    <motion.p
                        key="earphones"
                        className="t-meta pointer-events-none absolute inset-x-0 z-10 text-center normal-case tracking-[0.06em] text-cream-faint"
                        style={{ bottom: "max(28px, calc(env(safe-area-inset-bottom) + 20px))" }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { duration: 1.4, delay: 1.6 } }}
                        exit={{ opacity: 0, transition: { duration: 0.6 } }}
                    >
                        best with earphones in
                    </motion.p>
                )}
            </AnimatePresence>

            {(act === "name" || act === "yours" || act === "handoff") && <NameCard act={act} reduced={reduced} />}
        </div>
    )
}

function Line({ show, dim, muted, children }) {
    return (
        <motion.p
            className={`font-display italic ${muted ? "text-cream-muted" : "text-cream"}`}
            style={{ fontSize: "clamp(1.3125rem, 4.8vw, 1.75rem)", lineHeight: 1.3, fontVariationSettings: '"SOFT" 100' }}
            initial={{ opacity: 0, y: 10, filter: "blur(8px)", letterSpacing: "0.02em" }}
            animate={
                show
                    ? { opacity: dim ? 0.62 : 1, y: 0, filter: "blur(0px)", letterSpacing: "0em" }
                    : { opacity: 0, y: 10, filter: "blur(8px)", letterSpacing: "0.02em" }
            }
            transition={{ duration: dim && show ? 1.6 : 1.8, ease: EASE_SOFT }}
            aria-hidden={!show}
        >
            {children}
        </motion.p>
    )
}

function EnterButton({ onEnter, pressed }) {
    return (
        <motion.button
            type="button"
            onClick={(e) => {
                e.stopPropagation()
                onEnter()
            }}
            disabled={pressed}
            aria-label="Enter"
            className="group relative flex min-h-12 min-w-36 items-center justify-center gap-3 px-6 py-3"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: EASE_SOFT }}
        >
            <span className="font-sans text-[0.8125rem] font-medium uppercase tracking-[0.32em] text-cream transition-colors duration-300 group-hover:text-paper-50">
                Enter
            </span>
            <span
                aria-hidden="true"
                className="text-gold transition-transform duration-300 ease-out group-hover:translate-x-1"
            >
                &rarr;
            </span>

            {/* A gold hairline that draws in from the centre, and opens outward like light on press. */}
            <motion.span
                aria-hidden="true"
                className="absolute bottom-1 left-1/2 h-px w-[calc(100%-2.5rem)] -translate-x-1/2 bg-gold/70 group-hover:bg-gold"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={pressed ? { scaleX: 4, opacity: 0 } : { scaleX: 1, opacity: 1 }}
                transition={
                    pressed
                        ? { duration: 1.1, ease: EASE_SOFT }
                        : { duration: 1.6, delay: 0.4, ease: EASE_SOFT }
                }
            />
            {pressed && (
                <motion.span
                    aria-hidden="true"
                    className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{ background: "radial-gradient(circle, rgb(232 196 122 / 0.22), transparent 65%)" }}
                    initial={{ scale: 0.3, opacity: 0 }}
                    animate={{ scale: 2.4, opacity: [0, 1, 0] }}
                    transition={{ duration: 1.3, ease: "easeOut" }}
                />
            )}
        </motion.button>
    )
}

function NameCard({ act, reduced }) {
    const leaving = act === "handoff"
    return (
        <motion.div
            className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 text-center"
            style={{ marginTop: "-4vh" }}
            initial={{ opacity: 1, scale: 1 }}
            animate={
                leaving
                    ? { opacity: 0, scale: 1.07, filter: "blur(10px)" }
                    : { opacity: 1, scale: 1, filter: "blur(0px)" }
            }
            transition={leaving ? { duration: 1.7, ease: EASE_IN_OUT } : { duration: 0.3 }}
        >
            <motion.h1
                aria-label="Anjali"
                className="whitespace-nowrap font-display font-light text-cream"
                style={{ fontSize: "clamp(3.25rem, 15vw, 8.5rem)", lineHeight: 1, fontVariationSettings: '"SOFT" 100, "opsz" 144' }}
                initial={{ letterSpacing: "0.42em", paddingLeft: "0.42em" }}
                animate={{ letterSpacing: "0.16em", paddingLeft: "0.16em" }}
                transition={{ duration: reduced ? 0 : 4.2, ease: EASE_SOFT }}
            >
                {NAME.split("").map((ch, i) => (
                    <motion.span
                        key={i}
                        aria-hidden="true"
                        className="inline-block"
                        initial={{ opacity: 0, filter: "blur(12px)", y: 6 }}
                        animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                        transition={{ duration: 1.8, delay: 0.15 + i * 0.11, ease: EASE_SOFT }}
                    >
                        {ch}
                    </motion.span>
                ))}
            </motion.h1>

            <div className="mt-7 min-h-9 sm:mt-9">
                {(act === "yours" || leaving) && (
                    <motion.p
                        className="font-display italic text-cream-muted"
                        style={{ fontSize: "clamp(1.125rem, 4.4vw, 1.5rem)", fontVariationSettings: '"SOFT" 100' }}
                        initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ duration: 1.6, ease: EASE_SOFT }}
                    >
                        today is yours.
                    </motion.p>
                )}
            </div>
        </motion.div>
    )
}

// Soft light: an overhead wash on the first screen that settles behind the name,
// then falls away entirely so only the point of light remains.
function Lamp({ act }) {
    const target =
        act === "idle"
            ? { opacity: 1, background: "radial-gradient(ellipse 70% 55% at 50% 30%, rgb(232 196 122 / 0.075), transparent 70%)" }
            : act === "dissolve"
                ? { opacity: 0.35, background: "radial-gradient(ellipse 70% 55% at 50% 30%, rgb(232 196 122 / 0.075), transparent 70%)" }
                : act === "handoff"
                    ? { opacity: 0, background: "radial-gradient(ellipse 60% 40% at 50% 46%, rgb(232 196 122 / 0.06), transparent 70%)" }
                    : { opacity: 1, background: "radial-gradient(ellipse 60% 40% at 50% 46%, rgb(232 196 122 / 0.06), transparent 70%)" }

    return (
        <>
            <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                initial={{ opacity: 0, background: target.background }}
                animate={target}
                transition={{ duration: act === "idle" ? 3.2 : 1.6, ease: EASE_IN_OUT }}
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 35%, rgb(0 0 0 / 0.55) 100%)" }}
            />
        </>
    )
}

// Restrained particles: a few motes of dust drifting in the light, nothing more.
const MOTES = [
    [18, 28, 1.6, 26, 0.28], [31, 62, 2.2, 31, 0.22], [44, 20, 1.4, 23, 0.3], [57, 71, 1.8, 29, 0.2],
    [66, 34, 2.4, 34, 0.24], [74, 55, 1.5, 25, 0.26], [82, 24, 1.9, 30, 0.18], [24, 48, 1.3, 27, 0.2],
    [50, 42, 1.7, 33, 0.16], [38, 80, 2, 28, 0.18], [62, 14, 1.4, 24, 0.22], [88, 66, 1.6, 32, 0.16],
]

function Dust({ visible }) {
    return (
        <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: visible ? 1 : 0 }}
            transition={{ duration: visible ? 4 : 1.2, delay: visible ? 1 : 0, ease: EASE_EXIT }}
        >
            {MOTES.map(([x, y, size, dur, alpha], i) => (
                <span
                    key={i}
                    className="dust absolute rounded-full bg-gold-soft"
                    style={{
                        left: `${x}%`,
                        top: `${y}%`,
                        width: size,
                        height: size,
                        "--a": alpha,
                        animationDuration: `${dur}s`,
                        animationDelay: `${-i * 2.3}s`,
                    }}
                />
            ))}
        </motion.div>
    )
}
