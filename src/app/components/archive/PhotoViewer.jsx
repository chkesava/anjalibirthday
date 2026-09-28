"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { useKeys } from "../../hooks/useKey"
import { ArchiveCaption } from "./ArchivePrint"
import { EASE_SOFT } from "../ui/motion"

/**
 * Fullscreen viewing for the archive's photographs. The print lifts off the page, straightens,
 * and fills the screen; swipe (or ← →) to move through the archive, Esc or tap outside to put it back.
 */
export default function PhotoViewer({ items, index, fromRotate = 0, onIndex, onClose }) {
    const [dir, setDir] = useState(0)
    const item = items[index]

    useEffect(() => {
        const root = document.documentElement
        const prev = root.style.overflow
        root.style.overflow = "hidden"
        return () => {
            root.style.overflow = prev
        }
    }, [])

    const go = (step) => {
        const next = index + step
        if (next < 0 || next >= items.length) return
        setDir(step)
        onIndex(next)
    }

    useKeys({ Escape: onClose, ArrowRight: () => go(1), ArrowLeft: () => go(-1) })

    return (
        <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Photo ${index + 1} of ${items.length}`}
            className="night-vignette fixed inset-0 z-[45] flex flex-col bg-night-950"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
            transition={{ duration: 0.5 }}
            onClick={onClose}
        >
            <div
                className="relative z-10 flex items-center justify-between px-4"
                style={{ paddingTop: "max(16px, env(safe-area-inset-top))" }}
                onClick={(e) => e.stopPropagation()}
            >
                <button type="button" onClick={onClose} className="glass flex h-11 items-center gap-2 rounded-full pl-3.5 pr-4 text-cream">
                    <X className="h-4 w-4" strokeWidth={1.75} />
                    <span className="font-sans text-[0.8125rem] font-medium">close</span>
                </button>
                <p className="t-meta pr-14 tabular-nums text-cream-faint" aria-live="polite">
                    {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                </p>
            </div>

            <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4">
                <AnimatePresence mode="popLayout" initial={false} custom={dir}>
                    <motion.div
                        key={index}
                        custom={dir}
                        className="flex flex-col items-center"
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.25}
                        onDragEnd={(_, info) => {
                            if (info.offset.x < -70 || info.velocity.x < -450) go(1)
                            else if (info.offset.x > 70 || info.velocity.x > 450) go(-1)
                        }}
                        onClick={(e) => e.stopPropagation()}
                        variants={{
                            enter: (d) => (d === 0 ? { opacity: 0, scale: 0.94, rotate: fromRotate, y: 12 } : { opacity: 0, x: 60 * d }),
                            center: { opacity: 1, scale: 1, rotate: 0, x: 0, y: 0 },
                            exit: (d) => ({ opacity: 0, x: -60 * d, transition: { duration: 0.35 } }),
                        }}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.7, ease: EASE_SOFT }}
                    >
                        <figure className="print print-lift" style={{ padding: 8 }}>
                            <img
                                src={item.image.src}
                                width={item.image.w}
                                height={item.image.h}
                                alt={item.image.alt}
                                draggable={false}
                                className="block h-auto w-auto select-none object-contain"
                                style={{ maxWidth: "min(88vw, 1080px)", maxHeight: "calc(100dvh - 300px)" }}
                            />
                        </figure>
                        <ArchiveCaption item={item} index={index} align="center" className="mt-6 px-2" delay={0.15} />
                    </motion.div>
                </AnimatePresence>

                {/* Desktop arrows — small and quiet; phones swipe. */}
                <button
                    type="button"
                    aria-label="Previous photo"
                    disabled={index === 0}
                    onClick={(e) => {
                        e.stopPropagation()
                        go(-1)
                    }}
                    className="glass absolute left-6 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-cream transition-opacity disabled:opacity-0 md:flex"
                >
                    <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
                </button>
                <button
                    type="button"
                    aria-label="Next photo"
                    disabled={index === items.length - 1}
                    onClick={(e) => {
                        e.stopPropagation()
                        go(1)
                    }}
                    className="glass absolute right-6 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-cream transition-opacity disabled:opacity-0 md:flex"
                >
                    <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
                </button>
            </div>

            <p
                className="t-meta pointer-events-none pb-5 text-center normal-case tracking-[0.04em] text-cream-faint md:hidden"
                style={{ paddingBottom: "max(20px, env(safe-area-inset-bottom))" }}
            >
                swipe for the next one &middot; tap outside to close
            </p>
        </motion.div>
    )
}
