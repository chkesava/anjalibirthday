"use client"

import { useRef } from "react"

// Horizontal swipe detection that also swallows the click a swipe would otherwise produce.
export function useSwipe({ onNext, onPrev, threshold = 48 }) {
    const start = useRef(null)
    const swiped = useRef(false)

    return {
        onPointerDown(e) {
            start.current = { x: e.clientX, y: e.clientY }
            swiped.current = false
        },
        onPointerUp(e) {
            if (!start.current) return
            const dx = e.clientX - start.current.x
            const dy = e.clientY - start.current.y
            start.current = null
            if (Math.abs(dx) > threshold && Math.abs(dx) > Math.abs(dy) * 1.3) {
                swiped.current = true
                if (dx < 0) onNext?.()
                else onPrev?.()
            }
        },
        onClickCapture(e) {
            if (swiped.current) {
                swiped.current = false
                e.stopPropagation()
                e.preventDefault()
            }
        },
    }
}
