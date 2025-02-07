import { useNavigate } from '@tanstack/react-router'
import { Github, ArrowRight, Code, Zap, Scale } from 'lucide-react'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ModeToggle } from '@/components/mode-toggle'

export function About() {
  const navigate = useNavigate()
  return (
    <>
      <Header fixed>
        <div className='flex items-center gap-3 sm:gap-4 w-full'>
          <div className='flex-1'></div>
          <ModeToggle />
        </div>
      </Header>

      <Main>
        <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center'>
          <motion.h1
            className='text-5xl md:text-6xl font-extrabold mb-6'
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            About EaseVoice Trainer
          </motion.h1>
          <motion.p
            className='text-xl md:text-2xl mb-8'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            A refined, modular system for voice synthesis and transformation
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className='flex justify-center gap-4'
          >
            <Button
              size='lg'
              className='flex items-center gap-2'
              onClick={() => navigate({ to: '/voice-clone' })}
            >
              Voice Clone
              <ArrowRight />
            </Button>
            <Button
              variant='outline'
              size='lg'
              onClick={() => navigate({ to: '/model-training' })}
            >
              Model Training
            </Button>
          </motion.div>
        </div>

        <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
          <Card className='mb-16 border-none shadow-sm hover:shadow-lg transition-shadow'>
            <CardHeader>
              <CardTitle className='text-3xl font-bold'>
                Project Overview
              </CardTitle>
              <CardDescription className='text-lg'>
                A refined, modular system for voice synthesis and
                transformation.
              </CardDescription>
            </CardHeader>
            <CardContent className='text-lg space-y-4'>
              <p>
                EaseVoice Trainer is a project designed to streamline and
                enhance the training process for voice synthesis and
                transformation. It is built upon the foundation of GPT-SoVITS,
                inheriting its core concepts while introducing various
                improvements to make the system more accessible, elegant, and
                user-friendly.
              </p>
              <p>
                Although EaseVoice Trainer takes inspiration from GPT-SoVITS, we
                chose not to directly fork the original repository due to
                significant design differences and unique objectives. Our focus
                is on creating a refined, modular system tailored to specific
                use cases and improving maintainability.
              </p>
            </CardContent>
          </Card>

          <h2 className='text-3xl font-bold mb-8 text-center'>Key Features</h2>
          <div className='grid md:grid-cols-3 gap-8 mb-16'>
            {[
              {
                icon: Code,
                title: 'User-Friendly Design',
                description:
                  'Simplified workflows and intuitive configurations make it easier for users to deploy and manage.',
              },
              {
                icon: Zap,
                title: 'Clean Architecture',
                description:
                  'We have split the project into separate frontend and backend repositories for better modularity and maintainability.',
              },
              {
                icon: Scale,
                title: 'Scalability',
                description:
                  'Built with scalability in mind, making it suitable for both small-scale experiments and large-scale production.',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className='h-full hover:shadow-lg transition-shadow border-none shadow-sm'>
                  <CardHeader>
                    <feature.icon className='h-12 w-12 text-purple-600 mb-4' />
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <h2 className='text-3xl font-bold mb-8 text-center'>
            Our Repositories
          </h2>
          <div className='grid md:grid-cols-2 gap-8 mb-16'>
            {[
              {
                title: 'Backend Repository',
                url: 'https://github.com/megaease/easevoice-trainer',
                description:
                  'Developed with Python, FastAPI, and Docker to provide a robust and scalable backend service.',
              },
              {
                title: 'Frontend Repository',
                url: 'https://github.com/megaease/easevoice-trainer-portal',
                description:
                  'Built with React, TypeScript, and modern web technologies to deliver a smooth user experience.',
              },
            ].map((repo, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <Card className='h-full hover:shadow-lg transition-shadow'>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                      <Github className='h-6 w-6' />
                      {repo.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <a
                      href={repo.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-blue-600 hover:underline text-lg'
                    >
                      {repo.url.split('//')[1]}
                    </a>
                    <Separator />
                    <p className='text-slate-600'>{repo.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        <footer className='py-12'>
          <p className='text-center text-slate-500'>
            © 2025 Megaease. All rights reserved.
          </p>
        </footer>
      </Main>
    </>
  )
}
