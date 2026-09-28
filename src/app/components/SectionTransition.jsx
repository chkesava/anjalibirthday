"use client"

import { motion } from "motion/react"
import { EASE_EXIT, EASE_SOFT } from "./ui/motion"

// Every scene enters and leaves through black ("dip through black"): the body is night,
// so fading a scene out and the next one in reads as a film cut, never a carousel slide.
export default function SectionTransition({ children, label, className = "" }) {
    return (
        <motion.section
            aria-label={label}
            className={`relative min-h-dvh w-full ${className}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.9, delay: 0.2, ease: EASE_SOFT } }}
            exit={{ opacity: 0, transition: { duration: 0.5, ease: EASE_EXIT } }}
        >
            {children}
        </motion.section>
    )
}
