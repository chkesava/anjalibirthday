import { readFile } from "node:fs/promises"
import path from "node:path"
import Experience from "./components/Experience"

// The letter stays in public/letter.txt so it's easy to edit; it's read once at build time.
async function loadLetter() {
  try {
    return await readFile(path.join(process.cwd(), "public", "letter.txt"), "utf8")
  } catch {
    return "Dear Anjali ❤️\nHappy Birthday! 🎉\n\nYour friend always,\nKesava 💛"
  }
}

export default async function Page() {
  const letter = await loadLetter()
  return <Experience letter={letter} />
}
