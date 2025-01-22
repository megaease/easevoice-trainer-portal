import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import BasicTrainingForm from './basic-training-form'

export default function BasicTraining() {
  return (
    <div className='p-4'>
      <Card className='w-full'>
        <CardHeader>
          <CardTitle>基础模式</CardTitle>
        </CardHeader>
        <CardContent>
          <BasicTrainingForm />
        </CardContent>
      </Card>
    </div>
  )
}
