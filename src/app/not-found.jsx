import Link from "next/link"

export default function NotFound() {
  return (
    <main className="night-vignette flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <p className="t-title text-cream">this page doesn&rsquo;t exist.</p>
      <p className="t-caption mt-4 text-cream-muted">but we do.</p>
      <Link
        href="/"
        className="mt-12 inline-flex min-h-12 items-center gap-2 px-6 font-sans text-[0.9375rem] font-medium text-cream underline decoration-cream/30 underline-offset-[6px] hover:decoration-current"
      >
        <span aria-hidden="true" className="text-gold">&larr;</span> go back
      </Link>
      <div className="grain" aria-hidden="true" />
    </main>
  )
}
