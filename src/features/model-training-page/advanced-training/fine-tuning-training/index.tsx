import Normalization from './Normalization'
import GptTraining from './gpt-training'
import SovitsTraining from './sovits-training'

export default function FineTuningTraining() {
  return (
    <div className='space-y-4 h-full pb-[100px] px-4 pt-4'>
      <Normalization />
      <SovitsTraining />
      <GptTraining />
    </div>
  )
}
