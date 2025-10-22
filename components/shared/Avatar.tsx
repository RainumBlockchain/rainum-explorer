'use client'

import blockies from 'ethereum-blockies-base64'
import { getAddressColor } from '@/lib/utils/color-hash'

interface AvatarProps {
  address: string
  avatarUrl?: string | null
  size?: number
  className?: string
}

/**
 * Avatar component that shows:
 * - Custom avatar image if avatarUrl is provided (for validators with profiles)
 * - Auto-generated blockies identicon based on address (for regular wallets)
 * - Unique colored border based on address (CRH - Color Ring Hash)
 */
export function Avatar({ address, avatarUrl, size = 32, className = '' }: AvatarProps) {
  const borderColor = getAddressColor(address)
  const combinedClassName = `rounded ${className}`

  // If validator has custom avatar, use it
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={address}
        className={combinedClassName}
        style={{
          width: size,
          height: size,
          objectFit: 'cover'
        }}
        onError={(e) => {
          // Fallback to blockies if custom avatar fails to load
          e.currentTarget.src = blockies(address)
        }}
      />
    )
  }

  // Otherwise generate blockies from address
  return (
    <img
      src={blockies(address)}
      alt={address}
      className={combinedClassName}
      style={{
        width: size,
        height: size
      }}
    />
  )
}
