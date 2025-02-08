import { motion } from 'motion/react'
import HeroImg from '@/assets/hero.avif'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <div
      className='relative bg-gradient-to-br from-white to-gray-50
      dark:from-background dark:to-gray-900 py-16 lg:py-24 overflow-hidden
    '
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex flex-col lg:flex-row items-center justify-between py-12 lg:py-24'>
          {/* Left Content */}
          <div className='flex-1 text-center lg:text-left lg:max-w-2xl'>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className='text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight'
            >
              <span
                className='block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500 
              dark:from-indigo-400 dark:to-blue-400'
              >
                MegaEase Cloud GPU
              </span>
              <span className='block mt-2 text-gray-900 dark:text-gray-100'>
                让 AIGC 应用变得简单
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className='mt-6 text-lg sm:text-xl text-gray-600 leading-relaxed dark:text-gray-300'
            >
              一站式 GPU 云服务平台，为您提供高性能算力支持。从 Stable Diffusion
              到Comfyui，轻松部署您的 AI 应用。
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className='mt-8 flex flex-col sm:flex-row justify-center lg:justify-start gap-4'
            >
              <Button size='lg' className='text-base px-8 py-6'>
                <a
                  href='https://cloud.megaease.cn/megacloud/app/main/gpu/resources/list/start'
                  target='_blank'
                >
                  立即开始使用
                </a>
              </Button>
              <Button
                size='lg'
                variant='outline'
                className='text-base px-8 py-6'
              >
                <a href='https://megaease.cn/zh/gpupricing/' target='_blank'>
                  查看价格方案
                </a>
              </Button>
            </motion.div>
            <div className='mt-8 grid grid-cols-3 gap-8'>
              <div className='text-center lg:text-left'>
                <div className='text-2xl font-bold text-indigo-600'>88折</div>
                <div className='mt-1 text-sm text-gray-600 dark:text-gray-400'>
                  专享优惠
                </div>
              </div>
              <div className='text-center lg:text-left'>
                <div className='text-2xl font-bold text-indigo-600'>1分钟</div>
                <div className='mt-1 text-sm text-gray-600 dark:text-gray-400'>
                  快速部署
                </div>
              </div>
              <div className='text-center lg:text-left'>
                <div className='text-2xl font-bold text-indigo-600'>快速</div>
                <div className='mt-1 text-sm text-gray-600 dark:text-gray-400'>
                  技术支持
                </div>
              </div>
            </div>
          </div>
          {/* Right Image */}
          <div className='flex-1 mt-12 lg:mt-0 lg:ml-12'>
            <div className='relative'>
              <div className='absolute inset-0 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-3xl opacity-10 blur-2xl'></div>
              <img
                src={HeroImg}
                alt='GPU Server'
                className='relative rounded-3xl shadow-2xl'
              />
              <div className='absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-xl p-4 flex items-center space-x-4'>
                <div className='w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-6 w-6 text-white'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M13 10V3L4 14h7v7l9-11h-7z'
                    />
                  </svg>
                </div>
                <div>
                  <div className='text-sm font-medium text-gray-900'>
                    高性能算力
                  </div>
                  <div className='text-xs text-gray-500'>RTX 4090D | A10</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Background Decorations */}
      <div className='absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-indigo-50 opacity-50 -z-10'></div>
      <div className='absolute bottom-0 left-1/2 transform -translate-x-1/2'>
        <svg
          className='opacity-10'
          width='400'
          height='400'
          viewBox='0 0 56 56'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path d='M28 0L55.7128 48H0.287188L28 0Z' fill='#4F46E5' />
        </svg>
      </div>
    </div>
  )
}

export default Hero
