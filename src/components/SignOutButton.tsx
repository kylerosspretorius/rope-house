'use client'

import { signOut } from 'next-auth/react'

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className="text-xs tracking-widest uppercase text-stone-400 hover:text-stone-800 transition-colors"
    >
      Sign Out
    </button>
  )
}
