"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { SONG_SOURCES } from "../../data/config"
import { storage } from "../../hooks/storage"

// One soundtrack for the whole experience. Scenes set a target level; videos and
// voice notes "duck" it. Volume runs through a Web Audio gain node when available,
// because iOS ignores HTMLAudioElement.volume.

const SoundContext = createContext(null)

const effectiveLevel = ({ muted, duck, level }) => {
    if (muted.current) return 0
    return duck.current ?? level.current
}

export function SoundProvider({ children, sources = SONG_SOURCES }) {
    const audioRef = useRef(null)
    const graphRef = useRef(null) // { ctx, gain }
    const levelRef = useRef(0)
    const duckRef = useRef(null)
    const mutedRef = useRef(false)
    const startedRef = useRef(false)
    const suspendedRef = useRef(false) // a video is playing: the song is paused, not just quiet
    const tweenRef = useRef(0)

    const [started, setStarted] = useState(false)
    const [muted, setMuted] = useState(false)
    const [ready, setReady] = useState(false)
    const [source, setSource] = useState(null) // the song file that actually loaded

    const rampTo = useCallback((target, ms) => {
        const audio = audioRef.current
        const graph = graphRef.current
        if (!audio) return
        if (graph) {
            const t = graph.ctx.currentTime
            graph.gain.gain.cancelScheduledValues(t)
            graph.gain.gain.setValueAtTime(graph.gain.gain.value, t)
            graph.gain.gain.linearRampToValueAtTime(target, t + ms / 1000)
            return
        }
        cancelAnimationFrame(tweenRef.current)
        const from = audio.volume
        const t0 = performance.now()
        const step = (now) => {
            const p = Math.min(1, (now - t0) / ms)
            audio.volume = from + (target - from) * p
            if (p < 1) tweenRef.current = requestAnimationFrame(step)
        }
        tweenRef.current = requestAnimationFrame(step)
    }, [])

    const refs = useRef({ muted: mutedRef, duck: duckRef, level: levelRef }).current

    const apply = useCallback(
        (ms = 1500) => {
            if (!startedRef.current) return
            rampTo(effectiveLevel(refs), ms)
        },
        [rampTo, refs]
    )

    // Create the element once and start buffering (no playback before a gesture).
    useEffect(() => {
        const audio = new Audio()
        audio.loop = true
        audio.preload = "auto"
        audio.volume = 0
        let index = 0
        const onError = () => {
            index += 1
            if (index < sources.length) {
                audio.src = sources[index]
                audio.load()
                if (startedRef.current && !mutedRef.current) audio.play().catch(() => { })
            }
        }
        const onReady = () => {
            setReady(true)
            setSource(audio.currentSrc || audio.src)
        }
        audio.addEventListener("error", onError)
        audio.addEventListener("canplaythrough", onReady)
        audio.src = sources[0]
        audioRef.current = audio

        const savedMuted = storage.get("anjali:muted") === "1"
        mutedRef.current = savedMuted
        setMuted(savedMuted)

        return () => {
            audio.removeEventListener("error", onError)
            audio.removeEventListener("canplaythrough", onReady)
            audio.pause()
            audio.removeAttribute("src")
            graphRef.current?.ctx.close().catch(() => { })
            graphRef.current = null
            audioRef.current = null
        }
    }, [sources])

    // Pause while she's away; resume only if she hadn't muted it.
    useEffect(() => {
        const onVisibility = () => {
            const audio = audioRef.current
            if (!audio || !startedRef.current) return
            if (document.hidden) {
                audio.pause()
            } else if (!mutedRef.current && !suspendedRef.current) {
                graphRef.current?.ctx.resume().catch(() => { })
                audio.play().catch(() => { })
            }
        }
        document.addEventListener("visibilitychange", onVisibility)
        return () => document.removeEventListener("visibilitychange", onVisibility)
    }, [])

    // Must be called from a tap/click handler.
    const start = useCallback(() => {
        const audio = audioRef.current
        if (!audio || startedRef.current) return
        startedRef.current = true
        setStarted(true)

        const Ctx = window.AudioContext || window.webkitAudioContext
        if (Ctx && !graphRef.current) {
            try {
                const ctx = new Ctx()
                const source = ctx.createMediaElementSource(audio)
                const gain = ctx.createGain()
                gain.gain.value = 0
                source.connect(gain).connect(ctx.destination)
                audio.volume = 1
                graphRef.current = { ctx, gain }
                ctx.resume().catch(() => { })
            } catch {
                graphRef.current = null
            }
        }
        if (!mutedRef.current) {
            audio.play().catch(() => { })
            rampTo(effectiveLevel(refs), 3000)
        }
    }, [rampTo, refs])

    // Call from any tap: starts the soundtrack, or resumes it if the browser paused it.
    const ensure = useCallback(() => {
        const audio = audioRef.current
        if (!audio) return
        if (!startedRef.current) {
            start()
            return
        }
        if (!mutedRef.current && !suspendedRef.current && audio.paused && !document.hidden) {
            graphRef.current?.ctx.resume().catch(() => { })
            audio.play().catch(() => { })
            rampTo(effectiveLevel(refs), 1500)
        }
    }, [start, rampTo, refs])

    const setLevel = useCallback(
        (level, ms = 1500) => {
            levelRef.current = level
            apply(ms)
        },
        [apply]
    )

    const duck = useCallback(
        (level, ms) => {
            duckRef.current = level
            apply(ms ?? (level === null ? 1500 : 800))
        },
        [apply]
    )

    const toggleMute = useCallback(() => {
        const audio = audioRef.current
        const next = !mutedRef.current
        mutedRef.current = next
        setMuted(next)
        storage.set("anjali:muted", next ? "1" : "0")
        if (!audio || !startedRef.current) return
        if (next) {
            rampTo(0, 400)
            setTimeout(() => mutedRef.current && audio.pause(), 450)
        } else if (!suspendedRef.current) {
            graphRef.current?.ctx.resume().catch(() => { })
            audio.play().catch(() => { })
            rampTo(effectiveLevel(refs), 1200)
        }
    }, [rampTo, refs])

    // Videos: fade the song out and actually pause it, so it picks up where it left off.
    const suspend = useCallback(() => {
        const audio = audioRef.current
        suspendedRef.current = true
        if (!audio || !startedRef.current) return
        rampTo(0, 600)
        setTimeout(() => suspendedRef.current && audio.pause(), 650)
    }, [rampTo])

    const resume = useCallback(
        (ms = 1800) => {
            const audio = audioRef.current
            if (!suspendedRef.current) return
            suspendedRef.current = false
            if (!audio || !startedRef.current || mutedRef.current) return
            graphRef.current?.ctx.resume().catch(() => { })
            audio.play().catch(() => { })
            rampTo(effectiveLevel(refs), ms)
        },
        [rampTo, refs]
    )

    const value = useMemo(
        () => ({ start, ensure, setLevel, duck, suspend, resume, toggleMute, started, muted, ready, source }),
        [start, ensure, setLevel, duck, suspend, resume, toggleMute, started, muted, ready, source]
    )

    return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
}

export function useSound() {
    return useContext(SoundContext)
}
