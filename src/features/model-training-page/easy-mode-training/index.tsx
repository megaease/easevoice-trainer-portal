import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import EasyModeTrainingForm from './easy-mode-training-form'

export default function EasyModeTraining() {
  return (
    <div className='p-4 h-full'>
      <ScrollArea className='h-full w-full'>
        <Card className='w-full'>
          <CardHeader>
            <CardTitle>基础模式</CardTitle>
          </CardHeader>
          <CardContent>
            <EasyModeTrainingForm />
          </CardContent>
        </Card>
      </ScrollArea>
    </div>
  )
}
