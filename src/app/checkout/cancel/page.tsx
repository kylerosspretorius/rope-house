export default function CancelPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-stone-50 px-6">
      <div className="text-center max-w-sm">
        <h1 className="text-2xl font-light text-stone-800 mb-3">Payment cancelled</h1>
        <p className="text-sm text-stone-500 leading-relaxed mb-8">
          No payment was taken. Your cart is still saved — head back to try again.
        </p>
        <a
          href="/checkout"
          className="text-sm tracking-widest uppercase text-stone-800 border border-stone-800 px-8 py-3 hover:bg-stone-800 hover:text-white transition-colors"
        >
          Try again
        </a>
      </div>
    </main>
  )
}
