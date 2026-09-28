import { existsSync } from "node:fs"
import { readFile } from "node:fs/promises"
import path from "node:path"
import Experience from "./components/Experience"
import { SONG_SOURCES } from "./data/config"

// The letter stays in public/letter.txt so it's easy to edit; it's read once at build time.
async function loadLetter() {
  try {
    return await readFile(path.join(process.cwd(), "public", "letter.txt"), "utf8")
  } catch {
    return "Dear Anjali ❤️\nHappy Birthday! 🎉\n\nYour friend always,\nKesava 💛"
  }
}

// Only offer the browser song files that actually exist (no 404s while Yaaron isn't added yet).
function availableSongs() {
  const found = SONG_SOURCES.filter((src) => existsSync(path.join(process.cwd(), "public", src)))
  return found.length ? found : SONG_SOURCES.slice(-1)
}

export default async function Page() {
  const letter = await loadLetter()
  return <Experience letter={letter} songs={availableSongs()} />
}
