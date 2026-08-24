import type { ReactNode } from 'react'

type Tone = 'success' | 'pending' | 'xp' | 'neutral'

const toneClasses: Record<Tone, string> = {
  success: 'bg-bg-card-alt text-ink',
  pending: 'bg-bg-card-alt text-text-muted',
  xp: 'bg-coral text-bg font-semibold',
  neutral: 'bg-bg-card-alt text-text-primary',
}

interface BadgeProps {
  children: ReactNode
  tone?: Tone
}

export function Badge({ children, tone = 'neutral' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${toneClasses[tone]}`}>
      {children}
    </span>
  )
}
