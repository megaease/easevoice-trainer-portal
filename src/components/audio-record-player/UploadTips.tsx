import React from 'react'

export function UploadTips({ children }: { children: React.ReactNode }) {
  return (
    <div className='border-dashed border-2 border-gray-300 rounded-lg p-6 w-full  flex flex-col items-center gap-4'>
      <h2 className='mb-2'>请按照下面的提示上传</h2>
      <ul className='text-sm text-gray-500 list-disc dark:text-gray-200 space-y-2'>
        <li>点击或者拖拽音频文件到这里</li>
        <li>支持的音频格式：mp3, wav, ogg, aac 等</li>
        <li>音频文件大小不超过 20MB</li>
      </ul>
      {children}
    </div>
  )
}
