"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { BIRTHDAY } from "../data/config"
import { arrive } from "./ui/motion"

const target = new Date(BIRTHDAY).getTime()

const split = (ms) => {
    const s = Math.max(0, Math.floor(ms / 1000))
    return [
        { label: "days", value: Math.floor(s / 86400) },
        { label: "hrs", value: Math.floor((s % 86400) / 3600) },
        { label: "min", value: Math.floor((s % 3600) / 60) },
        { label: "sec", value: s % 60 },
    ]
}

// 01.1 — "too early, Anjali." Only shown before midnight IST on the birthday.
export default function CountdownGate({ onDone }) {
    const [left, setLeft] = useState(() => target - Date.now())

    useEffect(() => {
        const id = setInterval(() => {
            const ms = target - Date.now()
            setLeft(ms)
            if (ms <= 0) {
                clearInterval(id)
                setTimeout(onDone, 2100)
            }
        }, 1000)
        return () => clearInterval(id)
    }, [onDone])

    const done = left <= 0

    return (
        <div className="dusk-wash flex min-h-dvh flex-col items-center justify-center px-4 pb-[8vh] text-center">
            <AnimatePresence>
                {!done && (
                    <motion.div key="count" exit={{ opacity: 0, transition: { duration: 0.9 } }}>
                        <motion.h1 className="t-title text-cream" {...arrive(0.3)}>
                            too early, Anjali.
                        </motion.h1>
                        <motion.p className="t-caption mt-3 text-cream-muted" {...arrive(0.6)}>
                            come back at midnight.
                        </motion.p>

                        <motion.div
                            className="mx-auto mt-14 flex max-w-[720px] items-stretch justify-center"
                            role="timer"
                            aria-label="Time until the birthday"
                            {...arrive(1)}
                        >
                            {split(left).map((unit, i) => (
                                <div
                                    key={unit.label}
                                    className={`px-3 sm:px-7 ${i > 0 ? "border-l border-night-700" : ""}`}
                                >
                                    <div className="t-display relative text-cream tabular-nums" style={{ fontSize: "clamp(2.25rem, 11vw, 5rem)" }}>
                                        <AnimatePresence mode="popLayout" initial={false}>
                                            <motion.span
                                                key={unit.value}
                                                className="inline-block"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.24 }}
                                            >
                                                {String(unit.value).padStart(2, "0")}
                                            </motion.span>
                                        </AnimatePresence>
                                    </div>
                                    <div className="t-meta mt-2 text-cream-faint">{unit.label}</div>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
