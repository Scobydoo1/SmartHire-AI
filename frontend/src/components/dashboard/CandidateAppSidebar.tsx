/**
 * Candidate App Sidebar Component
 * Sidebar navigation for candidate dashboard using shadcn/ui Sidebar
 */

import { memo, useMemo, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Calendar, FileText, Home, LogOut, Moon, Settings, Sun, User, Video } from 'lucide-react'
import { signOut } from 'aws-amplify/auth'
import { useAuthStore } from '@/store/authStore'
import { toast } from 'sonner'
import { useTheme } from '@/components/theme'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Navigation items configuration
// Using a more structured format for better maintainability
const navigationConfig = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    url: '/',
    icon: Home,
    description: 'View your interview overview',
  },
  {
    id: 'interviews',
    title: 'Interviews',
    url: '/interview',
    icon: Video,
    description: 'Join or review interviews',
  },
  {
    id: 'schedule',
    title: 'Schedule',
    url: '/schedule',
    icon: Calendar,
    description: 'Manage your interview schedule',
  },
  {
    id: 'resume',
    title: 'Resume',
    url: '/resume',
    icon: FileText,
    description: 'Update your resume',
  },
] as const

const CandidateAppSidebarComponent = () => {
  const location = useLocation()
  const user = useAuthStore((state) => state.user)

  // Memoize user initials for performance
  const getUserInitials = useMemo(() => {
    if (user?.name) {
      return user.name
        .split(' ')
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    }
    return user?.email?.[0].toUpperCase() || 'U'
  }, [user])

  // Memoize user display name
  const userDisplayName = useMemo(() => {
    return user?.name || user?.email || 'User'
  }, [user])

  // Optimized sign out handler with feedback
  const handleSignOut = useCallback(async () => {
    try {
      await signOut()
      toast.success('Signed out successfully')
    } catch (err) {
      console.error('Error signing out:', err)
      toast.error('Failed to sign out. Please try again.')
    }
  }, [])

  const { resolvedTheme, toggleTheme } = useTheme()

  // Memoize navigation items to prevent unnecessary re-renders
  const navigationItems = useMemo(() => navigationConfig, [])

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg bg-emerald-500">
                  <span className="font-semibold">SH</span>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">SmartHire</span>
                  <span className="truncate text-xs">Candidate</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.url
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Settings">
                  <Link to="/settings">
                    <Settings />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Profile">
                  <Link to="/profile">
                    <User />
                    <span>Profile</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.email} alt={userDisplayName} />
                    <AvatarFallback>{getUserInitials}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{userDisplayName}</span>
                    <span className="truncate text-xs">{user?.email}</span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width]"
                side="right"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.email} alt={userDisplayName} />
                      <AvatarFallback>{getUserInitials}</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{userDisplayName}</span>
                      <span className="truncate text-xs">{user?.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile">
                    <User />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings">
                    <Settings />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={toggleTheme}>
                  {resolvedTheme === 'dark' ? <Sun /> : <Moon />}
                  {resolvedTheme === 'dark' ? 'Light mode' : 'Dark mode'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export const CandidateAppSidebar = memo(CandidateAppSidebarComponent)
