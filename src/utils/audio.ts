export async function getAudioDuration(audioSource: File | string): Promise<string> {
  return new Promise((resolve, reject) => {
    const audio = new Audio()
    
    const cleanup = () => {
      if (typeof audioSource !== 'string') {
        URL.revokeObjectURL(audio.src)
      }
      audio.remove()
    }

    audio.addEventListener('loadedmetadata', () => {
      const seconds = Math.round(audio.duration)
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = seconds % 60
      
      cleanup()
      
      if (minutes > 0) {
        resolve(`${minutes}分${remainingSeconds}秒`)
      } else {
        resolve(`${seconds}秒`)
      }
    })
    
    audio.addEventListener('error', () => {
      cleanup()
      reject(new Error('音频加载失败'))
    })

    audio.src = typeof audioSource === 'string' 
      ? audioSource 
      : URL.createObjectURL(audioSource)
  })
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