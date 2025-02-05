import {
  Boxes,
  CircuitBoard,
  Cloud,
  CodeSquare,
  Container,
  Database,
  Factory,
  Fingerprint,
  Grid,
  Hash,
  Layers,
  LayoutGrid,
  Network,
  Puzzle,
  Shapes,
  Terminal,
  LucideIcon,
} from 'lucide-react'

export const RANDOM_ICONS: LucideIcon[] = [
  Boxes,
  CircuitBoard,
  Cloud,
  CodeSquare,
  Container,
  Database,
  Factory,
  Fingerprint,
  Grid,
  Hash,
  Layers,
  LayoutGrid,
  Network,
  Puzzle,
  Shapes,
  Terminal,
]

// 使用字符串生成固定的随机索引
export const getRandomIconByName = (name: string): LucideIcon => {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i)
    hash = hash & hash // Convert to 32bit integer
  }
  const index = Math.abs(hash) % RANDOM_ICONS.length
  return RANDOM_ICONS[index]
}
