import jupyterImg from '@/assets/jupyter.svg'
import sdImg from '@/assets/sd.svg'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Marquee } from '@/components/magicui/marquee'

const reviews = [
  { img: jupyterImg, title: 'Jupyter Notebook for PyTorch' },
  { img: sdImg, title: 'Stable Diffusion ComfyUI' },
  { img: jupyterImg, title: 'ChatGLM with LangChain-Chat' },
  {
    img: sdImg,
    title: 'Stable Diffusion WebUl with 3D to 2D plugin & Juptyer Notebook',
  },
  {
    img: sdImg,
    title: 'Persistent Stable Diffusion WebUI v1.9.0 & Jupyter Notebook',
  },
  { img: jupyterImg, title: 'Jupyter Notebook for PyTorch' },
  {
    img: sdImg,
    title: 'Persistent Stable Diffusion WebUI v1.10.0 & Jupyter Notebook',
  },
  { img: sdImg, title: "Kohya's Stable Diffusion trainer" },
]

const firstRow = reviews.slice(0, reviews.length / 2)
const secondRow = reviews.slice(reviews.length / 2)

const ReviewCard = ({ img, title }: { title: string; img: string }) => {
  return (
    <figure
      className={cn(
        'relative w-64 cursor-pointer overflow-hidden rounded-xl border px-4 py-2',
        // light styles
        'border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]',
        // dark styles
        'dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]'
      )}
    >
      <div className='flex flex-row items-center gap-4 justify-center'>
        <img className='rounded-full' width='32' height='32' alt='' src={img} />
        <blockquote className='mt-2 text-sm'>{title}</blockquote>
      </div>
    </figure>
  )
}

export default function ProductShowcase() {
  return (
    <div className='py-20 '>
      <div className='container mx-auto px-4'>
        <h2 className='text-4xl font-bold text-center mb-6 '>
          一键部署安装预置模板
        </h2>
        <p className='text-center mb-12 text-xl text-gray-600 dark:text-gray-400'>
          快速启动 Stable Diffusion、Jupyter、大模型等服务
        </p>

        <div className='relative flex  w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-background'>
          <Marquee pauseOnHover className='[--duration:20s]'>
            {firstRow.map((review) => (
              <ReviewCard key={review.title} {...review} />
            ))}
          </Marquee>
          <Marquee reverse pauseOnHover className='[--duration:20s]'>
            {secondRow.map((review) => (
              <ReviewCard key={review.title} {...review} />
            ))}
          </Marquee>
          <div className='pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background'></div>
          <div className='pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background'></div>
        </div>
      </div>
    </div>
  )
}
