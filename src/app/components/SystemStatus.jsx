"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { VERSION } from "../data/config"
import { devTodo, gitLog, systemStatus } from "../data/story"
import { EASE_SOFT } from "./ui/motion"

const TONE = { gold: "text-gold", rose: "text-rose" }

/**
 * An easter egg. The quiet last line of the site is secretly a button: tap it and a small
 * developer's corner slides up — system status, Kesava's TODO list, the friendship's git log,
 * and a way to watch it all again.
 */
export default function SystemStatus({ label = VERSION, onReplay }) {
    const [open, setOpen] = useState(false)

    useEffect(() => {
        if (!open) return
        const onKey = (e) => e.key === "Escape" && setOpen(false)
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [open])

    return (
        <>
            <AnimatePresence>
                {open && (
                    <>
                        <motion.button
                            key="scrim"
                            type="button"
                            aria-label="Close"
                            tabIndex={-1}
                            className="fixed inset-0 z-40 cursor-default bg-night-950/80"
                            onClick={() => setOpen(false)}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        />
                        <motion.div
                            key="panel"
                            role="dialog"
                            aria-label="System status"
                            className="fixed left-1/2 z-50 w-[min(88vw,320px)] -translate-x-1/2 rounded-[12px] border border-cream/10 bg-night-900 px-5 pb-4 pt-4 text-left font-mono text-[0.75rem] leading-[1.9] text-cream-muted shadow-[0_24px_60px_-20px_rgb(0_0_0/.8)]"
                            style={{ bottom: "max(64px, calc(env(safe-area-inset-bottom) + 56px))" }}
                            initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            exit={{ opacity: 0, y: 8, transition: { duration: 0.25 } }}
                            transition={{ duration: 0.5, ease: EASE_SOFT }}
                        >
                            <p className="mb-2 text-cream-faint">$ status --all</p>
                            {systemStatus.map((row) => (
                                <p key={row.key} className="flex items-baseline gap-2">
                                    <span>{row.key}</span>
                                    <span aria-hidden="true" className="flex-1 translate-y-[-3px] border-b border-dotted border-cream/20" />
                                    <span className={TONE[row.tone] ?? "text-cream"}>
                                        {row.tone === "gold" && <span aria-hidden="true">&#9679; </span>}
                                        {row.value}
                                    </span>
                                </p>
                            ))}

                            <p className="mb-1 mt-4 text-cream-faint">{"// todo"}</p>
                            {devTodo.map((t) => (
                                <p key={t.text} className={t.done ? "text-cream-faint" : "text-cream"}>
                                    <span aria-hidden="true">{t.done ? "[x] " : "[ ] "}</span>
                                    <span className={t.done ? "line-through decoration-cream/25" : ""}>{t.text}</span>
                                    <span className="sr-only">{t.done ? " (done)" : " (not yet)"}</span>
                                </p>
                            ))}

                            <p className="mb-1 mt-4 text-cream-faint">$ git log --oneline</p>
                            {gitLog.map((c) => (
                                <p key={c.hash} className="grid grid-cols-[4.2rem_1fr] gap-x-2 text-[0.6875rem] leading-[1.8]">
                                    <span className={c.hash === "HEAD" ? "text-gold" : "text-cream-faint"}>{c.hash}</span>
                                    <span className={c.hash === "HEAD" ? "text-cream" : ""}>{c.msg}</span>
                                </p>
                            ))}

                            <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-cream/10 pt-3">
                                <span className="whitespace-nowrap text-cream-faint">{VERSION}</span>
                                {onReplay && (
                                    <button type="button" onClick={onReplay} className="min-h-9 whitespace-nowrap px-1 text-cream underline decoration-cream/25 underline-offset-4 hover:decoration-gold">
                                        watch it again &#8634;
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                aria-label={`${label} (developer notes)`}
                className="t-meta absolute inset-x-0 mx-auto min-h-11 w-fit px-3 normal-case tracking-[0.04em] text-cream-faint transition-colors duration-300 hover:text-cream-muted"
                style={{ bottom: "max(14px, calc(env(safe-area-inset-bottom) + 6px))" }}
            >
                {label}
            </button>
        </>
    )
}
