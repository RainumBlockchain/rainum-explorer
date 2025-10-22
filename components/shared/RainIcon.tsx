import Image from 'next/image'

interface RainIconProps {
  size?: number
  className?: string
}

export function RainIcon({ size = 16, className = '' }: RainIconProps) {
  return (
    <Image
      src="/rain-icon.svg"
      alt="RAIN"
      width={size}
      height={size}
      className={className}
    />
  )
}
