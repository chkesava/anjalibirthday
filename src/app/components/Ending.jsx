"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { ending } from "../data/story"
import { useSound } from "./sound/SoundProvider"
import SystemStatus from "./SystemStatus"
import { EASE_EXIT, EASE_IN_OUT, EASE_SOFT } from "./ui/motion"

// 08 — The ending. Visually quiet, warm, complete. No buttons.
//
//   "That's it."  "No fancy ending."  "Just…"  →  HAPPY BIRTHDAY, ANJALI. ❤
//   → "I'm really glad you're my friend."  → — Kesava  → made with way too much code.
//
// A tap anywhere shows the finished frame. The last line is secretly the developer's
// corner (system status, TODO, git log, and "watch it again").

// ms from mount
const T = { lead: [900, 3100, 5300], clear: 7900, title: 9300, glad: 12600, from: 14800, sig: 17600 }
const ORDER = ["dark", "lead0", "lead1", "lead2", "clear", "title", "glad", "from", "sig"]

export default function Ending({ onReplay }) {
    const reduced = useReducedMotion()
    const { setLevel } = useSound()
    const [stage, setStage] = useState("dark")
    const timers = useRef([])
    const at = (name) => ORDER.indexOf(stage) >= ORDER.indexOf(name)

    useEffect(() => {
        const s = reduced ? 0.15 : 1
        const plan = [
            ["lead0", T.lead[0]],
            ["lead1", T.lead[1]],
            ["lead2", T.lead[2]],
            ["clear", T.clear],
            ["title", T.title],
            ["glad", T.glad],
            ["from", T.from],
            ["sig", T.sig],
        ]
        timers.current = plan.map(([name, ms]) => setTimeout(() => setStage(name), ms * s))
        // The song settles as the ending does.
        timers.current.push(setTimeout(() => setLevel(0.42, 3000), T.title * s))
        timers.current.push(setTimeout(() => setLevel(0.3, 9000), T.from * s))
        const all = timers.current
        return () => all.forEach(clearTimeout)
    }, [reduced, setLevel])

    const finish = () => {
        if (at("sig")) return
        timers.current.forEach(clearTimeout)
        setLevel(0.36, 2000)
        setStage("sig")
    }

    const leadVisible = at("lead0") && !at("clear")

    return (
        <div className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden px-6 text-center" onClick={finish}>
            {/* one soft light, arriving with her name */}
            <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{ background: "radial-gradient(ellipse 65% 42% at 50% 44%, rgb(232 196 122 / 0.075), transparent 72%)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: at("title") ? 1 : at("lead0") ? 0.35 : 0 }}
                transition={{ duration: 3.4, ease: EASE_IN_OUT }}
            />

            <div className="relative -mt-[6vh] flex min-h-[18rem] w-full flex-col items-center justify-center">
                <AnimatePresence mode="wait">
                    {leadVisible && (
                        <motion.div key="lead" className="flex flex-col items-center gap-5" exit={{ opacity: 0, filter: "blur(4px)", transition: { duration: 1.2, ease: EASE_EXIT } }}>
                            {ending.lead.map((line, i) => (
                                <motion.p
                                    key={line}
                                    className="font-display italic text-cream-muted"
                                    style={{ fontSize: "clamp(1.3125rem, 5vw, 1.75rem)", fontVariationSettings: '"SOFT" 100' }}
                                    initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
                                    animate={at(`lead${i}`) ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 8, filter: "blur(6px)" }}
                                    transition={{ duration: 1.6, ease: EASE_SOFT }}
                                >
                                    {line}
                                </motion.p>
                            ))}
                        </motion.div>
                    )}

                    {at("title") && (
                        <motion.div key="end" className="flex flex-col items-center" initial={{ opacity: 1 }}>
                            <h1 aria-label="Happy Birthday, Anjali." className="font-display uppercase text-cream" style={{ fontSize: "clamp(1.75rem, 7.8vw, 5rem)", lineHeight: 1.1, letterSpacing: "0.05em", fontWeight: 330, fontVariationSettings: '"SOFT" 100' }}>
                                {ending.title.map((line, i) => (
                                    <motion.span
                                        key={line}
                                        aria-hidden="true"
                                        className="block whitespace-nowrap"
                                        initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                        transition={{ duration: 2, delay: i * 0.9, ease: EASE_SOFT }}
                                    >
                                        {line}
                                        {i === ending.title.length - 1 && (
                                            <motion.span
                                                className="ml-[0.28em] inline-block text-[0.62em] text-rose"
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ duration: 1.4, delay: 2.2, ease: EASE_SOFT }}
                                            >
                                                {"❤︎"}
                                            </motion.span>
                                        )}
                                    </motion.span>
                                ))}
                            </h1>

                            <motion.p
                                className="mt-10 font-display italic text-cream"
                                style={{ fontSize: "clamp(1.1875rem, 4.6vw, 1.5rem)", fontVariationSettings: '"SOFT" 100' }}
                                initial={{ opacity: 0, y: 8 }}
                                animate={at("glad") ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                                transition={{ duration: 1.8, ease: EASE_SOFT }}
                            >
                                {ending.glad}
                            </motion.p>

                            <motion.p
                                className="mt-6 font-hand text-[1.875rem] leading-none text-cream-muted"
                                initial={{ clipPath: "inset(0 100% 0 0)" }}
                                animate={at("from") ? { clipPath: "inset(0 0% 0 0)" } : { clipPath: "inset(0 100% 0 0)" }}
                                transition={{ duration: 1.6, ease: EASE_IN_OUT }}
                            >
                                {ending.from}
                            </motion.p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: at("sig") ? 1 : 0 }}
                transition={{ duration: 2.4 }}
                onClick={(e) => e.stopPropagation()}
                style={{ pointerEvents: at("sig") ? "auto" : "none" }}
            >
                <SystemStatus label={ending.signature} onReplay={onReplay} />
            </motion.div>
        </div>
    )
}
