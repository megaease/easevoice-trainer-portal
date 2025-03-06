export const getAudioDuration = async (file: File): Promise<string> => {
  try {
    const audioContext = new AudioContext()
    const arrayBuffer = await file.arrayBuffer()
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
    const durationInSeconds = audioBuffer.duration
    return `${Math.floor(durationInSeconds)}s`
  } catch (error) {
    console.error('Error getting audio duration:', error)
    return '0s'
  }
}

export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      const base64data = (reader.result as string).split(',')[1]
      resolve(base64data)
    }
    reader.onerror = reject
  })
}