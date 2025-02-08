import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/context/theme-context'
import { Button } from '@/components/ui/button'

export function ModeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <Button
      variant='ghost'
      className='group/toggle h-8 w-8 px-0 rounded-full'
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      <Sun className='hidden [html.dark_&]:block' />
      <Moon className='hidden [html.light_&]:block' />
      <span className='sr-only'>Toggle theme</span>
    </Button>
  )
}
