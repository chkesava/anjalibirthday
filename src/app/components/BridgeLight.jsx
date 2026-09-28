"use client"

import { AnimatePresence, motion } from "motion/react"
import { EASE_IN_OUT, EASE_SOFT } from "./ui/motion"

// The warm point of light left behind when the arrival dissolves. It sits exactly where
// the candle's flame will be (see --flame-y in globals.css), outlives the scene cut,
// and fades once the real flame is lit underneath it.
export default function BridgeLight({ visible }) {
    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    key="bridge"
                    aria-hidden="true"
                    className="pointer-events-none fixed left-1/2 z-20"
                    style={{ top: "var(--flame-y)", x: "-50%", y: "-50%" }}
                    initial={{ opacity: 0, scale: 0.2 }}
                    animate={{ opacity: 1, scale: 1, transition: { duration: 1.6, delay: 0.5, ease: EASE_SOFT } }}
                    exit={{ opacity: 0, transition: { duration: 1.1, ease: EASE_IN_OUT } }}
                >
                    <div
                        className="candle-glow h-40 w-40 rounded-full"
                        style={{ background: "radial-gradient(circle, rgb(232 196 122 / 0.28), rgb(232 196 122 / 0.06) 45%, transparent 70%)" }}
                    />
                    <div
                        className="flame absolute left-1/2 top-1/2 h-[26px] w-[14px] -translate-x-1/2 -translate-y-1/2 rounded-[50%_50%_50%_50%/60%_60%_40%_40%]"
                        style={{ background: "radial-gradient(ellipse at 50% 70%, #FFF4DC, #E8C47A 45%, rgb(224 119 58 / 0.7) 80%, transparent)" }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    )
}
