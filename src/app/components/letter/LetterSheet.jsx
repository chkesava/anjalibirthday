"use client"

import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { LETTER_HIGHLIGHT } from "../../data/config"
import { useKeys } from "../../hooks/useKey"
import { QuietPill, TextButton } from "../ui"
import { EASE_IN_OUT, EASE_SOFT, fade } from "../ui/motion"

/** Splits letter.txt into greeting / paragraphs / closing / signature. The words are never changed. */
export function parseLetter(text) {
    const lines = text.replace(/\r\n?/g, "\n").trim().split("\n")
    const closeAt = lines.findIndex((l) => /^your friend always/i.test(l.trim()))
    const body = closeAt >= 0 ? lines.slice(0, closeAt) : lines
    const closing = closeAt >= 0 ? lines[closeAt].trim() : null
    const signature = closeAt >= 0 ? lines.slice(closeAt + 1).join(" ").trim() : null

    const blocks = body
        .join("\n")
        .split(/\n\s*\n/)
        .map((b) => b.trim())
        .filter(Boolean)
    const [first = "", ...paragraphs] = blocks
    const [greeting, ...rest] = first.split("\n")
    if (rest.length) paragraphs.unshift(rest.join("\n"))
    return { greeting, paragraphs, closing, signature }
}

// Time to wait before the next paragraph: roughly how long the previous one takes to read.
const readTime = (text) => Math.min(5200, Math.max(1900, text.split(/\s+/).length * 150))

/**
 * The letter itself: a sheet of textured paper that settles into place, then Kesava's words
 * surface a paragraph at a time at reading pace. She can scroll freely; it never scrolls for her.
 */
export default function LetterSheet({ text, date, onKeep, onBack }) {
    const reduced = useReducedMotion()
    const { greeting, paragraphs, closing, signature } = useMemo(() => parseLetter(text), [text])
    const closingStep = paragraphs.length
    const signatureStep = paragraphs.length + (closing ? 1 : 0)
    const steps = signatureStep + (signature ? 1 : 0)

    const [shown, setShown] = useState(reduced ? steps : 0)
    const [finished, setFinished] = useState(false)
    const [hint, setHint] = useState(false)
    const all = shown >= steps

    useEffect(() => {
        if (all) return
        const prev = shown === 0 ? null : shown <= paragraphs.length ? paragraphs[shown - 1] : ""
        const id = setTimeout(() => setShown((n) => n + 1), shown === 0 ? 1400 : prev ? readTime(prev) : 1600)
        return () => clearTimeout(id)
    }, [shown, all, paragraphs])

    useEffect(() => {
        if (!all) return
        const id = setTimeout(() => setFinished(true), reduced ? 300 : 3600)
        return () => clearTimeout(id)
    }, [all, reduced])

    // Never scroll for her — only a small arrow when new words land below the fold.
    useEffect(() => {
        const check = () => {
            const revealed = document.querySelectorAll("[data-revealed='true']")
            const latest = revealed[revealed.length - 1]
            setHint(!!latest && latest.getBoundingClientRect().top > window.innerHeight - 40)
        }
        const id = requestAnimationFrame(check)
        window.addEventListener("scroll", check, { passive: true })
        return () => {
            cancelAnimationFrame(id)
            window.removeEventListener("scroll", check)
        }
    }, [shown])

    const readAgain = () => window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" })

    useKeys({ ArrowLeft: onBack, Enter: () => (finished ? onKeep() : setShown(steps)) })

    const on = (i) => i < shown

    return (
        <div className="relative z-10 min-h-dvh px-0 pb-0 sm:px-6 sm:pb-24 sm:pt-20" onClick={() => !all && setShown(steps)}>
            <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-20 h-20 bg-gradient-to-b from-paper-50 via-paper-50/80 to-transparent sm:from-paper-100 sm:via-paper-100/70" />
            <motion.article
                className="paper-grain relative mx-auto max-w-[41rem] select-text bg-paper-50 px-7 pb-14 pt-[max(92px,calc(env(safe-area-inset-top)+76px))] text-ink sm:rounded-[3px] sm:px-16 sm:pb-20 sm:pt-16"
                style={{ boxShadow: "0 1px 1px rgb(42 34 29 / .06), 0 2px 6px rgb(42 34 29 / .06), 0 26px 60px -24px rgb(42 34 29 / .32)" }}
                initial={{ opacity: 0, y: 34, scale: 0.975, rotate: -0.6 }}
                animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                transition={{ duration: 1.4, ease: EASE_SOFT }}
            >
                {/* letterhead */}
                <header className="flex items-baseline justify-between gap-4">
                    <p className="t-meta whitespace-nowrap text-ink-muted/80">for Anjali</p>
                    <p className="font-hand text-[1.25rem] leading-none text-ink-muted" style={{ rotate: "-2deg" }}>
                        {date}
                    </p>
                </header>
                <div className="mb-10 mt-4 h-px w-full bg-gradient-to-r from-ink/0 via-ink/15 to-ink/0" />

                <motion.h1
                    className="mb-7 font-hand text-[2.125rem] font-semibold leading-none text-ink sm:text-[2.5rem]"
                    initial={{ clipPath: "inset(0 100% 0 0)" }}
                    animate={{ clipPath: "inset(0 0% 0 0)" }}
                    transition={{ duration: 1.4, delay: 0.7, ease: EASE_IN_OUT }}
                >
                    {greeting}
                </motion.h1>

                <div className="t-letter max-w-[34em] space-y-6 text-ink/90">
                    {paragraphs.map((para, i) => (
                        <Reveal key={i} on={on(i)}>
                            <Paragraph text={para} on={on(i)} />
                        </Reveal>
                    ))}
                </div>

                {closing && (
                    <Reveal on={on(closingStep)} className="mt-12 font-display italic text-[1.125rem] text-ink/80">
                        {closing}
                    </Reveal>
                )}
                {signature && (
                    <div className="relative mt-2 min-h-16">
                        {on(signatureStep) && <Signature text={signature} />}
                    </div>
                )}

                {/* the ending: keep it, or read it again */}
                <div className="mt-14 min-h-24">
                    <AnimatePresence>
                        {finished && (
                            <motion.div
                                className="flex flex-col items-start gap-5 border-t border-ink/10 pt-8 sm:flex-row sm:items-center sm:justify-between"
                                {...fade(0, 1.2)}
                            >
                                <TextButton tone="paper" className="-ml-6" onClick={(e) => { e.stopPropagation(); onKeep() }} delay={0.2}>
                                    fold it &amp; keep it
                                </TextButton>
                                <QuietPill tone="paper" onClick={readAgain} delay={0.5}>
                                    read it again
                                </QuietPill>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {!all && (
                    <p className="t-meta mt-2 text-center normal-case tracking-[0.04em] text-ink-muted/60">
                        tap to read it all at once
                    </p>
                )}
            </motion.article>

            <AnimatePresence>
                {hint && !all && (
                    <motion.div
                        aria-hidden="true"
                        className="pointer-events-none fixed inset-x-0 z-20 text-center text-lg text-ink-muted"
                        style={{ bottom: "max(16px, env(safe-area-inset-bottom))" }}
                        {...fade(0, 0.5)}
                    >
                        &darr;
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

function Reveal({ on, children, className = "" }) {
    return (
        <motion.div
            className={className}
            initial={false}
            animate={on ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 8, filter: "blur(3px)" }}
            transition={{ duration: 1.1, ease: EASE_SOFT }}
            aria-hidden={!on}
            data-revealed={on}
        >
            {children}
        </motion.div>
    )
}

function Paragraph({ text, on }) {
    const at = text.indexOf(LETTER_HIGHLIGHT)
    if (at < 0) return <p className="whitespace-pre-line">{text}</p>
    return (
        <p className="whitespace-pre-line">
            {text.slice(0, at)}
            <mark className="highlight bg-transparent text-inherit" data-on={on}>
                {LETTER_HIGHLIGHT}
            </mark>
            {text.slice(at + LETTER_HIGHLIGHT.length)}
        </p>
    )
}

// Kesava's name, written on, with a single soft underline stroke.
function Signature({ text }) {
    return (
        <div className="inline-block">
            <motion.p
                className="font-hand text-[2.6rem] font-semibold leading-none text-ink"
                initial={{ clipPath: "inset(0 100% 0 0)" }}
                animate={{ clipPath: "inset(0 0% 0 0)" }}
                transition={{ duration: 2.2, delay: 0.3, ease: EASE_IN_OUT }}
            >
                {text}
            </motion.p>
            <svg aria-hidden="true" viewBox="0 0 160 14" className="-mt-1 h-3.5 w-40 overflow-visible">
                <motion.path
                    d="M2 9 C 34 3, 70 12, 104 6 S 150 5, 158 8"
                    fill="none"
                    stroke="#C98C8C"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.8 }}
                    transition={{ duration: 1.1, delay: 2.4, ease: EASE_IN_OUT }}
                />
            </svg>
        </div>
    )
}
