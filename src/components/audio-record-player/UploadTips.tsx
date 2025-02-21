import React from 'react'

export function UploadTips({ children }: { children: React.ReactNode }) {
  return (
    <div className='border-dashed border-2 border-gray-300 rounded-lg p-6 w-full  flex flex-col items-center gap-4'>
      <h1 className='text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400'>
        文件上传
      </h1>

      <div className='flex flex-col items-center justify-center space-y-4 text-center mt-4'>
        {children}
        <div>
          <p className='text-base font-medium text-gray-700 dark:text-gray-300'>
            点击或者拖拽音频文件到这里
          </p>
          <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
            支持mp3, wav, ogg, aac 等音频格式
          </p>
          <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
            音频文件大小不超过 20MB
          </p>
        </div>
      </div>
    </div>
  )
}
