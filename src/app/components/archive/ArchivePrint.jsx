"use client"

import { motion } from "motion/react"
import { exhibitLabel } from "../../data/memories"
import { EASE_SOFT } from "../ui/motion"

/** A strip of paper tape. Used sparingly — a few prints in the whole archive. */
export function Tape({ at = "top", tilt = -3 }) {
    const place =
        at === "top"
            ? "left-1/2 -top-3 -translate-x-1/2"
            : at === "left"
                ? "-left-4 top-3 -rotate-[38deg]"
                : "-right-4 top-3 rotate-[38deg]"
    return (
        <span
            aria-hidden="true"
            className={`absolute z-10 block h-[22px] w-[88px] ${place}`}
            style={{
                rotate: at === "top" ? `${tilt}deg` : undefined,
                background:
                    "linear-gradient(90deg, rgb(242 234 223 / 0.42), rgb(233 221 203 / 0.55) 50%, rgb(242 234 223 / 0.42))",
                boxShadow: "0 1px 2px rgb(14 12 11 / 0.25)",
                // torn ends
                clipPath: "polygon(2% 8%, 98% 0, 100% 45%, 97% 100%, 3% 92%, 0 55%)",
            }}
        />
    )
}

/**
 * A photograph in the archive: a paper print with a writing margin at the bottom where its
 * exhibit number is marked. Arrives as you scroll to it and "develops" into full colour.
 */
export default function ArchivePrint({ item, index, maxW, maxH, rotate = 0, tape, onOpen, className = "", z = 0, delay = 0 }) {
    const number = String(index + 1).padStart(2, "0")
    return (
        <motion.button
            type="button"
            onClick={onOpen}
            aria-label={`Open photo ${number}: ${item.caption}`}
            className={`group relative block text-left ${className}`}
            style={{ rotate, zIndex: z }}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 1, delay, ease: EASE_SOFT }}
        >
            <figure
                className="print relative transition-[box-shadow,translate] duration-500 ease-out group-hover:-translate-y-1 group-hover:shadow-[0_2px_4px_rgb(14_12_11/.3),0_28px_60px_-14px_rgb(14_12_11/.65)]"
                style={{ paddingBottom: 34 }}
            >
                {tape && <Tape at={tape} />}
                <div className="overflow-hidden">
                    <motion.img
                        src={item.image.src}
                        width={item.image.w}
                        height={item.image.h}
                        alt={item.image.alt}
                        draggable={false}
                        loading="lazy"
                        decoding="async"
                        className="block h-auto w-auto select-none object-contain"
                        style={{ maxWidth: maxW, maxHeight: maxH }}
                        initial={{ filter: "saturate(0.55) brightness(1.1)" }}
                        whileInView={{ filter: "saturate(1) brightness(1)" }}
                        viewport={{ once: true, amount: 0.35 }}
                        transition={{ duration: 1.6, delay: delay + 0.25, ease: EASE_SOFT }}
                    />
                </div>
                <figcaption className="absolute inset-x-[10px] bottom-[9px] flex items-baseline justify-between font-mono text-[0.6875rem] tracking-[0.06em] text-ink-muted">
                    <span>no. {number}</span>
                    {item.date && <span>{item.date}</span>}
                </figcaption>
            </figure>
        </motion.button>
    )
}

/** Label, date and Kesava's caption for a print — written beside it, never on top of it. */
export function ArchiveCaption({ item, index, align = "left", className = "", delay = 0.3 }) {
    const alignment = align === "right" ? "text-right items-end" : align === "center" ? "text-center items-center" : "text-left items-start"
    return (
        <motion.div
            className={`flex max-w-[26em] flex-col ${alignment} ${className}`}
            initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1.1, delay, ease: EASE_SOFT }}
        >
            <p className="t-meta text-cream-faint">{exhibitLabel(index)}</p>
            {item.date && <p className="t-meta mt-1.5 text-gold/80">{item.date}</p>}
            <p className="t-caption mt-3 text-cream-muted">{item.caption}</p>
            {item.memory && <p className="t-caption mt-3 not-italic text-cream-muted">{item.memory}</p>}
            {item.note && (
                <p className="t-note mt-3 text-rose" style={{ rotate: "-2deg" }}>
                    {item.note}
                </p>
            )}
            {item.joke && (
                <p className="t-note mt-2 text-gold-soft" style={{ rotate: "1.5deg" }}>
                    {item.joke}
                </p>
            )}
        </motion.div>
    )
}
