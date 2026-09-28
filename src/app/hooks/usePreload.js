"use client"

import { useEffect, useState } from "react"

// Preloads images in order and reports how many have settled (loaded or failed).
export function usePreload(sources) {
    const [done, setDone] = useState(0)

    useEffect(() => {
        let cancelled = false
        const images = sources.map((src) => {
            const img = new Image()
            img.decoding = "async"
            const settle = () => !cancelled && setDone((n) => n + 1)
            img.onload = settle
            img.onerror = settle
            img.src = src
            return img
        })
        return () => {
            cancelled = true
            images.forEach((img) => {
                img.onload = null
                img.onerror = null
            })
        }
    }, [sources])

    return { done: Math.min(done, sources.length), total: sources.length }
}
