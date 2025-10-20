'use client'

import { Avatar } from './Avatar'
import { formatHash } from '@/lib/utils/format'
import Link from 'next/link'

interface ValidatorInfo {
  address: string
  nickname?: string
  avatar_url?: string
  tier: number
}

interface ValidatorBadgeProps {
  address: string
  validators: ValidatorInfo[]
  showCopy?: boolean
  link?: boolean
}

export function ValidatorBadge({ address, validators, link = true }: ValidatorBadgeProps) {
  const validator = validators.find(v => v.address.toLowerCase() === address.toLowerCase())

  const displayName = validator?.nickname || formatHash(address, 6, 4)

  const content = (
    <div className="flex items-center gap-2">
      <Avatar
        address={address}
        avatarUrl={validator?.avatar_url}
        size={24}
      />
      <span className="text-sm text-gray-900 font-medium truncate">
        {displayName}
      </span>
    </div>
  )

  if (!link) {
    return content
  }

  return (
    <Link
      href={`/account/${address}`}
      className="hover:opacity-80 transition-opacity inline-flex items-center"
      onClick={(e) => e.stopPropagation()}
    >
      {content}
    </Link>
  )
}
