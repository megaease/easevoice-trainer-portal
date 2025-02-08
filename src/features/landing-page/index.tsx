import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ModeToggle } from '@/components/mode-toggle'
import Benefits from './Benefits'
import Features from './Feature'
import Footer from './Footer'
import Hero from './Hero'
import ProductShowcase from './ProductShowcase'

function LandingPage() {
  return (
    <>
      <Header fixed>
        <div className='flex items-center gap-3 sm:gap-4 w-full'>
          <div className='flex-1'></div>
          <ModeToggle />
        </div>
      </Header>
      <Main>
        <Hero />
        <Features />
        <ProductShowcase />
        <Benefits />
        <Footer />
      </Main>
    </>
  )
}

export default LandingPage
