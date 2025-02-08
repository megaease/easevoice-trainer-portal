import { Github, Twitter, Youtube, Tv } from 'lucide-react'
import LogoImg from '@/assets/logo.svg'

const footerLinks = {
  products: [
    { name: 'Easegress', href: 'https://megaease.cn/zh/easegress/' },
    { name: 'EaseMesh', href: 'https://megaease.cn/zh/easemesh/' },
    { name: 'EaseService', href: 'https://megaease.cn/zh/easeservice/' },
    { name: 'EaseMonitor', href: 'https://megaease.cn/zh/easemonitor/' },
    { name: 'EaseStack', href: 'https://megaease.cn/zh/easestack/' },
  ],
  resources: [
    { name: '说明文档', href: 'https://megaease.cn/zh/docs/' },
    { name: '技术文章', href: 'https://megaease.cn/zh/blog/' },
    { name: '技术服务', href: 'https://megaease.cn/zh/service/' },
  ],
  contact: [
    { label: '电话', value: '+86-010-85164638' },
    { label: '商务', value: 'ContactUs@MegaEase.com' },
    { label: '招聘', value: 'Hiring@MegaEase.com' },
    { label: '安全', value: 'Security@MegaEase.com' },
  ],
  social: [
    { name: 'GitHub', icon: Github, href: 'https://github.com/megaease' },
    { name: 'Twitter', icon: Twitter, href: 'https://x.com/megaease' },
    {
      name: 'YouTube',
      icon: Youtube,
      href: 'https://www.youtube.com/channel/UC601txX8qixOJBV6OTQBiOA',
    },
    {
      name: 'BiliBili',
      icon: Tv,
      href: 'https://space.bilibili.com/1677299115',
    },
  ],
}
function Footer() {
  return (
    <footer className='bg-gray-900 dark:bg-gray-800'>
      {/* Main Footer Content */}
      <div className='mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8'>
        <div className='grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-4'>
          {/* Products */}
          <div>
            <h3 className='text-xl font-semibold leading-6 text-blue-400'>
              软件产品
            </h3>
            <ul role='list' className='mt-6 space-y-4'>
              {footerLinks.products.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className='text-sm leading-6 text-gray-300 hover:text-blue-400 transition-colors'
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className='text-xl font-semibold leading-6 text-blue-400'>
              相关资源
            </h3>
            <ul role='list' className='mt-6 space-y-4'>
              {footerLinks.resources.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className='text-sm leading-6 text-gray-300 hover:text-blue-400 transition-colors'
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className='text-xl font-semibold leading-6 text-blue-400'>
              联系我们
            </h3>
            <ul role='list' className='mt-6 space-y-4'>
              {footerLinks.contact.map((item) => (
                <li
                  key={item.label}
                  className='text-sm leading-6 text-gray-300'
                >
                  <span className='text-gray-500'>{item.label}：</span>
                  {item.value}
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className='text-xl font-semibold leading-6 text-blue-400'>
              关注我们
            </h3>
            <div className='mt-6 flex gap-4'>
              {footerLinks.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className='text-gray-400 hover:text-blue-400 transition-colors'
                  title={item.name}
                >
                  <item.icon className='h-6 w-6' aria-hidden='true' />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className='mt-16 pt-8 border-t border-gray-800/40'>
          <div className='flex flex-col items-center gap-4'>
            <div className='flex gap-2 items-center'>
              <img src={LogoImg} alt='MegaEase' className='h-[50px]' />
              <div>
                <p className='text-xs text-gray-400 dark:text-gray-500'>
                  © 2017 - 2025
                </p>
                <p className='text-xs text-gray-400 dark:text-gray-500'>
                  MegaEase, Inc. All Rights Reserved!
                </p>
              </div>
            </div>
            <div className='flex gap-4 text-xs text-gray-500 dark:text-gray-400'>
              <a href='#' className='hover:text-primary transition-colors'>
                京公网安备 11010502045885号
              </a>
              <span>|</span>
              <a href='#' className='hover:text-primary transition-colors'>
                京ICP备16008445号-2
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
