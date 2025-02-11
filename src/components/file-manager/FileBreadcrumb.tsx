import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from '@/components/ui/breadcrumb'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface BreadcrumbProps {
  path: string
  onNavigate: (path: string) => void
  maxItems?: number
}

export function FileBreadcrumb({
  path,
  onNavigate,
  maxItems = 3,
}: BreadcrumbProps) {
  const parts = path.split('/').filter(Boolean)
  const shouldShowEllipsis = parts.length > (maxItems || 3)
  const visibleParts = shouldShowEllipsis ? parts.slice(-2) : parts
  const hiddenParts = shouldShowEllipsis ? parts.slice(0, -2) : []

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink
            onClick={() => onNavigate('/')}
            className='cursor-pointer'
          >
            /
          </BreadcrumbLink>
        </BreadcrumbItem>

        {shouldShowEllipsis && (
          <BreadcrumbItem>
            <BreadcrumbSeparator />
            <DropdownMenu>
              <DropdownMenuTrigger className='flex items-center gap-1 hover:text-foreground outline-none'>
                <BreadcrumbEllipsis className='h-5 w-5' />
              </DropdownMenuTrigger>
              <DropdownMenuContent align='start'>
                {hiddenParts.map((part, index) => {
                  const currentPath = '/' + parts.slice(0, index + 1).join('/')
                  return (
                    <DropdownMenuItem
                      key={currentPath}
                      onClick={() => onNavigate(currentPath)}
                    >
                      {part}
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </BreadcrumbItem>
        )}

        {visibleParts.map((part, index) => {
          const currentPath =
            '/' +
            (shouldShowEllipsis
              ? [
                  ...parts.slice(0, -2),
                  ...visibleParts.slice(0, index + 1),
                ].join('/')
              : parts.slice(0, index + 1).join('/'))
          return (
            <BreadcrumbItem key={currentPath}>
              <BreadcrumbSeparator />
              <BreadcrumbLink
                onClick={() => onNavigate(currentPath)}
                className='cursor-pointer'
              >
                {part}
              </BreadcrumbLink>
            </BreadcrumbItem>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
