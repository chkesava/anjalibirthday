"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { BIRTHDAY } from "../data/config"
import { useKeys } from "../hooks/useKey"
import Envelope from "./letter/Envelope"
import LetterSheet from "./letter/LetterSheet"
import { EASE_IN_OUT, EASE_SOFT } from "./ui/motion"

// 06 — The Letter.
//
//   an envelope arrives → she presses and holds the wax seal → it cracks, the flap swings up,
//   the letter rises out → the room lights up onto paper and the sheet settles into place →
//   the words surface at reading pace → she folds it and keeps it: it slips back into the
//   envelope and the seal is pressed on again → "kept." (or she reads it again first).
//
// The words come from public/letter.txt, unchanged.

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const [yy, mm, dd] = BIRTHDAY.slice(0, 10).split("-").map(Number)
const handDate = `${dd} ${MONTHS[mm - 1]} ${yy}`
const postmark = `${String(dd).padStart(2, "0")}.${String(mm).padStart(2, "0")}\n${yy}`

export default function Letter({ text, onNext, onBack }) {
    const reduced = useReducedMotion()
    // envelope → opening → read → keeping → kept
    const [phase, setPhase] = useState("envelope")
    const [prompt, setPrompt] = useState(false)
    const [nudged, setNudged] = useState(false) // a quick tap on the seal: ask her to hold it
    const timers = useRef([])
    const later = (fn, ms) => timers.current.push(setTimeout(fn, reduced ? Math.min(ms, 500) : ms))

    useEffect(() => {
        const id = setTimeout(() => setPrompt(true), 1800)
        const all = timers.current
        return () => {
            clearTimeout(id)
            all.forEach(clearTimeout)
        }
    }, [])

    const open = () => {
        if (phase !== "envelope") return
        setPhase("opening")
        later(() => {
            window.scrollTo(0, 0)
            setPhase("read")
        }, 3900)
    }

    const keep = () => {
        if (phase !== "read") return
        window.scrollTo(0, 0)
        setPhase("keeping")
        later(() => setPhase("kept"), 3600)
        later(onNext, 6200)
    }

    useKeys({ Enter: open, " ": open }, phase === "envelope")

    const paperUp = phase === "opening" || phase === "read"

    return (
        <div className="relative min-h-dvh">
            {/* Lights up onto paper as the letter comes out; down again as it's put away. */}
            <AnimatePresence>
                {paperUp && (
                    <motion.div
                        key="paper"
                        aria-hidden="true"
                        className="paper-surface fixed inset-0 z-0"
                        initial={{ clipPath: "circle(0% at 50% 42%)" }}
                        animate={{ clipPath: "circle(150% at 50% 42%)", transition: { duration: 1.5, delay: reduced ? 0 : 2.7, ease: EASE_IN_OUT } }}
                        exit={{ opacity: 0, transition: { duration: 1.2, ease: EASE_IN_OUT } }}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
                {(phase === "envelope" || phase === "opening") && (
                    <motion.div
                        key="envelope"
                        className="night-vignette relative z-10 flex min-h-dvh flex-col items-center justify-center px-6 pb-[10vh]"
                        exit={{ opacity: 0, transition: { duration: 0.4 } }}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 26, rotate: -1.2 }}
                            animate={
                                phase === "opening"
                                    ? { opacity: [1, 1, 0], y: [0, 0, 40], rotate: 0, transition: { duration: 3.3, times: [0, 0.84, 1], ease: EASE_IN_OUT } }
                                    : { opacity: 1, y: 0, rotate: -1.2, transition: { duration: 1.2, delay: 0.3, ease: EASE_SOFT } }
                            }
                        >
                            <Envelope
                                state={phase === "opening" ? "opening" : "sealed"}
                                onBreak={open}
                                onNudge={() => {
                                    setNudged(true)
                                    setPrompt(true)
                                }}
                                to="Anjali"
                                postmark={postmark}
                            />
                        </motion.div>
                        <motion.p
                            className="t-meta mt-12 normal-case tracking-[0.04em] text-cream-faint"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: prompt && phase === "envelope" ? 1 : 0 }}
                            transition={{ duration: 1.2 }}
                            aria-live="polite"
                        >
                            {nudged ? "hold it a moment longer" : "press and hold the seal"}
                        </motion.p>
                    </motion.div>
                )}

                {phase === "read" && (
                    <motion.div key="sheet" exit={{ opacity: 0, y: -10, transition: { duration: 0.8, ease: EASE_IN_OUT } }}>
                        <LetterSheet text={text} date={handDate} onKeep={keep} onBack={onBack} />
                    </motion.div>
                )}

                {(phase === "keeping" || phase === "kept") && (
                    <motion.div
                        key="keeping"
                        className="night-vignette relative z-10 flex min-h-dvh flex-col items-center justify-center px-6 pb-[10vh]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { duration: 1 } }}
                        exit={{ opacity: 0, transition: { duration: 0.8 } }}
                    >
                        <motion.div
                            initial={{ y: 30, rotate: 0 }}
                            animate={{ y: 0, rotate: phase === "kept" ? -1.2 : 0 }}
                            transition={{ duration: 1.2, ease: EASE_SOFT }}
                        >
                            <Envelope state="closing" to="Anjali" postmark={postmark} />
                        </motion.div>
                        <motion.p
                            className="mt-12 font-display italic text-cream-muted"
                            style={{ fontSize: "clamp(1.125rem, 4.4vw, 1.375rem)" }}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: phase === "kept" ? 1 : 0, y: phase === "kept" ? 0 : 6 }}
                            transition={{ duration: 1.4, ease: EASE_SOFT }}
                        >
                            kept.
                        </motion.p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
