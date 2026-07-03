import React from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
type Size    = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:  Variant
  size?:     Size
  loading?:  boolean
  leftIcon?:  React.ReactNode
  rightIcon?: React.ReactNode
  as?: 'button' | 'a'
  href?: string
}

const variantClasses: Record<Variant, string> = {
  primary:   'bg-teal-500 hover:bg-teal-600 text-white shadow-brand-sm hover:shadow-brand active:scale-[0.98]',
  secondary: 'bg-sand-100 hover:bg-sand-200 text-gray-800',
  outline:   'border border-teal-500 text-teal-600 hover:bg-teal-50',
  ghost:     'text-gray-600 hover:bg-gray-100',
  danger:    'bg-red-500 hover:bg-red-600 text-white',
}

const sizeClasses: Record<Size, string> = {
  sm: 'h-8  px-3   text-sm   gap-1.5',
  md: 'h-10 px-4   text-sm   gap-2',
  lg: 'h-12 px-6   text-base gap-2.5',
}

export function Button({
  variant  = 'primary',
  size     = 'md',
  loading  = false,
  leftIcon,
  rightIcon,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center rounded-2xl font-medium',
        'transition-all duration-200 focus-visible:outline-none focus-visible:ring-2',
        'focus-visible:ring-teal-400 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      ) : (
        <>
          {leftIcon}
          {children}
          {rightIcon}
        </>
      )}
    </button>
  )
}
