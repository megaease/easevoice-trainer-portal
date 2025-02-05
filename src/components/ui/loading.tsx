'use client'

import { useState, useEffect } from 'react'

interface LoadingProps {
  message?: string
}

export function Loading({ message = '加载中' }: LoadingProps) {
  const [dots, setDots] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + '.' : ''))
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className='fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm'>
      <svg className='w-24 h-24' viewBox='0 0 24 24'>
        <circle
          className='text-gray-300'
          cx='12'
          cy='12'
          r='10'
          stroke='currentColor'
          strokeWidth='4'
          fill='none'
        />
        <path
          className='text-primary'
          d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2'
          fill='none'
          stroke='currentColor'
          strokeWidth='4'
          strokeDasharray='60'
          strokeDashoffset='60'
          strokeLinecap='round'
        >
          <animate
            attributeName='stroke-dashoffset'
            dur='1.5s'
            repeatCount='indefinite'
            from='60'
            to='-60'
          />
        </path>
      </svg>
      <div className='mt-4 text-lg font-semibold text-primary'>
        {message}
        <span className='inline-block w-6'>{dots}</span>
      </div>
    </div>
  )
}
