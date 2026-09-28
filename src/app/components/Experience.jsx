"use client"

import { useCallback, useEffect, useState } from "react"
import { AnimatePresence, MotionConfig, motion } from "motion/react"
import { BIRTHDAY, SKIP_COUNTDOWN_IN_DEV } from "../data/config"
import { SCENES, devReturn, devTodo, systemStatus } from "../data/story"
import { storage } from "../hooks/storage"
import { useKeys } from "../hooks/useKey"
import { SoundProvider, useSound } from "./sound/SoundProvider"
import MusicControl from "./MusicControl"
import SectionTransition from "./SectionTransition"
import CountdownGate from "./CountdownGate"
import Intro from "./Intro"
import BirthdayReveal from "./BirthdayReveal"
import MemoryArchive from "./MemoryArchive"
import FriendshipTimeline from "./FriendshipTimeline"
import ThingsISay from "./ThingsISay"
import Letter from "./Letter"
import BeforeYouLeave from "./BeforeYouLeave"
import Ending from "./Ending"
import BridgeLight from "./BridgeLight"

const ORDER = SCENES.map((s) => s.id)
const byId = Object.fromEntries(SCENES.map((s) => [s.id, s]))
const PROGRESS_KEY = "anjali:scene"

// Easter egg: for whoever opens the developer tools.
function greetInConsole() {
    const mono = "font:12px/1.7 ui-monospace,monospace;color:#B8AFA4"
    const pad = (k) => `${k} `.padEnd(20, ".")
    console.log(
        "%c hi Anjali. yes, I actually wrote all of this. happy birthday. — k ",
        "background:#0E0C0B;color:#D9A441;font:14px/2 ui-monospace,monospace;padding:4px 8px;border-radius:4px"
    )
    const NL = String.fromCharCode(10)
    console.log("%c" + systemStatus.map((r) => `${pad(r.key)} ${r.value.toUpperCase()}`).join(NL), mono)
    console.log("%c// TODO" + NL + devTodo.map((t) => `${t.done ? "[x]" : "[ ]"} ${t.text}`).join(NL), mono)
    console.log("%c" + devReturn, "font:13px/2 ui-monospace,monospace;color:#D9A441")
}

export default function Experience({ letter }) {
    return (
        <MotionConfig reducedMotion="user">
            <SoundProvider>
                <Story letter={letter} />
            </SoundProvider>
        </MotionConfig>
    )
}

function Story({ letter }) {
    const sound = useSound()
    const [scene, setScene] = useState(null)
    const [resumeTo, setResumeTo] = useState(null)
    // The point of light that carries the arrival into the candle scene (a match cut).
    const [bridge, setBridge] = useState(false)

    // Decide where to start on the client only (the date and saved progress are browser-side).
    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const early = Date.now() < new Date(BIRTHDAY).getTime()
        const hash = window.location.hash.slice(1)
        const saved = byId[hash]?.resume ? hash : storage.get(PROGRESS_KEY)
        if (saved && byId[saved]?.resume) setResumeTo(saved)
        const skip = params.has("preview") || (SKIP_COUNTDOWN_IN_DEV && process.env.NODE_ENV === "development")
        setScene(early && !skip ? "countdown" : "intro")

        greetInConsole()
    }, [])

    // Easter egg: leave the tab and it quietly asks her to come back.
    useEffect(() => {
        const title = document.title
        const onVisibility = () => {
            document.title = document.hidden ? "come back, Anjali" : title
        }
        document.addEventListener("visibilitychange", onVisibility)
        return () => {
            document.removeEventListener("visibilitychange", onVisibility)
            document.title = title
        }
    }, [])

    const goTo = useCallback((id) => {
        setScene(id)
        if (id !== "reveal") setBridge(false)
        if (byId[id]?.resume) storage.set(PROGRESS_KEY, id)
        window.scrollTo(0, 0)
    }, [])

    const next = useCallback(() => {
        setScene((current) => {
            const id = ORDER[Math.min(ORDER.indexOf(current) + 1, ORDER.length - 1)]
            if (byId[id]?.resume) storage.set(PROGRESS_KEY, id)
            return id
        })
        window.scrollTo(0, 0)
    }, [])

    // Each scene has its own soundtrack level; scenes may fine-tune it after they mount.
    const { setLevel, toggleMute } = sound
    useEffect(() => {
        if (scene) setLevel(byId[scene].level)
    }, [scene, setLevel])

    useKeys({ m: toggleMute, M: toggleMute })

    const endBridge = useCallback(() => setBridge(false), [])
    const startBridge = useCallback(() => setBridge(true), [])
    const toReveal = useCallback(() => goTo("reveal"), [goTo])

    const resume = () => {
        sound.start()
        goTo(resumeTo)
    }

    const chapter = scene ? byId[scene].chapter : null

    return (
        <main className="relative min-h-dvh overflow-x-clip">
            <AnimatePresence mode="wait">
                {scene && (
                    <SectionTransition key={scene} label={chapter || scene}>
                        {scene === "countdown" && <CountdownGate onDone={() => goTo("intro")} />}
                        {scene === "intro" && (
                            <Intro
                                onBegin={sound.start}
                                onHandoff={startBridge}
                                onDone={toReveal}
                                resumeLabel={resumeTo ? byId[resumeTo].resume : null}
                                onResume={resume}
                            />
                        )}
                        {scene === "reveal" && (
                            <BirthdayReveal onNext={next} onArrived={endBridge} />
                        )}
                        {scene === "archive" && <MemoryArchive onNext={next} />}
                        {scene === "timeline" && <FriendshipTimeline onNext={next} />}
                        {scene === "things" && <ThingsISay onNext={next} />}
                        {scene === "letter" && (
                            <Letter text={letter} onNext={next} onBack={() => goTo("timeline")} />
                        )}
                        {scene === "before" && <BeforeYouLeave onNext={next} />}
                        {scene === "ending" && <Ending onReplay={() => goTo("intro")} />}
                    </SectionTransition>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {chapter && (
                    <motion.p
                        key={chapter}
                        aria-hidden="true"
                        className="t-meta pointer-events-none fixed z-40 normal-case tracking-[0.04em] text-cream-faint"
                        style={{
                            top: "max(28px, calc(env(safe-area-inset-top) + 14px))",
                            left: "max(16px, env(safe-area-inset-left))",
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { duration: 0.8, delay: 2 } }}
                        exit={{ opacity: 0, transition: { duration: 0.24 } }}
                    >
                        {chapter}
                    </motion.p>
                )}
            </AnimatePresence>

            <BridgeLight visible={bridge} />
            <MusicControl hidden={scene === "intro"} />
            <div className="grain" aria-hidden="true" />
        </main>
    )
}
