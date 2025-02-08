import {
  Check,
  Zap,
  Database,
  Plug as Plugin,
  Code,
  Layout,
} from 'lucide-react'

const benefits = [
  {
    icon: Zap,
    title: '轻松创建持久化应用',
    description: '一键部署 Stable Diffusion，无需复杂配置',
  },
  {
    icon: Database,
    title: '定制数据存储',
    description: '便捷管理专属模型与数据，支持云盘同步',
  },
  {
    icon: Plugin,
    title: '按需安装插件',
    description: '模块化设计，随心所欲地扩展功能',
  },
  {
    icon: Layout,
    title: '多种交互界面',
    description: '支持 ComfyUI、WebUI 等主流界面',
  },
  {
    icon: Code,
    title: '简化开发流程',
    description: '隔离复杂环境，专注于创作与开发',
  },
  {
    icon: Check,
    title: '一键训练模型',
    description: '快速训练并部署你的专属 LoRA 模型',
  },
]

export default function Benefits() {
  return (
    <div className='relative overflow-hidden bg-gray-50 py-24 dark:bg-gray-900 dark:text-gray-100'>
      <div className='mx-auto max-w-7xl px-6 lg:px-8'>
        <div className='mx-auto max-w-2xl text-center mb-16'>
          <h2 className='text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-gray-100'>
            几分钟创建你的专属 Stable Diffusion
          </h2>
          <p className='mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400'>
            降低安装使用技术门槛，让您拥有更大的自由度和创作空间
          </p>
        </div>

        <div className='mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:gap-8 lg:mt-20 lg:max-w-none lg:grid-cols-3'>
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className='relative pl-16 group hover:scale-105 transition-transform duration-300'
            >
              <div className='absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 group-hover:bg-indigo-500 transition-colors duration-300'>
                <benefit.icon className='h-6 w-6 text-white' />
              </div>
              <div>
                <h3 className='text-xl font-semibold leading-7 tracking-tight text-gray-900 dark:text-gray-100'>
                  {benefit.title}
                </h3>
                <p className='mt-2 text-base leading-7 text-gray-600 dark:text-gray-400'>
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
