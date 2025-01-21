import ASR from './components/ASR'
import URV5 from './components/URV5'
import VoiceNoiseReduction from './components/VoiceNoiseReduction'
import VoiceSeparation from './components/VoiceSeparation'
import VoiceTextAnnotation from './components/VoiceTextAnnotation'

export default function DataProcessForm() {
  return (
    <div className='flex flex-col gap-4 w-full'>
      <URV5 />

      <VoiceSeparation />

      <VoiceNoiseReduction />

      <ASR />

      <VoiceTextAnnotation />
    </div>
  )
}
