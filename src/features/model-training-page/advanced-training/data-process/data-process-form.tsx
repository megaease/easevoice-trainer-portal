import ASR from './components/ASR'
import URV5 from './components/URV5'
import VoiceNoiseReduction from './components/VoiceNoiseReduction'
import VoiceSlicer from './components/VoiceSlicer'
import VoiceTextAnnotation from './components/VoiceTextAnnotation'

export default function DataProcessForm() {
  return (
    <div className='flex flex-col gap-4 w-full p-4'>
      <URV5 />

      <VoiceSlicer />

      <VoiceNoiseReduction />

      <ASR />

      <VoiceTextAnnotation />
    </div>
  )
}
