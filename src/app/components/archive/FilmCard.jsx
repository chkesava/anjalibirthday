"use client"

import { motion } from "motion/react"
import { Play } from "lucide-react"
import { EASE_SOFT } from "../ui/motion"

const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, "0")}`

function Sprockets() {
    return (
        <div aria-hidden="true" className="flex justify-between px-2 py-[7px]">
            {Array.from({ length: 11 }, (_, i) => (
                <span key={i} className="block h-[7px] w-[10px] rounded-[2px] bg-cream/[0.18]" />
            ))}
        </div>
    )
}

/**
 * The film, as an object: a straight, dark strip of film stock with sprocket holes —
 * deliberately unlike the paper prints around it.
 */
export default function FilmCard({ film, onOpen }) {
    return (
        <motion.button
            type="button"
            onClick={onOpen}
            aria-label={`Play ${film.label}, ${fmt(film.duration)}`}
            className="group mx-auto block w-[min(82vw,400px)] text-left"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1, ease: EASE_SOFT }}
        >
            <div
                className="rounded-[3px] bg-[#0A0908] transition-shadow duration-500 group-hover:shadow-[0_30px_70px_-18px_rgb(0_0_0/.8)]"
                style={{ boxShadow: "0 1px 2px rgb(0 0 0 / .5), 0 22px 50px -16px rgb(0 0 0 / .7), inset 0 0 0 1px rgb(242 234 223 / .06)" }}
            >
                <Sprockets />
                <div className="relative mx-3 overflow-hidden rounded-[2px]">
                    <img
                        src={film.card}
                        width={film.cardW}
                        height={film.cardH}
                        alt=""
                        loading="lazy"
                        className="block h-auto w-full transition-transform duration-[1.6s] ease-out group-hover:scale-[1.03]"
                        style={{ filter: "saturate(0.85) brightness(0.8)" }}
                    />
                    <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgb(0_0_0/.45))]" />
                    <span className="glass absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-colors duration-300 group-hover:border-gold/50">
                        <Play className="ml-1 h-[22px] w-[22px] text-cream" strokeWidth={1.5} />
                    </span>
                </div>
                <Sprockets />
            </div>
            <div className="mt-4 flex items-baseline justify-between px-1">
                <p className="t-meta text-cream-faint">
                    {film.label}
                    {film.date ? ` · ${film.date}` : ""}
                </p>
                <p className="t-meta text-cream-faint">{fmt(film.duration)}</p>
            </div>
            {film.caption ? (
                <p className="t-caption mt-3 px-1 text-cream-muted">{film.caption}</p>
            ) : (
                <p className="t-meta mt-2 px-1 normal-case tracking-[0.04em] text-cream-faint/80">press play &middot; sound on</p>
            )}
        </motion.button>
    )
}
