import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  entry: ['src/main.tsx', 'src/App.tsx'],
  project: ['src/**/*.{ts,tsx}'],
  ignore: [
    // 系统和构建文件
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**',
    '.next/**',

    // 自动生成的文件
    'src/routeTree.gen.ts',
    '**/*.gen.ts',

    // UI 组件库
    'src/components/ui/**',

    // 类型定义
    '**/*.d.ts',

    // 测试文件
    '**/*.test.{ts,tsx}',
    '**/*.spec.{ts,tsx}',
    '**/tests/**',

    // 配置文件
    'vite.config.ts',
    'tailwind.config.ts',
    'postcss.config.js',
  ],
}

export default config
