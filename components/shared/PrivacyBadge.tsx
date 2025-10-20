import { ShieldCheck, Lock } from 'lucide-react'

interface PrivacyBadgeProps {
  privacyLevel?: 'full' | 'partial' | 'none'
  zkpEnabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

export function PrivacyBadge({
  privacyLevel = 'none',
  zkpEnabled = false,
  size = 'md',
  showLabel = true
}: PrivacyBadgeProps) {
  if (!zkpEnabled || privacyLevel === 'none') {
    return null
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm'
  }

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16
  }

  const config = {
    full: {
      icon: Lock,
      color: 'bg-purple-100 text-purple-700 border-purple-200',
      label: 'Full Privacy'
    },
    partial: {
      icon: ShieldCheck,
      color: 'bg-blue-100 text-blue-700 border-blue-200',
      label: 'Partial Privacy'
    }
  }

  const { icon: Icon, color, label } = config[privacyLevel] || config.partial

  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${color} ${sizeClasses[size]}`}>
      <Icon size={iconSizes[size]} />
      {showLabel && <span>{label}</span>}
    </div>
  )
}
