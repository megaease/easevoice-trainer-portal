'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface PulsatingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pulseColor?: string
  duration?: string
  roundedFull?: boolean
}

export default function PulsatingButton({
  className,
  children,
  pulseColor = '#0096ff',
  duration = '1.5s',
  roundedFull = false,
  ...props
}: PulsatingButtonProps) {
  return (
    <button
      className={cn(
        'relative flex cursor-pointer items-center justify-center rounded-lg bg-blue-500 px-4 py-2 text-center text-white dark:bg-blue-500 dark:text-black',
        roundedFull ? 'rounded-full' : '',
        className
      )}
      style={
        {
          '--pulse-color': pulseColor,
          '--duration': duration,
        } as React.CSSProperties
      }
      {...props}
    >
      <div className='relative z-10'>{children}</div>
      <div
        className={cn(
          'absolute left-1/2 top-1/2 size-full -translate-x-1/2 -translate-y-1/2 animate-pulse bg-inherit',
          roundedFull ? 'rounded-full' : 'rounded-lg'
        )}
      />
    </button>
  )
}
