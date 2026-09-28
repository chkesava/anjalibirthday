"use client"

import { motion } from "motion/react"
import { arrive, fade } from "./motion"

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
