export default function NotFound() {
  return (
    <main dir="rtl" className="min-h-screen bg-[var(--color-cream)] parchment-texture flex items-center justify-center px-6">
      <div className="text-center">
        <p className="font-display text-[7rem] font-light leading-none text-[var(--color-warm-border)] animate-fade-in">
          404
        </p>
        <h1 className="font-display text-2xl font-light italic text-[var(--color-ink)] mt-4 animate-fade-up">
          ההזמנה לא נמצאה.
        </h1>
        <p className="text-sm text-[var(--color-stone)] mt-3 font-body animate-fade-up delay-100">
          אנא בדקו את קישור ההזמנה ונסו שוב.
        </p>
      </div>
    </main>
  )
}
