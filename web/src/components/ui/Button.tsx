import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'destructive'

const variantClasses: Record<Variant, string> = {
  primary: 'bg-coral-dark text-bg shadow-md shadow-coral-dark/20',
  secondary: 'bg-coral-tint text-coral-dark',
  ghost: 'bg-transparent text-text-primary border border-border hover:bg-bg-card',
  destructive: 'bg-ink text-bg',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
}

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`rounded-xl px-5 py-3 font-heading font-semibold text-sm transition active:scale-95 disabled:opacity-40 disabled:pointer-events-none ${variantClasses[variant]} ${className}`}
      {...props}
    />
  )
}
