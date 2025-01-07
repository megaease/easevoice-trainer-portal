import React from 'react'
import { ChevronRightIcon } from '@heroicons/react/24/solid'

interface BreadcrumbProps {
  path: string
  onNavigate: (path: string) => void
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ path, onNavigate }) => {
  const parts = path.split('/').filter(Boolean)

  return (
    <div className='flex items-center space-x-2 p-4'>
      <button
        onClick={() => onNavigate('/')}
        className='text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
      >
        Home
      </button>
      {parts.map((part, index) => (
        <React.Fragment key={index}>
          <ChevronRightIcon className='h-4 w-4 text-gray-400' />
          <button
            onClick={() =>
              onNavigate(`/${parts.slice(0, index + 1).join('/')}`)
            }
            className='text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
          >
            {part}
          </button>
        </React.Fragment>
      ))}
    </div>
  )
}
