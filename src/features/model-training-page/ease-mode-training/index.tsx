import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import EaseModeTrainingForm from './ease-mode-training-form'

export default function EaseModeTraining() {
  return (
    <div className='p-4'>
      <Card className='w-full'>
        <CardHeader>
          <CardTitle>基础模式</CardTitle>
        </CardHeader>
        <CardContent>
          <EaseModeTrainingForm />
        </CardContent>
      </Card>
    </div>
  )
}
