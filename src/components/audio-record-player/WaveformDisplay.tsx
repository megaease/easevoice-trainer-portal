type WaveformDisplayProps = {
  waveformRef: React.RefObject<HTMLDivElement>
}

export default function WaveformDisplay({ waveformRef }: WaveformDisplayProps) {
  return <div ref={waveformRef} className='bg-gray-50 rounded-lg p-4 mb-6' />
}
