import { DollarSign, Zap, Headphones, HardDrive } from 'lucide-react'

const features = [
  {
    icon: <DollarSign className='h-16 w-16 text-green-500' />,
    title: '性价比高',
    description: '多种 GPU 规格资源配置可选，专享88折优惠，可能是全网最低价',
  },
  {
    icon: <Zap className='h-16 w-16 text-yellow-500' />,
    title: '部署简单',
    description:
      '一键快速安装启动 Stable Diffusion 服务！ 一次安装的模型和插件，永久生效！',
  },
  {
    icon: <Headphones className='h-16 w-16 text-blue-500' />,
    title: '高质量的用户售后',
    description: '优质用户交流群，更有身经百战的程序员为您保驾护航',
  },
  {
    icon: <HardDrive className='h-16 w-16 text-purple-500' />,
    title: '云盘数据同步',
    description:
      '支持百度网盘与阿里云盘两大主流服务商， 方便用户同步模型和大量数据',
  },
]

export default function Features() {
  return (
    <div className='py-20 bg-gray-50 dark:bg-gray-900'>
      <div className='container mx-auto px-4'>
        <h2 className='text-4xl font-bold text-center mb-16 text-gray-800 dark:text-gray-100'>
          为什么选择我们的 GPU 云服务？
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12'>
          {features.map((feature, index) => (
            <div
              key={index}
              className='flex flex-col items-center text-center group'
            >
              <div className='mb-6 transform group-hover:scale-110 transition-transform duration-300'>
                {feature.icon}
              </div>
              <h3 className='text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100'>
                {feature.title}
              </h3>
              <p className='text-gray-600 leading-relaxed dark:text-gray-400'>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
