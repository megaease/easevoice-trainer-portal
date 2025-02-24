import { Link, useLocation } from '@tanstack/react-router'
import { LinkProps } from '@tanstack/react-router'
import { AudioLines, CircleGauge, CircleHelp, Brain } from 'lucide-react'
import logoSvg from '@/assets/logo.svg'
import {
  Sidebar,
  SidebarContent,
  useSidebar,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from '@/components/ui/sidebar'
import { NamespaceSwitch } from '../namespace-switch'
import { NavLink, NavItem } from './types'

// Menu items.
const items: {
  title: string
  url: LinkProps['to']

  icon?: React.ComponentType
}[] = [
  {
    title: '声音克隆',
    url: '/easevoice/voice-clone',
    icon: AudioLines,
  },
  {
    title: '模型训练',
    url: '/easevoice/model-training',
    icon: Brain,
  },
  {
    title: '控制台',
    url: '/easevoice/dashboard',
    icon: CircleGauge,
  },
  {
    title: '关于',
    url: '/easevoice/about',
    icon: CircleHelp,
  },
]
const SidebarMenuLink = ({ item, href }: { item: NavLink; href: string }) => {
  const { setOpenMobile } = useSidebar()
  const handleClick = () => {
    setOpenMobile(false)
    return item.url
  }
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={checkIsActive(href, item)}
        tooltip={item.title}
      >
        <Link to={handleClick()}>
          {item.icon && <item.icon />}
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

function Logo() {
  const { state } = useSidebar()
  return (
    <Link to='/easevoice'>
      <div className='flex gap-1 items-center py-1'>
        <div
          className='flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground
                dark:bg-sidebar-primary-dark dark:text-sidebar-primary-dark-foreground
                '
        >
          <img src={logoSvg} alt='EaseVoice Trainer' />
        </div>
        {state === 'expanded' && (
          <h1 className='text-md font-bold text-center truncate'>
            EaseVoice Trainer
          </h1>
        )}
      </div>
    </Link>
  )
}
export function AppSidebar() {
  const href = useLocation({ select: (location) => location.href })
  return (
    <Sidebar collapsible='icon' variant='floating'>
      <SidebarHeader>
        <Logo />
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
      <SidebarFooter>
        <NamespaceSwitch />
      </SidebarFooter>
    </Sidebar>
  )
}
function checkIsActive(href: string, item: NavItem, mainNav = false) {
  const cleanHref = href.split('?')[0].split('#')[0]
  const cleanItemUrl = item.url ? item.url.split('?')[0].split('#')[0] : ''
  return (
    cleanHref === cleanItemUrl || // endpoint
    cleanHref.startsWith(cleanItemUrl) || // highlight for ease-mode
    !!item?.items?.filter(
      (i) => i.url && i.url.split('?')[0].split('#')[0] === cleanHref
    ).length || // if child nav is active
    (mainNav &&
      cleanHref.split('/')[1] !== '' &&
      cleanHref.split('/')[1] === cleanItemUrl.split('/')[1])
  )
}
