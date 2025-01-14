import React from 'react'

export function RecorderTips({ children }: { children: React.ReactNode }) {
  return (
    <div className='border-dashed border-2 border-gray-300 rounded-lg p-6 w-full  flex flex-col items-center gap-4'>
      <h2 className='mb-2'>请按照下面的提示录制</h2>
      <ul className='text-sm text-gray-500 list-disc dark:text-gray-200 space-y-2'>
        <li>点击下方按钮开始录制音频</li>
        <li>录制时请保持安静环境</li>
        <li>说话时请保持离麦克风 10-20cm 的距离</li>
        <li>录制时长为 3-10 秒</li>
        <li>点击停止录制按钮结束录制</li>
      </ul>

      <div className='my-4 p-4 bg-indigo-50 rounded-lg border border-indigo-100 dark:bg-indigo-900 dark:border-indigo-800'>
        <div className='text-sm text-slate-600 mb-3 dark:text-slate-200'>
          您可以朗读以下示例文本：
        </div>
        <div className='text-sm text-indigo-600 cursor-pointer hover:text-indigo-700 transition-colors dark:text-indigo-200'>
          夜晚的虫鸣声此起彼伏，偶尔传来狗吠声，远处的汽车轰鸣渐渐消失，宁静的星空显得格外迷人。{' '}
        </div>
      </div>

      {children}
    </div>
  )
}
