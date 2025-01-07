import React from 'react'
import { ChevronRightIcon } from '@heroicons/react/24/solid'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from '@/components/ui/breadcrumb'

interface BreadcrumbProps {
  path: string
  onNavigate: (path: string) => void
}

export const CustomBreadcrumb: React.FC<BreadcrumbProps> = ({
  path,
  onNavigate,
}) => {
  const parts = path.split('/').filter(Boolean)

  return (
    <Breadcrumb className='px-4 py-2'>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink onClick={() => onNavigate('/')}>Home</BreadcrumbLink>
        </BreadcrumbItem>
        {parts.map((part, index) => (
          <BreadcrumbItem key={index}>
            <ChevronRightIcon className='h-4 w-4 text-gray-400' />
            <BreadcrumbLink
              onClick={() =>
                onNavigate(`/${parts.slice(0, index + 1).join('/')}`)
              }
            >
              {part}
            </BreadcrumbLink>
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
