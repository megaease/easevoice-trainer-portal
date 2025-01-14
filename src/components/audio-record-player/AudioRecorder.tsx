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
        <PulsatingButton onClick={handleRecordingClick} type='button'>
          <span className='flex items-center dark:text-white'>
            <Mic className='mr-2 h-4 w-4' />
            开始录制
          </span>
        </PulsatingButton>
      ) : (
        <div className='flex flex-col justify-center items-center '>
          <PulsatingButton
            onClick={handleRecordingClick}
            pulseColor='red'
            type='button'
            className='bg-red-600 hover:bg-red-500 
                          dark:bg-red-500 dark:hover:bg-red-400
                          '
          >
            <span className='flex items-center dark:text-white'>
              <Square className='mr-2 h-4 w-4' />
              停止录制
            </span>
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
