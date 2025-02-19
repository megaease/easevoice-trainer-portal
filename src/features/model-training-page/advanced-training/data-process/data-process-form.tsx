import ASR from './components/ASR'
import AudioDenoising from './components/AudioDenoising'
import URV5 from './components/URV5'
import VoiceRefinement from './components/VoiceRefinement'
import VoiceSlicer from './components/VoiceSlicer'

export default function DataProcessForm() {
  return (
    <div className='flex flex-col gap-4 w-full p-4'>
      <URV5 />

      <VoiceSlicer />

      <AudioDenoising />

      <ASR />

      <VoiceRefinement />
    </div>
  )
}
