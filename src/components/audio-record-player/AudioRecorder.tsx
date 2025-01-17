import { Mic, Square } from 'lucide-react'
import PulsatingButton from '../ui/pulsating-button'
import { DurationTips } from './DurationTips'
import { RecorderTips } from './RecorderTips'
import { useAudioRecorder } from './hooks/useAudioRecorder'
import { AudioState } from './type'

type AudioRecorderProps = {
  onRecordingComplete: (audioState: AudioState) => void
}
const formatDuration = (millisecond: number) => {
  // Convert milliseconds to seconds，保留一位小数
  const seconds = millisecond / 1000
  return `${seconds.toFixed(1)}s`
}
export default function AudioRecorder({
  onRecordingComplete,
}: AudioRecorderProps) {
  const { isRecording, startRecording, stopRecording, duration } =
    useAudioRecorder()

  const handleRecordingClick = async () => {
    if (isRecording) {
      const audioUrl = await stopRecording()
      if (audioUrl instanceof Blob) {
        onRecordingComplete({
          url: URL.createObjectURL(audioUrl),
          duration: '0s',
          name: 'recording.wav',
        })
      }
    } else {
      startRecording()
    }
  }

  return (
    <RecorderTips>
      {!isRecording ? (
        <div className='flex flex-col justify-center items-center gap-8'>
          <PulsatingButton
            onClick={handleRecordingClick}
            type='button'
            className='rounded-full transition-all duration-500 p-6'
            roundedFull
          >
            <Mic className='h-9 w-9' />
          </PulsatingButton>
          <div className='text-gray-500 dark:text-gray-400 font-medium'>
            点击开始录制
          </div>
        </div>
      ) : (
        <div className='flex flex-col justify-center items-center '>
          <PulsatingButton
            onClick={handleRecordingClick}
            pulseColor='red'
            type='button'
            className='rounded-full transition-all duration-500 p-6
             bg-red-600 hover:bg-red-500   dark:bg-red-500 dark:hover:bg-red-400'
            roundedFull
          >
            <Square className='h-9 w-9' />
          </PulsatingButton>
          <div className='mt-4 font-medium text-center text-2xl'>
            {formatDuration(duration)}
          </div>
          <DurationTips duration={duration} />
        </div>
      )}
    </RecorderTips>
  )
}
