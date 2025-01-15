import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  ignore: [
    '**/node_modules/**',
    '**/dist/**',
    'src/routeTree.gen.ts',
    'src/components/ui/**',
  ],
}

export default config
