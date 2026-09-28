"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { archive, archiveFilm } from "../data/memories"
import ArchivePrint, { ArchiveCaption } from "./archive/ArchivePrint"
import FilmCard from "./archive/FilmCard"
import FilmViewer from "./archive/FilmViewer"
import PhotoViewer from "./archive/PhotoViewer"
import { TextButton } from "./ui"
import { EASE_SOFT, arrive } from "./ui/motion"

// 03 — The Chaos Archive: a scrapbook of prints laid out like pages of an editorial,
// not a gallery. Each spread has its own composition; tap any print to see it fullscreen.
// The one film lives at the end, as a strip of film stock with its own little cinema.

// Small, deliberate tilts (never random), one per print.
const TILT = [-1.6, -2.4, 2.2, -0.8, 3.4, 1.4]
const tilt = (i) => TILT[i % TILT.length]

// Spreads cycle through these compositions, so new photos added to memories.js still get a layout.
const PATTERN = [
    ["hero", 1],
    ["pair", 2],
    ["stack", 2],
    ["feature", 1],
]

function buildSpreads(items) {
    const spreads = []
    let i = 0
    let p = 0
    while (i < items.length) {
        let [type, n] = PATTERN[p % PATTERN.length]
        if (i + n > items.length) [type, n] = ["hero", 1]
        spreads.push({ type, at: Array.from({ length: n }, (_, k) => i + k), flip: p >= PATTERN.length && p % 2 === 0 })
        i += n
        p += 1
    }
    return spreads
}

const spreads = buildSpreads(archive)

export default function MemoryArchive({ onNext }) {
    const [viewing, setViewing] = useState(null) // { index, rotate }
    const [film, setFilm] = useState(false)

    const open = (index) => setViewing({ index, rotate: tilt(index) })

    return (
        <div className="night-vignette relative min-h-dvh">
            {/* Keeps the chapter label readable over prints as they scroll underneath. */}
            <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-30 h-20 bg-gradient-to-b from-night-950 via-night-950/70 to-transparent" />

            <div className="mx-auto w-full max-w-[1080px] px-5 pb-28 pt-28 md:px-10 md:pt-36">
                <header className="mb-20 text-center md:mb-28">
                    <motion.p className="t-meta normal-case tracking-[0.04em] text-cream-faint" {...arrive(0.2)}>
                        ~/memories/chaos_archive
                        <span className="mt-1 block">
                            {archive.length} photographs &middot; 1 film
                        </span>
                    </motion.p>
                    <motion.h2 className="t-title mt-5 text-cream" {...arrive(0.35)}>
                        the chaos archive
                    </motion.h2>
                    <motion.p className="t-caption mt-3 text-cream-muted" {...arrive(0.5)}>
                        evidence, in no particular order.
                    </motion.p>
                    <motion.p
                        aria-hidden="true"
                        className="t-meta mt-10 text-cream-faint"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0.6] }}
                        transition={{ duration: 2.4, delay: 1.6 }}
                    >
                        scroll &darr;
                    </motion.p>
                </header>

                <div className="space-y-28 md:space-y-40">
                    {spreads.map((s, k) => (
                        <Spread key={k} spread={s} onOpen={open} />
                    ))}

                    <section aria-label="film" className="pt-4">
                        <motion.p
                            className="t-caption mb-8 text-center text-cream-muted"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true, amount: 0.8 }}
                            transition={{ duration: 1.2, ease: EASE_SOFT }}
                        >
                            and one piece of film.
                        </motion.p>
                        <FilmCard film={archiveFilm} onOpen={() => setFilm(true)} />
                    </section>
                </div>

                <div className="mt-28 flex justify-center">
                    <TextButton onClick={onNext} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} animate={undefined} viewport={{ once: true }}>
                        that&rsquo;s enough chaos
                    </TextButton>
                </div>
            </div>

            <AnimatePresence>
                {viewing && (
                    <PhotoViewer
                        key="photo"
                        items={archive}
                        index={viewing.index}
                        fromRotate={viewing.rotate}
                        onIndex={(index) => setViewing((v) => ({ ...v, index }))}
                        onClose={() => setViewing(null)}
                    />
                )}
                {film && <FilmViewer key="film" film={archiveFilm} onClose={() => setFilm(false)} />}
            </AnimatePresence>
        </div>
    )
}

function Spread({ spread, onOpen }) {
    const [a, b] = spread.at
    const A = archive[a]
    const B = b !== undefined ? archive[b] : null

    if (spread.type === "hero") {
        return (
            <section className="grid items-end gap-10 md:grid-cols-12 md:gap-8">
                <div className={`flex justify-center md:col-span-7 ${spread.flip ? "md:order-2 md:col-start-6" : ""}`}>
                    <ArchivePrint item={A} index={a} rotate={tilt(a)} tape="top" onOpen={() => onOpen(a)} maxW="min(78vw, 540px)" maxH="min(60dvh, 620px)" />
                </div>
                <ArchiveCaption item={A} index={a}
                    className={`mx-auto w-full md:col-span-4 md:mx-0 md:mb-10 ${spread.flip ? "md:order-1 md:col-start-2 md:items-end md:text-right" : "md:col-start-9"}`}
                />
            </section>
        )
    }

    if (spread.type === "pair") {
        return (
            <section>
                <div className="flex flex-col md:flex-row md:items-start md:justify-center">
                    <div className="self-start md:self-auto">
                        <ArchivePrint item={A} index={a} rotate={tilt(a)} onOpen={() => onOpen(a)} maxW="min(64vw, 360px)" maxH="min(46dvh, 420px)" />
                    </div>
                    <div className="-mt-14 self-end md:-ml-12 md:mt-32 md:self-auto">
                        <ArchivePrint item={B} index={b} rotate={tilt(b)} tape="right" z={1} delay={0.15} onOpen={() => onOpen(b)} maxW="min(58vw, 330px)" maxH="min(42dvh, 400px)" />
                    </div>
                </div>
                <div className="mx-auto mt-12 grid max-w-[780px] gap-10 md:grid-cols-2 md:gap-16">
                    <ArchiveCaption item={A} index={a} />
                    <ArchiveCaption item={B} index={b} delay={0.45} />
                </div>
            </section>
        )
    }

    if (spread.type === "stack") {
        // Two near-identical prints, one behind the other — the joke is the duplicate.
        return (
            <section className="grid items-center gap-12 md:grid-cols-12 md:gap-8">
                <div className="flex justify-center md:col-span-7 md:col-start-1">
                    <div className="relative mr-4 mt-4">
                        <div className="absolute left-5 top-5 md:left-7 md:top-7">
                            <ArchivePrint item={B} index={b} rotate={tilt(b)} delay={0.2} onOpen={() => onOpen(b)} maxW="min(72vw, 500px)" maxH="min(44dvh, 400px)" />
                        </div>
                        <ArchivePrint item={A} index={a} rotate={tilt(a)} z={1} onOpen={() => onOpen(a)} maxW="min(72vw, 500px)" maxH="min(44dvh, 400px)" />
                    </div>
                </div>
                <div className="mx-auto flex w-full flex-col gap-10 md:col-span-4 md:col-start-9 md:mx-0">
                    <ArchiveCaption item={A} index={a} />
                    <ArchiveCaption item={B} index={b} delay={0.45} />
                </div>
            </section>
        )
    }

    // feature: a tall portrait with its caption set to the side
    return (
        <section className="grid items-center gap-10 md:grid-cols-12 md:gap-8">
            <ArchiveCaption item={A} index={a} className="order-2 mx-auto w-full md:order-1 md:col-span-4 md:col-start-2 md:mx-0 md:items-end md:text-right" />
            <div className="order-1 flex justify-end pr-2 md:order-2 md:col-span-5 md:col-start-7 md:justify-center">
                <ArchivePrint item={A} index={a} rotate={tilt(a)} tape="left" onOpen={() => onOpen(a)} maxW="min(62vw, 340px)" maxH="min(62dvh, 620px)" />
            </div>
        </section>
    )
}
