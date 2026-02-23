'use client'

import { useState } from 'react'
import { Check, Link2 } from 'lucide-react'

export function CopyLinkButton({ token }: { token: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const url = `${process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin}/?token=${token}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-body text-[var(--color-stone)]
                 border border-[var(--color-warm-border)] rounded-md hover:border-[var(--color-forest)]
                 hover:text-[var(--color-forest)] transition-colors cursor-pointer"
      title="Copy invite link"
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 text-emerald-600" />
      ) : (
        <Link2 className="w-3.5 h-3.5" />
      )}
      {copied ? 'Copied' : 'Copy link'}
    </button>
  )
}
