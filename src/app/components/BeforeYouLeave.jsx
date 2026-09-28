"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { Pause, Play } from "lucide-react"
import { MEET_SOON, VOICE_NOTE_SRC, replyLink } from "../data/config"
import { beforeYouLeave } from "../data/story"
import { useKeys } from "../hooks/useKey"
import { useSound } from "./sound/SoundProvider"
import { TextButton } from "./ui"
import { EASE_SOFT, arrive } from "./ui/motion"

// 07 — Before you leave. Three small paper cards; each unfolds one short message.
// When all three are open, a quiet arrow leads to the ending. Words: src/app/data/story.js.

const TILT = [-1.4, 0.9, -0.6]

export default function BeforeYouLeave({ onNext }) {
    const { cards, title, done } = beforeYouLeave
    const [opened, setOpened] = useState(() => new Set())
    const [leaving, setLeaving] = useState(false)
    const allOpen = opened.size === cards.length

    const toggle = (id) => setOpened((s) => new Set(s).add(id))
    const leave = () => {
        if (!allOpen || leaving) return
        setLeaving(true)
        setTimeout(onNext, 1200)
    }
    useKeys({ Enter: leave })

    return (
        <motion.div
            className="night-vignette relative flex min-h-dvh flex-col items-center px-5 pb-20 pt-28"
            animate={{ opacity: leaving ? 0 : 1 }}
            transition={{ duration: leaving ? 1.1 : 0.4 }}
        >
            <motion.h2 className="t-title text-center text-cream" {...arrive(0.4)}>
                {title}
            </motion.h2>

            <ul className="mt-14 flex w-full max-w-[420px] flex-col gap-5">
                {cards.map((card, i) => (
                    <motion.li
                        key={card.id}
                        initial={{ opacity: 0, y: 18, rotate: TILT[i % 3] }}
                        animate={{ opacity: 1, y: 0, rotate: opened.has(card.id) ? 0 : TILT[i % 3] }}
                        transition={{ duration: 1, delay: opened.size ? 0 : 1.4 + i * 0.25, ease: EASE_SOFT }}
                    >
                        <Card card={card} open={opened.has(card.id)} onOpen={() => toggle(card.id)} />
                    </motion.li>
                ))}
            </ul>

            <div className="mt-14 min-h-12">
                <AnimatePresence>
                    {allOpen && (
                        <TextButton onClick={leave} delay={1.6}>
                            {done}
                        </TextButton>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    )
}

function Card({ card, open, onOpen }) {
    const { source } = useSound()
    const isGift = card.id === "one-last-thing"
    const usingSong = !!source && /yaaron/i.test(source)
    const lines = isGift && !usingSong && card.fallback ? card.fallback : card.lines
    const isFuture = card.id === "for-the-future"
    const details = [MEET_SOON.time, MEET_SOON.place].filter(Boolean)

    return (
        <motion.div
            layout
            transition={{ layout: { duration: 0.7, ease: EASE_SOFT } }}
            className="paper-grain overflow-hidden rounded-[4px] bg-paper-50 text-ink"
            style={{ boxShadow: "0 1px 2px rgb(14 12 11 / .35), 0 14px 34px -12px rgb(14 12 11 / .6)" }}
        >
            <motion.button
                layout="position"
                type="button"
                onClick={onOpen}
                disabled={open}
                aria-expanded={open}
                className="flex min-h-[4.25rem] w-full items-center gap-4 px-5 py-4 text-left disabled:cursor-default"
            >
                <span aria-hidden="true" className="text-[1.375rem] leading-none">
                    {card.icon}
                </span>
                <span className="flex-1 font-display text-[1.1875rem] italic text-ink">{card.label}</span>
                <span className="t-meta text-ink-muted/70">{open ? "opened" : "tap"}</span>
            </motion.button>

            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        key="body"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.9, delay: 0.25, ease: EASE_SOFT }}
                        className="border-t border-ink/10 px-5 pb-6 pt-5"
                    >
                        {isGift && VOICE_NOTE_SRC ? (
                            <VoiceNote src={VOICE_NOTE_SRC} />
                        ) : (
                            lines.map((line, k) => (
                                <motion.p
                                    key={line}
                                    className={`font-display text-[1.0625rem] leading-relaxed ${k === 0 ? "text-ink" : "mt-2 text-ink/75"}`}
                                    initial={{ opacity: 0, y: 6, filter: "blur(3px)" }}
                                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                    transition={{ duration: 1, delay: 0.35 + k * 0.7, ease: EASE_SOFT }}
                                >
                                    {line}
                                </motion.p>
                            ))
                        )}

                        {isFuture && (
                            <motion.div
                                className="mt-5 flex flex-wrap items-center justify-between gap-3"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 1, delay: 2 }}
                            >
                                {details.length > 0 && <p className="t-meta text-ink-muted">{details.join(" · ")}</p>}
                                <a
                                    href={replyLink()}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex min-h-11 items-center font-sans text-[0.875rem] font-medium text-ink underline decoration-ink/25 underline-offset-4 hover:decoration-gold"
                                >
                                    send something back <span className="text-gold">&rarr;</span>
                                </a>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

// Kesava's voice, if he recorded one. The song ducks underneath while it plays.
function VoiceNote({ src }) {
    const { duck } = useSound()
    const ref = useRef(null)
    const [playing, setPlaying] = useState(false)
    const [p, setP] = useState(0)

    useEffect(() => {
        const a = ref.current
        return () => {
            a?.pause()
            duck(null)
        }
    }, [duck])

    const toggle = () => {
        const a = ref.current
        if (!a) return
        if (a.paused) {
            duck(0.08)
            a.play().catch(() => { })
        } else a.pause()
    }

    return (
        <div className="flex items-center gap-4">
            <button type="button" onClick={toggle} aria-label={playing ? "Pause voice note" : "Play voice note from Kesava"} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ink/20">
                {playing ? <Pause className="h-4 w-4" strokeWidth={1.75} /> : <Play className="ml-0.5 h-4 w-4" strokeWidth={1.75} />}
            </button>
            <div className="flex-1">
                <p className="font-display text-[1.0625rem] italic text-ink">this one I couldn&rsquo;t type.</p>
                <div className="mt-2 h-[2px] rounded-full bg-ink/10">
                    <div className="h-full rounded-full bg-gold" style={{ width: `${p * 100}%` }} />
                </div>
            </div>
            <audio
                ref={ref}
                src={src}
                preload="auto"
                onPlay={() => setPlaying(true)}
                onPause={() => {
                    setPlaying(false)
                    duck(null)
                }}
                onEnded={() => {
                    setPlaying(false)
                    setP(1)
                    duck(null)
                }}
                onTimeUpdate={(e) => setP(e.currentTarget.currentTime / (e.currentTarget.duration || 1))}
            />
        </div>
    )
}
