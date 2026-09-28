"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { Pause, Play, RotateCcw, X } from "lucide-react"
import { useKeys } from "../../hooks/useKey"
import { useSound } from "../sound/SoundProvider"
import { EASE_SOFT } from "../ui/motion"

const fmt = (s) => (Number.isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}` : "0:00")

/**
 * A small cinema for the one film in the archive. The song pauses while it plays and
 * comes back when the film ends (unless she watches again) or when she leaves.
 */
export default function FilmViewer({ film, onClose }) {
    const { suspend, resume } = useSound()
    const ref = useRef(null)
    const resumeTimer = useRef(0)
    const hideTimer = useRef(0)
    const [playing, setPlaying] = useState(false)
    const [ended, setEnded] = useState(false)
    const [t, setT] = useState(0)
    const [d, setD] = useState(film.duration)
    const [chrome, setChrome] = useState(true)

    // Opened by a tap, so playback with sound is allowed. Leaving always brings the song back.
    useEffect(() => {
        const video = ref.current
        video?.play().catch(() => setPlaying(false))
        const root = document.documentElement
        const prevOverflow = root.style.overflow
        root.style.overflow = "hidden"
        return () => {
            clearTimeout(resumeTimer.current)
            clearTimeout(hideTimer.current)
            video?.pause()
            root.style.overflow = prevOverflow
            resume()
        }
    }, [resume])

    const peek = () => {
        setChrome(true)
        clearTimeout(hideTimer.current)
        hideTimer.current = setTimeout(() => ref.current && !ref.current.paused && setChrome(false), 2200)
    }

    const toggle = () => {
        const v = ref.current
        if (!v) return
        if (v.paused) v.play().catch(() => { })
        else v.pause()
    }

    const replay = () => {
        const v = ref.current
        if (!v) return
        clearTimeout(resumeTimer.current)
        v.currentTime = 0
        v.play().catch(() => { })
    }

    const seek = (e) => {
        const v = ref.current
        if (!v || !Number.isFinite(v.duration)) return
        const r = e.currentTarget.getBoundingClientRect()
        v.currentTime = Math.min(Math.max((e.clientX - r.left) / r.width, 0), 1) * v.duration
        peek()
    }

    useKeys({ Escape: onClose, " ": toggle, k: toggle, ArrowLeft: () => ref.current && (ref.current.currentTime -= 1), ArrowRight: () => ref.current && (ref.current.currentTime += 1) })

    return (
        <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={film.label}
            className="fixed inset-0 z-[45] flex flex-col items-center justify-center bg-[#050404]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.45 } }}
            transition={{ duration: 0.6 }}
            onPointerMove={peek}
        >
            <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.9, ease: EASE_SOFT }}
            >
                <video
                    ref={ref}
                    src={film.src}
                    poster={film.poster}
                    width={film.w}
                    height={film.h}
                    playsInline
                    preload="auto"
                    aria-label={film.alt}
                    onClick={() => {
                        toggle()
                        peek()
                    }}
                    onPlay={() => {
                        suspend()
                        clearTimeout(resumeTimer.current)
                        setPlaying(true)
                        setEnded(false)
                        peek()
                    }}
                    onPause={() => {
                        setPlaying(false)
                        setChrome(true)
                    }}
                    onEnded={() => {
                        setPlaying(false)
                        setEnded(true)
                        setChrome(true)
                        // Give the moment a beat of silence, then let the song back in.
                        resumeTimer.current = setTimeout(() => resume(2400), 1400)
                    }}
                    onLoadedMetadata={(e) => setD(e.currentTarget.duration)}
                    onTimeUpdate={(e) => setT(e.currentTarget.currentTime)}
                    className="block h-auto w-auto cursor-pointer"
                    style={{ maxWidth: "100vw", maxHeight: "calc(100dvh - 150px)" }}
                />

                <AnimatePresence>
                    {ended && (
                        <motion.button
                            type="button"
                            onClick={replay}
                            className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/35"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="glass flex h-16 w-16 items-center justify-center rounded-full">
                                <RotateCcw className="h-[22px] w-[22px] text-cream" strokeWidth={1.5} />
                            </span>
                            <span className="t-meta normal-case tracking-[0.04em] text-cream-muted">watch again</span>
                        </motion.button>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Title + controls. They fade away while the film plays; any movement brings them back. */}
            <motion.div
                className="absolute inset-x-0 top-0 flex items-center justify-between px-4"
                style={{ paddingTop: "max(16px, env(safe-area-inset-top))" }}
                animate={{ opacity: chrome ? 1 : 0 }}
                transition={{ duration: 0.5 }}
            >
                <button
                    type="button"
                    onClick={onClose}
                    className="glass flex h-11 items-center gap-2 rounded-full pl-3.5 pr-4 text-cream"
                >
                    <X className="h-4 w-4" strokeWidth={1.75} />
                    <span className="font-sans text-[0.8125rem] font-medium">close</span>
                </button>
                <p className="t-meta pr-14 text-cream-faint">{film.label}</p>
            </motion.div>

            <motion.div
                className="absolute inset-x-0 bottom-0 mx-auto flex w-full max-w-[560px] items-center gap-3 px-4"
                style={{ paddingBottom: "max(20px, calc(env(safe-area-inset-bottom) + 12px))" }}
                animate={{ opacity: chrome ? 1 : 0 }}
                transition={{ duration: 0.5 }}
            >
                <button
                    type="button"
                    onClick={ended ? replay : toggle}
                    aria-label={playing ? "Pause" : "Play"}
                    className="glass flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
                >
                    {playing ? (
                        <Pause className="h-[18px] w-[18px] text-cream" strokeWidth={1.5} />
                    ) : (
                        <Play className="ml-0.5 h-[18px] w-[18px] text-cream" strokeWidth={1.5} />
                    )}
                </button>
                <button type="button" onClick={seek} aria-label="Seek" className="group relative h-11 flex-1">
                    <span className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-cream/15" />
                    <span
                        className="absolute left-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-gold"
                        style={{ width: `${d ? (t / d) * 100 : 0}%` }}
                    />
                </button>
                <p className="t-meta shrink-0 whitespace-nowrap text-right tabular-nums tracking-[0.04em] text-cream-faint">
                    {fmt(t)} / {fmt(d)}
                </p>
            </motion.div>

            {film.caption && (
                <p className="t-caption absolute inset-x-0 bottom-20 px-6 text-center text-cream-muted">{film.caption}</p>
            )}
        </motion.div>
    )
}
