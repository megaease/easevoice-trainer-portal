import React from 'react'
import { HelpCircle, Volume2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import { Button } from '../ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip'

export function RecorderTips({ children }: { children: React.ReactNode }) {
  return (
    <div className='border-dashed border-2 border-gray-300 rounded-lg p-6 w-full  flex flex-col items-center gap-4'>
      <h1 className='text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400'>
        语音录制
      </h1>
      <div className='space-y-4 w-full'>
        <Alert className='bg-blue-100/50 dark:bg-blue-900/30 border-none'>
          <Volume2 className='h-5 w-5 text-blue-600 dark:text-blue-400' />
          <AlertTitle className='text-gray-700 dark:text-white'></AlertTitle>

          <AlertDescription className='text-gray-700 dark:text-gray-300 ml-2'>
            请保持安静的环境进行录音
          </AlertDescription>
        </Alert>
      </div>
      <div className='my-4'>{children}</div>
      <div className='bg-gray-100 dark:bg-gray-700 rounded-lg p-4 w-full'>
        <div className='flex items-center justify-between mb-2'>
          <h2 className='text-lg font-semibold text-gray-800 dark:text-gray-200'>
            录音提示
          </h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost'
                  size='sm'
                  className='rounded-full'
                  type='button'
                >
                  <HelpCircle className='h-5 w-5 text-gray-500 dark:text-gray-400' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>按照这些提示获得最佳录音效果</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <ul className='space-y-2 text-sm text-gray-600 dark:text-gray-300'>
          <li className='flex items-center gap-2'>• 保持麦克风距离 10-20cm</li>
          <li className='flex items-center gap-2'>• 录制时长为 3-10 秒</li>
          <li className='flex items-center gap-2'>• 避免背景噪音干扰</li>
        </ul>
      </div>

      <div className='bg-blue-100/50 dark:bg-blue-900/30 rounded-lg p-4'>
        <h2 className='text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200'>
          示例文本
        </h2>
        <p className='text-gray-600 dark:text-gray-300 leading-relaxed text-sm'>
          "夜晚的虫鸣声此起彼伏，偶尔传来狗吠声，远处的汽车轰鸣渐渐消失，宁静的星空显得格外迷人。"
        </p>
      </div>
    </div>
  )
}
