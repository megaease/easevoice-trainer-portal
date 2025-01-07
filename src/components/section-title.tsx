import { Separator } from '@/components/ui/separator'

type SectionProps = {
  title: string
  desc: string
  children?: React.JSX.Element
}

export function SectionTitle({ title, desc }: SectionProps) {
  return (
    <div className='flex flex-1 flex-col'>
      <div className='flex-none'>
        <h3 className='text-lg font-medium'>{title}</h3>
        <p className='text-sm text-muted-foreground'>{desc}</p>
      </div>
      <Separator className='my-4 flex-none' />
    </div>
  )
}
