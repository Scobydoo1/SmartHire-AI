import { memo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Settings, Bell, Shield, Palette } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink,
  BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar'
import { CandidateAppSidebar } from './CandidateAppSidebar'
import { ThemeToggle } from '@/components/theme'

export const SettingsPage = memo(() => {
  const [notifications, setNotifications] = useState({
    email: true, sms: false, interviewReminders: true, resultAlerts: true, marketing: false,
  })
  const [privacy, setPrivacy] = useState({ profileVisible: true, shareResults: false })

  return (
    <SidebarProvider>
      <CandidateAppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem><BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage>Settings</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto"><ThemeToggle variant="dropdown" /></div>
        </header>

        <main className="flex flex-1 flex-col gap-6 p-4 pt-0 max-w-2xl">
          <div className="flex flex-col gap-2 py-4">
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">Manage your account preferences and notifications.</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5 text-emerald-500" />Notifications</CardTitle>
              <CardDescription>Choose how you want to be notified.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              {([
                { key: 'email', label: 'Email Notifications', desc: 'Receive updates via email' },
                { key: 'sms', label: 'SMS Notifications', desc: 'Receive updates via SMS' },
                { key: 'interviewReminders', label: 'Interview Reminders', desc: '24h before each session' },
                { key: 'resultAlerts', label: 'Result Alerts', desc: 'When your scores are ready' },
                { key: 'marketing', label: 'Marketing Emails', desc: 'Product updates and tips' },
              ] as const).map(item => (
                <div key={item.key} className="flex items-center justify-between">
                  <div>
                    <Label htmlFor={item.key} className="font-medium">{item.label}</Label>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch
                    id={item.key}
                    checked={notifications[item.key]}
                    onCheckedChange={v => setNotifications(prev => ({ ...prev, [item.key]: v }))}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5 text-emerald-500" />Privacy</CardTitle>
              <CardDescription>Control your visibility and data sharing.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="profileVisible" className="font-medium">Public Profile</Label>
                  <p className="text-xs text-muted-foreground">Allow recruiters to find your profile</p>
                </div>
                <Switch id="profileVisible" checked={privacy.profileVisible} onCheckedChange={v => setPrivacy(p => ({ ...p, profileVisible: v }))} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="shareResults" className="font-medium">Share Interview Results</Label>
                  <p className="text-xs text-muted-foreground">Share scores with verified recruiters</p>
                </div>
                <Switch id="shareResults" checked={privacy.shareResults} onCheckedChange={v => setPrivacy(p => ({ ...p, shareResults: v }))} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Palette className="h-5 w-5 text-emerald-500" />Appearance</CardTitle>
              <CardDescription>Toggle light/dark mode.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Theme</Label>
                  <p className="text-xs text-muted-foreground">Switch between light and dark mode</p>
                </div>
                <ThemeToggle variant="dropdown" />
              </div>
            </CardContent>
          </Card>

          <Button className="w-fit bg-emerald-500 hover:bg-emerald-600 text-black font-semibold" onClick={() => toast.success('Settings saved!')}>
            <Settings className="mr-2 h-4 w-4" />Save Settings
          </Button>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
})
SettingsPage.displayName = 'SettingsPage'
