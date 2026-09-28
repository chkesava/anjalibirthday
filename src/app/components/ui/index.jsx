"use client"

import { motion } from "motion/react"
import { EASE_SOFT, arrive, fade } from "./motion"

/** Primary action: text + gold arrow, no container. */
export function TextButton({ children, onClick, tone = "night", className = "", delay = 0, ...rest }) {
    const color = tone === "paper" ? "text-ink decoration-ink/30" : "text-cream decoration-cream/30"
    return (
        <motion.button
            type="button"
            onClick={onClick}
            className={`group inline-flex min-h-12 items-center gap-2 px-6 py-3 font-sans text-[0.9375rem] font-medium tracking-[0.01em] underline decoration-1 underline-offset-[6px] transition-[text-decoration-color,opacity] duration-200 hover:decoration-current focus-visible:decoration-current active:opacity-70 ${color} ${className}`}
            {...arrive(delay)}
            {...rest}
        >
            <span>{children}</span>
            <span aria-hidden="true" className="text-gold transition-transform duration-200 group-hover:translate-x-[3px]">
                &rarr;
            </span>
        </motion.button>
    )
}

/** Secondary / final actions: hairline pill. Renders a link when `href` is given. */
export function QuietPill({ children, onClick, href, tone = "night", className = "", delay = 0 }) {
    const color =
        tone === "paper"
            ? "border-ink-faint text-ink hover:border-gold"
            : "border-cream-faint text-cream hover:border-gold"
    const classes = `inline-flex min-h-12 items-center justify-center rounded-full border px-[22px] py-3 font-sans text-[0.9375rem] font-medium transition-colors duration-200 hover:bg-gold/[0.06] ${color} ${className}`
    const motionProps = arrive(delay)
    if (href) {
        return (
            <motion.a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...motionProps}>
                {children}
            </motion.a>
        )
    }
    return (
        <motion.button type="button" onClick={onClick} className={classes} {...motionProps}>
            {children}
        </motion.button>
    )
}

/** The quiet mono hint at the bottom of tap-to-advance screens. */
export function TapHint({ children = "tap to continue", delay = 2.5, tone = "night" }) {
    return (
        <motion.p
            aria-hidden="true"
            className={`t-meta pointer-events-none absolute inset-x-0 text-center ${tone === "paper" ? "text-ink-muted" : "text-cream-faint"}`}
            style={{ bottom: "max(28px, calc(env(safe-area-inset-bottom) + 20px))" }}
            {...fade(delay, 1)}
        >
            {children}
        </motion.p>
    )
}

/** Kesava's handwriting. Writes itself on left-to-right. Keep it to ≤ 6 words. */
export function HandNote({ children, delay = 0, duration = 0.9, className = "", style }) {
    return (
        <motion.span
            className={`t-note inline-block text-rose ${className}`}
            style={style}
            initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0.2 }}
            animate={{ clipPath: "inset(0 0% 0 0)", opacity: 1 }}
            transition={{ duration, delay, ease: EASE_SOFT }}
        >
            {children}
        </motion.span>
    )
}

/**
 * A photo as a physical print. The image "develops" (desaturated → full colour) as it arrives,
 * then optionally drifts with a slow, single Ken Burns.
 */
export function PhotoPrint({
    src,
    w,
    h,
    alt,
    maxW = "min(86vw, 560px)",
    maxH = "58dvh",
    rotate = 0,
    develop = 1.4,
    delay = 0,
    kenBurns = false,
    lifted = false,
    className = "",
}) {
    return (
        <motion.figure
            className={`print ${lifted ? "print-lift" : ""} inline-block ${className}`}
            style={{ rotate }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            transition={{ duration: 0.9, delay, ease: EASE_SOFT }}
        >
            <div className="overflow-hidden">
                <motion.img
                    src={src}
                    width={w}
                    height={h}
                    alt={alt}
                    draggable={false}
                    decoding="async"
                    className={`h-auto w-auto select-none object-contain ${kenBurns ? "kenburns" : ""}`}
                    style={{ maxWidth: maxW, maxHeight: maxH }}
                    initial={{ filter: "saturate(0.6) brightness(1.08)" }}
                    animate={{ filter: "saturate(1) brightness(1)" }}
                    transition={{ duration: develop, delay: delay + 0.2, ease: EASE_SOFT }}
                />
            </div>
        </motion.figure>
    )
}

/** Date (mono) + caption (serif italic) under a print. */
export function CaptionBlock({ date, caption, label, delay = 0.6, className = "" }) {
    return (
        <motion.div className={`mx-auto max-w-[28em] text-center ${className}`} {...arrive(delay)}>
            {label && <p className="t-meta mb-2 text-cream-faint">{label}</p>}
            {date && <p className="t-meta mb-2 text-gold/80">{date}</p>}
            {caption && <p className="t-caption text-cream-muted">{caption}</p>}
        </motion.div>
    )
}

/** Title card at the start of a section. */
export function SectionCard({ eyebrow, title, subtitle, cta, onNext }) {
    return (
        <div className="flex min-h-dvh flex-col items-center justify-center px-6 pb-[10vh] text-center">
            {eyebrow && (
                <motion.p className="t-meta mb-5 text-cream-faint normal-case tracking-[0.04em]" {...arrive(0.2)}>
                    {eyebrow}
                </motion.p>
            )}
            <motion.h2 className="t-title text-cream" {...arrive(0.34)}>
                {title}
            </motion.h2>
            {subtitle && (
                <motion.p className="t-caption mt-4 max-w-[24em] text-cream-muted" {...arrive(0.48)}>
                    {subtitle}
                </motion.p>
            )}
            <div className="mt-12">
                <TextButton onClick={onNext} delay={1.2}>
                    {cta}
                </TextButton>
            </div>
        </div>
    )
}
