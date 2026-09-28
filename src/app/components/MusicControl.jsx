"use client"

import { AnimatePresence, motion } from "motion/react"
import { useSound } from "./sound/SoundProvider"

export default function MusicControl({ hidden = false }) {
    const { started, muted, toggleMute } = useSound()

    return (
        <AnimatePresence>
            {started && !hidden && (
                <motion.button
                    type="button"
                    onClick={toggleMute}
                    aria-label={muted ? "Sound off. Turn sound on" : "Sound on. Turn sound off"}
                    aria-pressed={!muted}
                    className="glass fixed z-50 flex h-11 w-11 items-center justify-center rounded-full"
                    style={{
                        top: "max(16px, env(safe-area-inset-top))",
                        right: "max(16px, env(safe-area-inset-right))",
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.9, delay: 0.6 }}
                >
                    <span className="relative flex h-3.5 items-end gap-[3px]" aria-hidden="true">
                        {[0, 1, 2].map((i) => (
                            <span
                                key={i}
                                className={`block w-[3px] rounded-full bg-cream ${muted ? "" : "eq-bar"}`}
                                style={{
                                    height: muted ? 3 : 14,
                                    animationDelay: `${i * 0.18}s`,
                                    opacity: muted ? 0.55 : 0.9,
                                }}
                            />
                        ))}
                        {muted && (
                            <span className="absolute left-1/2 top-1/2 h-px w-5 -translate-x-1/2 -translate-y-1/2 rotate-[-35deg] bg-cream/70" />
                        )}
                    </span>
                </motion.button>
            )}
        </AnimatePresence>
    )
}
