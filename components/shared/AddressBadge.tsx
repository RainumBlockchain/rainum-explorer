'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { formatHash } from '@/lib/utils/format'
import { Avatar } from './Avatar'
import Link from 'next/link'

interface AddressBadgeProps {
  address: string
  short?: boolean
  link?: boolean
  showCopy?: boolean
  showAvatar?: boolean
  avatarSize?: number
  className?: string
}

export function AddressBadge({
  address,
  short = true,
  link = true,
  showCopy = true,
  showAvatar = true,
  avatarSize = 20,
  className = ''
}: AddressBadgeProps) {
  const [copied, setCopied] = useState(false)

  const displayAddress = short ? formatHash(address, 10, 8) : address

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleMouseEnter = () => {
    document.querySelectorAll('[data-address="' + address + '"]').forEach(el => {
      el.classList.add('highlight-active')
    })
  }

  const handleMouseLeave = () => {
    document.querySelectorAll('[data-address="' + address + '"]').forEach(el => {
      el.classList.remove('highlight-active')
    })
  }

  const content = (
    <span
      data-address={address}
      className={'address-highlight inline-flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 hover:border-[#0019ff] hover:bg-blue-50/30 transition-all font-mono text-sm ' + className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{borderRadius: '4px'}}
    >
      {showAvatar && <Avatar address={address} size={avatarSize} />}
      <span className="text-gray-900 font-medium flex-1">{displayAddress}</span>
      {showCopy && (
        <button
          onClick={handleCopy}
          className="p-1 hover:bg-gray-200 transition-colors flex-shrink-0"
          style={{borderRadius: '4px'}}
          title="Copy address"
        >
          {copied ? (
            <Check size={14} className="text-green-600" strokeWidth={2.5} />
          ) : (
            <Copy size={14} className="text-gray-600" strokeWidth={2} />
          )}
        </button>
      )}
    </span>
  )

  if (link) {
    return <Link href={'/account/' + address}>{content}</Link>
  }

  return content
}
