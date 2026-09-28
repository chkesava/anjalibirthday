"use client"

import { useEffect, useRef } from "react"

// Calls handlers[event.key] on keydown. Handlers can change every render.
export function useKeys(handlers, enabled = true) {
    const ref = useRef(handlers)
    ref.current = handlers

    useEffect(() => {
        if (!enabled) return
        const onKey = (e) => {
            if (e.metaKey || e.ctrlKey || e.altKey) return
            const fn = ref.current[e.key]
            if (fn) {
                e.preventDefault()
                fn(e)
            }
        }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [enabled])
}
