"use client"

import { useEffect, useRef, useState } from "react"
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react"
import { EASE_IN_OUT, EASE_SOFT } from "../ui/motion"

const HOLD_MS = 850

/**
 * A paper envelope, built in layers so it can really open and close:
 *   back → (open flap) → letter → front pocket → (closed flap) → wax seal
 *
 * state: "sealed"  waiting; press and hold the seal to break it
 *        "opening" seal cracks, flap swings up showing the lining, the letter rises out
 *        "closing" the folded letter slips back in, the flap closes, the seal is pressed on again
 */
export default function Envelope({ state = "sealed", onBreak, onNudge, postmark, to }) {
    const reduced = useReducedMotion()
    const open = state === "opening"
    const closing = state === "closing"
    // Which side of the letter the flap is on — swaps as the flap passes 90°.
    const [flapInFront, setFlapInFront] = useState(!closing)

    useEffect(() => {
        if (state === "opening") {
            const id = setTimeout(() => setFlapInFront(false), reduced ? 0 : 750)
            return () => clearTimeout(id)
        }
        if (state === "closing") {
            setFlapInFront(false)
            const id = setTimeout(() => setFlapInFront(true), reduced ? 0 : 2150)
            return () => clearTimeout(id)
        }
    }, [state, reduced])

    const flapRotate = open ? 180 : closing ? [180, 180, 0] : 0
    const flapTransition = open
        ? { duration: 0.9, delay: 0.3, ease: EASE_IN_OUT }
        : closing
            ? { duration: 2.6, times: [0, 0.6, 1], ease: EASE_IN_OUT }
            : { duration: 0 }

    const letterY = open ? "-58%" : closing ? ["-58%", "-58%", "0%"] : "0%"
    const letterTransition = open
        ? { duration: 0.95, delay: 1.1, ease: EASE_SOFT }
        : closing
            ? { duration: 1.7, times: [0, 0.45, 1], ease: EASE_IN_OUT }
            : { duration: 0 }

    return (
        <div className="relative" style={{ width: "min(86vw, 420px)", aspectRatio: "1.6 / 1", perspective: "1100px" }}>
            {/* back */}
            <div
                className="paper-grain absolute inset-0 rounded-[3px] bg-paper-200"
                style={{ boxShadow: "0 1px 2px rgb(14 12 11 / .35), 0 18px 40px -12px rgb(14 12 11 / .55), 0 44px 90px -30px rgb(14 12 11 / .6)" }}
            />

            {/* flap — two faces: paper outside, lined inside */}
            <motion.div
                className="absolute inset-x-0 top-0 h-[58%]"
                style={{ transformOrigin: "50% 0%", transformStyle: "preserve-3d", zIndex: flapInFront ? 5 : 1 }}
                initial={closing ? { rotateX: 180 } : false}
                animate={{ rotateX: flapRotate }}
                transition={flapTransition}
            >
                <div
                    className="paper-grain absolute inset-0 bg-paper-300"
                    style={{
                        clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                        backfaceVisibility: "hidden",
                        backgroundImage:
                            "linear-gradient(to bottom, rgb(255 255 255 / .12), transparent 60%), linear-gradient(to top, rgb(42 34 29 / .10), transparent 30%)",
                    }}
                />
                <div
                    className="envelope-lining absolute inset-0"
                    style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)", backfaceVisibility: "hidden", transform: "rotateX(180deg)" }}
                />
            </motion.div>

            {/* the letter, folded, inside */}
            <motion.div
                className="paper-grain absolute inset-x-[6%] top-[6%] h-[86%] rounded-[2px] bg-paper-50"
                style={{ zIndex: 2, boxShadow: "0 1px 2px rgb(42 34 29 / .15)" }}
                initial={closing ? { y: "-58%" } : false}
                animate={{ y: letterY }}
                transition={letterTransition}
            >
                <div aria-hidden="true" className="mx-[11%] mt-[11%] space-y-[7px]">
                    <div className="h-[6px] w-[34%] rounded-full bg-ink/15" style={{ transform: "skewX(-12deg)" }} />
                    {[92, 86, 90, 60].map((w) => (
                        <div key={w} className="h-[2px] rounded bg-ink/10" style={{ width: `${w}%` }} />
                    ))}
                </div>
                {/* fold creases */}
                <div aria-hidden="true" className="absolute inset-x-0 top-1/3 h-px bg-ink/[0.07]" />
                <div aria-hidden="true" className="absolute inset-x-0 top-2/3 h-px bg-ink/[0.07]" />
            </motion.div>

            {/* front pocket */}
            <div
                className="paper-grain absolute inset-0 rounded-b-[3px] bg-paper-200"
                style={{
                    zIndex: 3,
                    clipPath: "polygon(0 0, 50% 54%, 100% 0, 100% 100%, 0 100%)",
                    backgroundImage:
                        "linear-gradient(to bottom, rgb(42 34 29 / .09), transparent 22%), linear-gradient(160deg, rgb(255 255 255 / .10), transparent 50%)",
                }}
            />
            {/* the side folds, drawn as hairlines */}
            <svg aria-hidden="true" className="absolute inset-0 h-full w-full" style={{ zIndex: 3 }} viewBox="0 0 160 100" preserveAspectRatio="none">
                <path d="M0 100 L62 60 M160 100 L98 60" stroke="rgb(42 34 29 / .10)" strokeWidth="0.4" fill="none" vectorEffect="non-scaling-stroke" />
                <path d="M0 0 L80 54 L160 0" stroke="rgb(42 34 29 / .12)" strokeWidth="0.5" fill="none" vectorEffect="non-scaling-stroke" />
            </svg>

            {/* addressed by hand, postmarked */}
            <span className="t-note absolute bottom-[12%] left-[9%] text-ink" style={{ zIndex: 4, rotate: "-3deg", fontSize: "clamp(1.5rem, 6.4vw, 2rem)" }}>
                {to}
            </span>
            {postmark && (
                <span
                    aria-hidden="true"
                    className="absolute bottom-[10%] right-[8%] flex h-[3.4rem] w-[3.4rem] items-center justify-center rounded-full border border-dashed border-ink/25 font-mono text-[0.5rem] leading-tight tracking-[0.08em] text-ink/45"
                    style={{ zIndex: 4, rotate: "12deg" }}
                >
                    <span className="whitespace-pre-line text-center">{postmark}</span>
                </span>
            )}

            <Seal state={state} onBreak={onBreak} onNudge={onNudge} />
        </div>
    )
}

/** The wax seal: press and hold to break it. A thin gold ring shows the hold filling. */
function Seal({ state, onBreak, onNudge }) {
    const reduced = useReducedMotion()
    const progress = useMotionValue(0)
    const dash = useTransform(progress, (v) => 176 * (1 - v))
    const run = useRef(null)
    const pressedAt = useRef(0)
    const sealed = state === "sealed"
    const broken = state === "opening"
    const resealed = state === "closing"

    const start = (e) => {
        if (!sealed) return
        e.preventDefault()
        pressedAt.current = performance.now()
        run.current?.stop()
        run.current = animate(progress, 1, {
            duration: (HOLD_MS / 1000) * (1 - progress.get()),
            ease: "linear",
            onComplete: () => onBreak?.(),
        })
    }
    const release = () => {
        if (!sealed || progress.get() >= 1) return
        run.current?.stop()
        if (performance.now() - pressedAt.current < 250) onNudge?.()
        run.current = animate(progress, 0, { duration: 0.35, ease: EASE_SOFT })
    }

    return (
        <div className="absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2" style={{ zIndex: 6 }}>
            <motion.button
                type="button"
                aria-label="Press and hold the seal to open the letter"
                disabled={!sealed}
                onPointerDown={start}
                onPointerUp={release}
                onPointerLeave={release}
                onPointerCancel={release}
                onContextMenu={(e) => e.preventDefault()}
                className="relative block h-[4.5rem] w-[4.5rem] touch-none select-none rounded-full [-webkit-touch-callout:none]"
                initial={resealed ? { scale: 1.35, opacity: 0 } : false}
                animate={resealed ? { scale: [1.35, 1.35, 1], opacity: [0, 0, 1] } : { scale: 1, opacity: 1 }}
                transition={resealed ? { duration: 3.2, times: [0, 0.82, 1], ease: EASE_SOFT } : { duration: 0.3 }}
            >
                {/* hold ring */}
                <svg aria-hidden="true" viewBox="0 0 64 64" className={`absolute -inset-[7px] h-[calc(100%+14px)] w-[calc(100%+14px)] -rotate-90 transition-opacity duration-300 ${sealed ? "" : "opacity-0"}`}>
                    <motion.circle cx="32" cy="32" r="28" fill="none" stroke="#D9A441" strokeWidth="1.25" strokeLinecap="round" strokeDasharray="176" style={{ strokeDashoffset: dash }} />
                </svg>
                <WaxHalf side="left" broken={broken} reduced={reduced} />
                <WaxHalf side="right" broken={broken} reduced={reduced} />
            </motion.button>
        </div>
    )
}

// One half of the seal (the whole seal is two halves, so it can crack along the middle).
function WaxHalf({ side, broken, reduced }) {
    const left = side === "left"
    return (
        <motion.svg
            aria-hidden="true"
            viewBox="0 0 64 64"
            className="absolute inset-0 h-full w-full overflow-visible"
            style={{ clipPath: left ? "polygon(0 0, 53% 0, 47% 38%, 54% 62%, 49% 100%, 0 100%)" : "polygon(53% 0, 100% 0, 100% 100%, 49% 100%, 54% 62%, 47% 38%)" }}
            initial={false}
            animate={broken ? { x: left ? -7 : 7, y: 3, rotate: left ? -14 : 12, opacity: 0 } : { x: 0, y: 0, rotate: 0, opacity: 1 }}
            transition={broken ? { duration: reduced ? 0.2 : 0.7, ease: EASE_SOFT, opacity: { duration: 0.6, delay: 0.25 } } : { duration: 0 }}
        >
            <defs>
                <radialGradient id={`wax-${side}`} cx="0.38" cy="0.32" r="0.75">
                    <stop offset="0" stopColor="#DDA5A3" />
                    <stop offset="0.45" stopColor="#C08585" />
                    <stop offset="1" stopColor="#8F5C5D" />
                </radialGradient>
            </defs>
            {/* an imperfect, poured edge */}
            <path
                d="M32 3 C40 2 45 6 51 9 C57 13 61 19 61 27 C63 34 61 41 58 47 C54 55 47 60 38 61 C31 63 23 62 17 58 C10 54 5 48 3 40 C1 33 2 25 6 19 C10 11 17 5 25 4 C27 3 30 3 32 3 Z"
                fill={`url(#wax-${side})`}
            />
            <circle cx="32" cy="32" r="19" fill="none" stroke="rgb(90 50 52 / .35)" strokeWidth="1.2" />
            <circle cx="32" cy="32.8" r="19" fill="none" stroke="rgb(255 235 230 / .22)" strokeWidth="0.8" />
            {/* embossed initial */}
            <text x="32" y="41.5" textAnchor="middle" fontFamily="var(--font-fraunces), Georgia, serif" fontStyle="italic" fontSize="24" fill="rgb(255 238 234 / .28)">
                A
            </text>
            <text x="32" y="40.6" textAnchor="middle" fontFamily="var(--font-fraunces), Georgia, serif" fontStyle="italic" fontSize="24" fill="rgb(100 56 58 / .62)">
                A
            </text>
        </motion.svg>
    )
}
