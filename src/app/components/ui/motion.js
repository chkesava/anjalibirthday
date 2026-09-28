// Shared motion vocabulary — see BIRTHDAY_DESIGN_SYSTEM.md §12.
export const EASE_SOFT = [0.22, 1, 0.36, 1]
export const EASE_IN_OUT = [0.65, 0, 0.35, 1]
export const EASE_EXIT = [0.4, 0, 1, 1]

// Arrival: fade + rise + unblur.
export const arrive = (delay = 0, duration = 0.9) => ({
    initial: { opacity: 0, y: 12, filter: "blur(6px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    exit: { opacity: 0, transition: { duration: 0.5, ease: EASE_EXIT } },
    transition: { duration, delay, ease: EASE_SOFT },
})

export const fade = (delay = 0, duration = 0.7) => ({
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0, transition: { duration: 0.4, ease: EASE_EXIT } },
    transition: { duration, delay, ease: EASE_SOFT },
})

export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
