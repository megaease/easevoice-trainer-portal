import { Link, useLocation } from '@tanstack/react-router'
import { NavLink, NavItem } from '@/types'
import {
  AudioLines,
  Home,
  CalendarCheck,
  CircleHelp,
  Brain,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  useSidebar,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

// Menu items.
const items = [
  {
    title: 'Home',
    url: '/',
    icon: Home,
  },
  {
    title: '声音克隆',
    url: '/voice-clone',
    icon: AudioLines,
  },
  {
    title: '模型训练',
    url: '/model-training',
    icon: Brain,
  },
  {
    title: '任务列表',
    url: '/task-list',
    icon: CalendarCheck,
  },
  {
    title: '关于',
    url: '/about',
    icon: CircleHelp,
  },
]
const SidebarMenuLink = ({ item, href }: { item: NavLink; href: string }) => {
  const { setOpenMobile } = useSidebar()
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={checkIsActive(href, item)}
        tooltip={item.title}
      >
        <Link to={item.url} onClick={() => setOpenMobile(false)}>
          {item.icon && <item.icon />}
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export function AppSidebar() {
  const { state } = useSidebar()
  const href = useLocation({ select: (location) => location.href })
  return (
    <Sidebar collapsible='icon' variant='floating'>
      <SidebarHeader>
        <div>
          {state === 'expanded' && (
            <h1 className='text-md font-bold'>MegaCloud GPT SoVITS</h1>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {/* <SidebarGroupLabel>Application</SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuLink key={item.url} item={item} href={href} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
function checkIsActive(href: string, item: NavItem, mainNav = false) {
  return (
    href === item.url || // /endpint?search=param
    href.split('?')[0] === item.url || // endpoint
    !!item?.items?.filter((i) => i.url === href).length || // if child nav is active
    (mainNav &&
      href.split('/')[1] !== '' &&
      href.split('/')[1] === item?.url?.split('/')[1])
  )
}
