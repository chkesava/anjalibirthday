"use client"

import { useRef, useState } from "react"
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react"
import { timeline } from "../data/memories"
import { useKeys } from "../hooks/useKey"
import { useSound } from "./sound/SoundProvider"
import { TextButton } from "./ui"
import { EASE_IN_OUT, EASE_SOFT } from "./ui/motion"

// 04 — Our Timeline: chapters of a friendship, read by scrolling.
//
// A thin gold thread runs down the page and fills as she scrolls (time passing).
// Chapters alternate sides; the rooftop opens up to full width; the earphones photo is
// THE MOMENT — a pinned scene driven by scroll (dim → the date alone → the print develops →
// the caption → the note), with the music lifting slightly while she's inside it.
// The finale's caption arrives phrase by phrase, then the page lingers and dims out.
//
// Content lives in src/app/data/memories.js → `timeline`. Null fields are simply not shown.

const two = (n) => String(n).padStart(2, "0")

export default function FriendshipTimeline({ onNext }) {
    const [leaving, setLeaving] = useState(false)
    const threadRef = useRef(null)

    const leave = () => {
        if (leaving) return
        setLeaving(true)
        setTimeout(onNext, 1700)
    }

    let side = 0
    return (
        <motion.div
            className="night-vignette relative min-h-dvh"
            animate={{ opacity: leaving ? 0 : 1 }}
            transition={{ duration: leaving ? 1.6 : 0.4, ease: EASE_IN_OUT }}
        >
            <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-30 h-20 bg-gradient-to-b from-night-950 via-night-950/70 to-transparent" />

            <Opening count={timeline.length} />

            <div ref={threadRef} className="relative">
                <Thread target={threadRef} />
                {timeline.map((m, i) => {
                    const n = i + 1
                    if (m.type === "wide") return <Wide key={m.id} m={m} n={n} />
                    if (m.type === "moment") return <Moment key={m.id} m={m} n={n} />
                    if (m.type === "set") return <PhotoSet key={m.id} m={m} n={n} />
                    if (m.type === "finale") return <Finale key={m.id} m={m} n={n} onDone={leave} />
                    side += 1
                    return <Chapter key={m.id} m={m} n={n} flip={side % 2 === 0} />
                })}
            </div>
        </motion.div>
    )
}

/* ─────────────── pieces ─────────────── */

function Opening({ count }) {
    return (
        <header className="flex min-h-[86dvh] flex-col items-center justify-center px-6 pb-10 pt-24 text-center">
            <motion.p
                className="t-meta text-cream-faint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2, delay: 0.2 }}
            >
                {two(count)} chapters
            </motion.p>
            <motion.h2
                className="mt-6 font-display italic text-cream"
                style={{ fontSize: "clamp(3rem, 13vw, 7.5rem)", lineHeight: 0.95, fontVariationSettings: '"SOFT" 100', letterSpacing: "-0.02em" }}
                initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 1.6, delay: 0.35, ease: EASE_SOFT }}
            >
                our timeline
            </motion.h2>
            <motion.p
                className="t-caption mt-6 max-w-[22em] text-cream-muted"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.4, delay: 0.9, ease: EASE_SOFT }}
            >
                the ordinary days. the ones that turned out to matter.
            </motion.p>
            <motion.p
                aria-hidden="true"
                className="t-meta mt-14 text-cream-faint"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0.55] }}
                transition={{ duration: 2.4, delay: 2 }}
            >
                scroll &darr;
            </motion.p>
        </header>
    )
}

// The thread: a hairline down the page (left gutter on phones, centre on desktop) that fills with gold.
function Thread({ target }) {
    const reduced = useReducedMotion()
    const { scrollYProgress } = useScroll({ target, offset: ["start 70%", "end 60%"] })
    const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 30, mass: 0.4 })
    return (
        <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-[22px] top-0 w-px md:left-1/2">
            <div className="absolute inset-0 bg-cream/[0.09]" />
            <motion.div
                className="absolute inset-x-0 top-0 h-full origin-top bg-gradient-to-b from-gold/70 via-gold/50 to-gold/20"
                style={{ scaleY: reduced ? 1 : fill }}
            />
        </div>
    )
}

function Dot({ label, className = "" }) {
    return (
        <div aria-hidden="true" className={`absolute left-[22px] -translate-x-1/2 md:left-1/2 ${className}`}>
            <motion.span
                className="block h-[9px] w-[9px] rounded-full border border-gold bg-night-950"
                initial={{ scale: 0.4, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1, backgroundColor: "#D9A441" }}
                viewport={{ once: true, amount: 1, margin: "0px 0px -35% 0px" }}
                transition={{ duration: 0.8, ease: EASE_SOFT }}
            />
            {label && (
                <span className="t-meta absolute left-1/2 top-4 hidden -translate-x-1/2 whitespace-nowrap text-[0.625rem] text-cream-faint md:block">
                    {label}
                </span>
            )}
        </div>
    )
}

const rise = (delay = 0) => ({
    initial: { opacity: 0, y: 22, filter: "blur(6px)" },
    whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
    viewport: { once: true, amount: 0.5 },
    transition: { duration: 1.2, delay, ease: EASE_SOFT },
})

/** Chapter number + title + date. Big, quiet numerals; the title does the talking. */
function Heading({ m, n, align = "left", big = true }) {
    const alignCls = align === "right" ? "md:text-right md:items-end" : align === "center" ? "text-center items-center" : ""
    return (
        <div className={`relative flex flex-col ${alignCls}`}>
            {big && (
                <motion.span
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-[0.42em] select-none font-display font-light leading-none text-cream/[0.06]"
                    style={{ fontSize: "clamp(5.5rem, 24vw, 10rem)", [align === "right" ? "right" : "left"]: "-0.04em" }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 1.8 }}
                >
                    {two(n)}
                </motion.span>
            )}
            <motion.p className="t-meta relative text-cream-faint" {...rise(0)}>
                chapter {two(n)}
                {m.date && <span className="text-gold/85"> &middot; {m.date}</span>}
            </motion.p>
            {m.title && (
                <motion.h3
                    className="relative mt-3 font-display text-cream"
                    style={{ fontSize: "clamp(2rem, 8vw, 3.5rem)", lineHeight: 1.02, letterSpacing: "-0.02em", fontVariationSettings: '"SOFT" 70' }}
                    {...rise(0.1)}
                >
                    {m.title}
                </motion.h3>
            )}
        </div>
    )
}

function Words({ m, align = "left", delay = 0.2 }) {
    const alignCls = align === "right" ? "md:text-right md:items-end" : align === "center" ? "text-center items-center" : ""
    return (
        <div className={`flex max-w-[28em] flex-col ${alignCls}`}>
            <motion.p className="t-caption text-cream-muted" {...rise(delay)}>
                {m.caption}
            </motion.p>
            {m.memory && (
                <motion.p className="mt-4 font-display text-[1.0625rem] leading-relaxed text-cream-muted" {...rise(delay + 0.15)}>
                    {m.memory}
                </motion.p>
            )}
            {m.joke && (
                <motion.p className="t-note mt-4 text-gold-soft" style={{ rotate: "-1.5deg" }} {...rise(delay + 0.3)}>
                    {m.joke}
                </motion.p>
            )}
            {m.note && (
                <motion.p className="t-note mt-4 text-rose" style={{ rotate: "-2deg" }} {...rise(delay + 0.45)}>
                    {m.note}
                </motion.p>
            )}
        </div>
    )
}

/** A print that develops as it comes into view and drifts a little against the scroll. */
function Print({ image, maxW, maxH, rotate = 0, parallax = 36, delay = 0 }) {
    const reduced = useReducedMotion()
    const ref = useRef(null)
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
    const y = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [parallax, -parallax])
    return (
        <motion.figure ref={ref} className="print inline-block" style={{ rotate, y }} {...rise(delay)}>
            <div className="overflow-hidden">
                <motion.img
                    src={image.src}
                    width={image.w}
                    height={image.h}
                    alt={image.alt}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    className="block h-auto w-auto select-none object-contain"
                    style={{ maxWidth: maxW, maxHeight: maxH }}
                    initial={{ filter: "saturate(0.55) brightness(1.1)" }}
                    whileInView={{ filter: "saturate(1) brightness(1)" }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 1.8, delay: 0.2, ease: EASE_SOFT }}
                />
            </div>
        </motion.figure>
    )
}

/* ─────────────── chapter types ─────────────── */

// A photo on one side of the thread, its words on the other; sides alternate.
function Chapter({ m, n, flip }) {
    const portrait = m.image.h > m.image.w
    return (
        <section aria-label={`Chapter ${n}${m.title ? `: ${m.title}` : ""}`} className="relative py-20 md:py-32">
            <Dot className="top-[5.4rem] md:top-[8.4rem]" label={m.date} />
            <div className="mx-auto grid max-w-[1120px] gap-10 pl-12 pr-5 md:grid-cols-2 md:gap-24 md:px-10">
                <div className={`md:pt-4 ${flip ? "md:order-2" : "md:order-1 md:text-right"}`}>
                    <Heading m={m} n={n} align={flip ? "left" : "right"} />
                    <div className={`mt-6 flex ${flip ? "" : "md:justify-end"}`}>
                        <Words m={m} align={flip ? "left" : "right"} />
                    </div>
                </div>
                <div className={`flex ${flip ? "md:order-1 md:justify-end" : "md:order-2"}`}>
                    <Print
                        image={m.image}
                        rotate={flip ? 1.2 : -1.4}
                        maxW={portrait ? "min(58vw, 340px)" : "min(74vw, 520px)"}
                        maxH={portrait ? "min(64dvh, 600px)" : "min(48dvh, 420px)"}
                    />
                </div>
            </div>
        </section>
    )
}

// A full-width moment: the heading centred, the photo opening up edge to edge.
function Wide({ m, n }) {
    const reduced = useReducedMotion()
    const ref = useRef(null)
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
    const scale = useTransform(scrollYProgress, [0, 0.5, 1], reduced ? [1, 1, 1] : [1.14, 1.04, 1])
    const y = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["-6%", "6%"])

    return (
        <section aria-label={`Chapter ${n}: ${m.title ?? ""}`} className="relative py-20 md:py-32">
            {/* centred headings carry their own date, so the dot sits just above them */}
            <Dot className="top-[5.4rem] md:top-[5.25rem]" />
            <div className="mx-auto max-w-[1120px] pl-12 pr-5 md:px-10 md:text-center">
                <div className="thread-gap md:mx-auto md:flex md:max-w-[36rem] md:flex-col md:items-center md:px-16 md:py-6">
                    <Heading m={m} n={n} align="center" big={false} />
                </div>
            </div>

            <motion.div
                ref={ref}
                className="relative mt-12 h-[58dvh] w-full overflow-hidden md:mt-16 md:h-[80vh]"
                initial={{ opacity: 0, clipPath: "inset(8% 6% 8% 6%)" }}
                whileInView={{ opacity: 1, clipPath: "inset(0% 0% 0% 0%)" }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 1.6, ease: EASE_SOFT }}
            >
                <motion.img
                    src={m.image.src}
                    width={m.image.w}
                    height={m.image.h}
                    alt={m.image.alt}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{ scale, y, objectPosition: "50% 45%" }}
                    initial={{ filter: "saturate(0.6) brightness(1.08)" }}
                    whileInView={{ filter: "saturate(1) brightness(1)" }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 2.2, ease: EASE_SOFT }}
                />
                <div
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(to bottom, rgb(14 12 11 / .55), transparent 18%, transparent 78%, rgb(14 12 11 / .7))" }}
                />
            </motion.div>

            <div className="mx-auto mt-10 flex max-w-[1120px] pl-12 pr-5 md:justify-center md:px-10">
                <Words m={m} align="center" />
            </div>
        </section>
    )
}

// A few photos from the same day, laid down together like prints from one roll.
const SET_TILT = [-3, 1.2, 2.6]
const SET_LIFT = [10, -18, 14] // px — the middle print sits a little higher

function PhotoSet({ m, n }) {
    const images = m.images ?? [m.image]
    return (
        <section aria-label={`Chapter ${n}: ${m.title ?? ""}`} className="relative py-20 md:py-32">
            <Dot className="top-[5.4rem] md:top-[5.25rem]" />
            <div className="mx-auto max-w-[1120px] pl-12 pr-5 md:px-10 md:text-center">
                <div className="thread-gap md:mx-auto md:flex md:max-w-[36rem] md:flex-col md:items-center md:px-16 md:py-6">
                    <Heading m={m} n={n} align="center" big={false} />
                </div>
            </div>

            <div className="mx-auto mt-12 flex max-w-[1120px] justify-center pl-10 pr-4 md:mt-16 md:px-10">
                {images.map((image, k) => (
                    <div
                        key={image.src}
                        className="-mx-[2.5vw] md:-mx-5"
                        style={{ zIndex: k === 1 ? 2 : 1, marginTop: SET_LIFT[k % 3] }}
                    >
                        <Print
                            image={image}
                            rotate={SET_TILT[k % 3]}
                            delay={k * 0.22}
                            parallax={14 + k * 8}
                            maxW="min(28vw, 270px)"
                            maxH="min(46dvh, 480px)"
                        />
                    </div>
                ))}
            </div>

            <div className="mx-auto mt-12 flex max-w-[1120px] pl-12 pr-5 md:mt-16 md:justify-center md:px-10">
                <Words m={m} align="center" />
            </div>
        </section>
    )
}

// THE MOMENT — pinned while she scrolls through it.
function Moment({ m, n }) {
    const { setLevel } = useSound()
    const reduced = useReducedMotion()
    const ref = useRef(null)
    const inside = useRef(false)
    const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] })

    // The room dims, and the music lifts a little, only while she's inside the moment.
    useMotionValueEvent(p, "change", (v) => {
        const now = v > 0.04 && v < 0.98
        if (now !== inside.current) {
            inside.current = now
            setLevel(now ? 0.6 : 0.5, 1800)
        }
    })

    const dim = useTransform(p, [0, 0.08, 0.92, 1], [0, 0.7, 0.7, 0.35])
    const beat = useTransform(p, [0.06, 0.14, 0.26, 0.32], [0, 1, 1, 0])
    const beatY = useTransform(p, [0.06, 0.32], reduced ? [0, 0] : [8, -8])
    const photo = useTransform(p, [0.32, 0.44], [0, 1])
    const photoY = useTransform(p, [0.32, 0.5], reduced ? [0, 0] : [26, 0])
    const develop = useTransform(p, [0.34, 0.62], ["saturate(0.45) brightness(1.14)", "saturate(1) brightness(1)"])
    const zoom = useTransform(p, [0.32, 1], reduced ? [1, 1] : [1, 1.06])
    const words = useTransform(p, [0.58, 0.68, 0.95, 1], [0, 1, 1, 0])
    const wordsY = useTransform(p, [0.58, 0.68], [12, 0])
    const note = useTransform(p, [0.74, 0.82, 0.95, 1], [0, 1, 1, 0])
    const noteClip = useTransform(p, [0.74, 0.84], ["inset(0 100% 0 0)", "inset(0 0% 0 0)"])

    return (
        <section ref={ref} aria-label={`Chapter ${n}: ${m.title ?? ""}`} className="relative h-[300dvh] md:h-[320vh]">
            <div className="sticky top-0 flex h-dvh flex-col items-center justify-center overflow-hidden px-5">
                <motion.div aria-hidden="true" className="absolute inset-0 bg-night-950" style={{ opacity: dim }} />

                <motion.p className="t-meta absolute text-base tracking-[0.12em] text-cream" style={{ opacity: beat, y: beatY }}>
                    {m.date}
                </motion.p>

                <motion.figure className="print print-lift relative" style={{ opacity: photo, y: photoY }}>
                    <div className="overflow-hidden">
                        <motion.img
                            src={m.image.src}
                            width={m.image.w}
                            height={m.image.h}
                            alt={m.image.alt}
                            loading="lazy"
                            draggable={false}
                            className="block h-auto w-auto select-none object-contain"
                            style={{ maxWidth: "min(86vw, 560px)", maxHeight: "min(50dvh, 560px)", filter: develop, scale: zoom }}
                        />
                    </div>
                </motion.figure>

                <motion.div className="relative mt-8 flex max-w-[28em] flex-col items-center text-center" style={{ opacity: words, y: wordsY }}>
                    <p className="t-meta text-cream-faint">
                        chapter {two(n)}
                        {m.title ? ` · ${m.title}` : ""}
                    </p>
                    <p className="t-caption mt-3 text-cream-muted">{m.caption}</p>
                    {m.memory && <p className="mt-3 font-display text-[1.0625rem] leading-relaxed text-cream-muted">{m.memory}</p>}
                </motion.div>

                {m.note && (
                    <motion.p className="t-note relative mt-5 px-2 text-center text-rose" style={{ opacity: note, clipPath: noteClip, rotate: "-1.5deg" }}>
                        {m.note}
                    </motion.p>
                )}
            </div>
        </section>
    )
}

// The last chapter: the photo, then the caption phrase by phrase, then the way on.
function Finale({ m, n, onDone }) {
    const [ready, setReady] = useState(false)
    const seen = useRef(false)
    useKeys({ Enter: () => ready && onDone() })
    // Once the last phrase has landed (0.5s + 2 × 0.75s stagger + 1.3s), offer the way on.
    const arrived = () => {
        if (seen.current) return
        seen.current = true
        setTimeout(() => setReady(true), 3400)
    }

    return (
        <section aria-label={`Chapter ${n}: ${m.title ?? ""}`} className="relative pb-32 pt-24 md:pb-44 md:pt-36">
            <Dot className="top-[6rem] md:top-[6rem]" />
            <div className="mx-auto flex max-w-[1120px] flex-col items-center pl-12 pr-5 text-center md:px-10">
                <div className="thread-gap md:px-16 md:py-6">
                    <Heading m={m} n={n} align="center" big={false} />
                </div>
                <div className="mt-12">
                    <Print image={m.image} maxW="min(64vw, 360px)" maxH="min(62dvh, 600px)" parallax={20} />
                </div>
                <motion.p
                    className="mt-12 max-w-[20em] font-display italic text-cream"
                    style={{ fontSize: "clamp(1.375rem, 5.6vw, 2.125rem)", lineHeight: 1.3, fontVariationSettings: '"SOFT" 100' }}
                    initial="hidden"
                    whileInView="shown"
                    viewport={{ once: true, amount: 0.9 }}
                    onViewportEnter={arrived}
                    variants={{ hidden: {}, shown: { transition: { staggerChildren: 0.75, delayChildren: 0.5 } } }}
                >
                    {(m.phrases ?? [m.caption]).map((phrase) => (
                        <motion.span
                            key={phrase}
                            className="inline-block"
                            variants={{
                                hidden: { opacity: 0, y: 10, filter: "blur(6px)" },
                                shown: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1.3, ease: EASE_SOFT } },
                            }}
                        >
                            {phrase}&nbsp;
                        </motion.span>
                    ))}
                </motion.p>
                <div className="mt-6 max-w-[28em]">
                    {m.memory && <p className="font-display text-[1.0625rem] leading-relaxed text-cream-muted">{m.memory}</p>}
                </div>
                <div className="mt-14 min-h-12">
                    {ready && <TextButton onClick={onDone} aria-label="Continue" delay={1.2} />}
                </div>
            </div>
        </section>
    )
}
