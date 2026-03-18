/**
 * ProfilePage — /profile
 * Candidate profile: view and edit personal info.
 * All data pulled from authStore — save is mock (ready for backend).
 */

import { memo, useState } from 'react'
import { Link } from 'react-router-dom'
import { User, Mail, Briefcase, MapPin, Save } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/store/authStore'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar'
import { CandidateAppSidebar } from './CandidateAppSidebar'
import { ThemeToggle } from '@/components/theme'

export const ProfilePage = memo(() => {
  const user = useAuthStore(state => state.user)

  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    title: 'Frontend Developer',
    location: 'Ho Chi Minh City, Vietnam',
    bio: 'Passionate frontend developer with experience in React and TypeScript.',
    linkedin: '',
    github: '',
  })

  const handleChange = (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }))

  const handleSave = () => {
    toast.success('Profile updated successfully!')
  }

  const initials = `${form.firstName?.[0] || ''}${form.lastName?.[0] || ''}`.toUpperCase() || 'U'

  return (
    <SidebarProvider>
      <CandidateAppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Profile</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto">
            <ThemeToggle variant="dropdown" />
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-6 p-4 pt-0 max-w-2xl">
          <div className="flex flex-col gap-2 py-4">
            <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
            <p className="text-muted-foreground">Update your personal information and public profile.</p>
          </div>

          {/* Avatar Card */}
          <Card>
            <CardContent className="flex items-center gap-5 pt-6">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-2xl bg-emerald-500/20 text-emerald-400">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1">
                <p className="text-lg font-semibold">{form.firstName} {form.lastName}</p>
                <p className="text-sm text-muted-foreground">{form.email}</p>
                <div className="flex gap-2 mt-1">
                  <Badge variant="secondary">{user?.role || 'candidate'}</Badge>
                  <Badge variant="outline" className="text-emerald-400 border-emerald-500/30">Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Edit Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-emerald-500" />
                Personal Information
              </CardTitle>
              <CardDescription>This information will be shown to recruiters.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" value={form.firstName} onChange={handleChange('firstName')} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" value={form.lastName} onChange={handleChange('lastName')} />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email" className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" /> Email
                </Label>
                <Input id="email" value={form.email} disabled className="opacity-60" />
                <p className="text-xs text-muted-foreground">Email is managed by your auth provider.</p>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="title" className="flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5" /> Job Title
                </Label>
                <Input id="title" value={form.title} onChange={handleChange('title')} />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="location" className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" /> Location
                </Label>
                <Input id="location" value={form.location} onChange={handleChange('location')} />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={form.bio}
                  onChange={handleChange('bio')}
                  rows={3}
                  placeholder="Tell recruiters about yourself..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="linkedin">LinkedIn URL</Label>
                  <Input id="linkedin" value={form.linkedin} onChange={handleChange('linkedin')} placeholder="linkedin.com/in/..." />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="github">GitHub URL</Label>
                  <Input id="github" value={form.github} onChange={handleChange('github')} placeholder="github.com/..." />
                </div>
              </div>

              <Button
                className="w-fit bg-emerald-500 hover:bg-emerald-600 text-black font-semibold mt-2"
                onClick={handleSave}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Profile
              </Button>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
})

ProfilePage.displayName = 'ProfilePage'
