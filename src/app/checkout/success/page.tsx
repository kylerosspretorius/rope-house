export default function SuccessPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-stone-50 px-6">
      <div className="text-center max-w-sm">
        <div className="w-12 h-12 rounded-full bg-stone-800 flex items-center justify-center mx-auto mb-6">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-light text-stone-800 mb-3">Thank you for your order</h1>
        <p className="text-sm text-stone-500 leading-relaxed mb-8">
          Your payment was successful. Sally-Anne will be in touch shortly to arrange delivery.
        </p>
        <a
          href="/"
          className="text-sm tracking-widest uppercase text-stone-800 border border-stone-800 px-8 py-3 hover:bg-stone-800 hover:text-white transition-colors"
        >
          Back to shop
        </a>
      </div>
    </main>
  )
}
