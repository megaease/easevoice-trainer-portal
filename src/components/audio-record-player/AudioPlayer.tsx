import React, { useRef, useEffect } from 'react'
import { AudioControls } from './AudioControls'
import WaveformDisplay from './WaveformDisplay'
import { useAudioRecorder } from './hooks/useAudioRecorder'
import { useWaveSurfer } from './hooks/useWaveSurfer'

export default function AudioPlayer() {
  const waveformRef = useRef(null)
  const { isPlaying, togglePlay, loadAudio } = useWaveSurfer(waveformRef)
  const { isRecording, audioUrl, startRecording, stopRecording } =
    useAudioRecorder()

  useEffect(() => {
    if (audioUrl) {
      loadAudio(audioUrl)
    }
  }, [audioUrl])

  const handleRecordingClick = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  return (
    <div className='max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden'>
      <div className='p-6'>
        <WaveformDisplay waveformRef={waveformRef} />
        <AudioControls
          onRecordingClick={handleRecordingClick}
          isPlayEnabled={!!audioUrl}
          isPlaying={isPlaying}
          onPlayClick={togglePlay}
        />
      </div>
    </div>
  )
}
