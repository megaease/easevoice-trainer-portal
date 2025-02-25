import { useState, useEffect, useRef } from 'react'
import { Spinner } from '@/components/ui/Spinner'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ModeToggle } from '@/components/mode-toggle'

function getPath() {
  const path = '/tensorboard'
  const isDev = import.meta.env.MODE === 'development'
  if (isDev) {
    return `${import.meta.env.VITE_API_BASE_URL}${path}`
  }
  return `${location.origin}${path}`
}
export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const iframe = iframeRef.current
    if (iframe) {
      iframe.onload = () => setLoading(false)
    }
  }, [])

  return (
    <>
      <Header>
        <div className='flex items-center gap-3 sm:gap-4 w-full'>
          <div className='flex-1'></div>
          <ModeToggle />
        </div>
      </Header>
      <Main className='h-full'>
        {loading && (
          <div className='flex justify-center items-center h-full'>
            <Spinner />
          </div>
        )}
        <iframe
          ref={iframeRef}
          src={getPath()}
          className='w-full h-full'
          style={{ display: loading ? 'none' : 'block' }}
        />
      </Main>
    </>
  )
}
