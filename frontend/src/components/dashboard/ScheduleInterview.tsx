/**
 * ScheduleInterview Page — /schedule
 * Candidate can view upcoming scheduled interviews and book new slots.
 * All data is mocked — ready for backend hookup.
 */

import { memo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Clock, Video, Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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

// --- Mock Data ---
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const TIME_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
  '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
]

const BOOKED_SLOTS: Record<string, string[]> = {
  '2026-03-20': ['09:00 AM', '10:00 AM'],
  '2026-03-22': ['02:00 PM'],
  '2026-03-25': ['11:00 AM', '11:30 AM'],
}

interface UpcomingInterview {
  id: string
  jobTitle: string
  company: string
  date: string
  time: string
  type: 'Technical' | 'HR' | 'Final'
}

const upcomingInterviews: UpcomingInterview[] = [
  {
    id: '1',
    jobTitle: 'Senior Frontend Developer',
    company: 'TechCorp Inc.',
    date: '2026-03-20',
    time: '09:00 AM',
    type: 'Technical',
  },
  {
    id: '2',
    jobTitle: 'React Developer',
    company: 'Digital Solutions',
    date: '2026-03-25',
    time: '11:00 AM',
    type: 'HR',
  },
]

// --- Calendar Component ---
const MiniCalendar = memo(({ onSelectDate, selectedDate }: {
  onSelectDate: (date: string) => void
  selectedDate: string | null
}) => {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  const formatDate = (day: number) =>
    `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

  const hasBooking = (day: number) => !!BOOKED_SLOTS[formatDate(day)]

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={prevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="font-semibold">{MONTHS[viewMonth]} {viewYear}</span>
        <Button variant="ghost" size="icon" onClick={nextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {DAYS.map(d => (
          <div key={d} className="text-muted-foreground py-1 text-xs font-medium">{d}</div>
        ))}
        {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const dateStr = formatDate(day)
          const isPast = new Date(dateStr) < new Date(today.toDateString())
          const isSelected = selectedDate === dateStr
          const isToday = dateStr === today.toISOString().split('T')[0]
          const booked = hasBooking(day)
          return (
            <button
              key={day}
              disabled={isPast}
              onClick={() => onSelectDate(dateStr)}
              className={[
                'relative flex h-8 w-full items-center justify-center rounded-md text-sm transition-colors',
                isPast ? 'text-muted-foreground cursor-not-allowed opacity-40' : 'hover:bg-accent cursor-pointer',
                isSelected ? 'bg-emerald-500 text-white hover:bg-emerald-600' : '',
                isToday && !isSelected ? 'border border-emerald-500 font-bold' : '',
              ].join(' ')}
            >
              {day}
              {booked && !isSelected && (
                <span className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-emerald-400" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
})
MiniCalendar.displayName = 'MiniCalendar'

// --- Main Page ---
export const ScheduleInterview = memo(() => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  const bookedForDay = selectedDate ? (BOOKED_SLOTS[selectedDate] || []) : []

  const handleBook = () => {
    if (!selectedDate || !selectedTime) {
      toast.error('Please select a date and time slot.')
      return
    }
    toast.success(`Interview booked for ${selectedDate} at ${selectedTime}!`)
    setSelectedDate(null)
    setSelectedTime(null)
  }

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
                <BreadcrumbPage>Schedule</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto">
            <ThemeToggle variant="dropdown" />
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-6 p-4 pt-0">
          <div className="flex flex-col gap-2 py-4">
            <h1 className="text-3xl font-bold tracking-tight">Schedule Interview</h1>
            <p className="text-muted-foreground">Book a new interview slot or manage your upcoming sessions.</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Calendar + Time Picker */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-emerald-500" />
                    Pick a Date
                  </CardTitle>
                  <CardDescription>Dates with a green dot already have bookings.</CardDescription>
                </CardHeader>
                <CardContent>
                  <MiniCalendar onSelectDate={setSelectedDate} selectedDate={selectedDate} />
                </CardContent>
              </Card>

              {selectedDate && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-emerald-500" />
                      Available Time Slots — {selectedDate}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                      {TIME_SLOTS.map(slot => {
                        const isBooked = bookedForDay.includes(slot)
                        const isSelected = selectedTime === slot
                        return (
                          <button
                            key={slot}
                            disabled={isBooked}
                            onClick={() => setSelectedTime(slot)}
                            className={[
                              'rounded-md border px-3 py-2 text-sm font-medium transition-colors',
                              isBooked ? 'border-muted text-muted-foreground cursor-not-allowed opacity-40 line-through' : 'cursor-pointer hover:border-emerald-500',
                              isSelected ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : '',
                            ].join(' ')}
                          >
                            {slot}
                          </button>
                        )
                      })}
                    </div>
                    <Button
                      className="mt-4 w-full bg-emerald-500 hover:bg-emerald-600 text-black font-semibold"
                      onClick={handleBook}
                      disabled={!selectedTime}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Confirm Booking
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Upcoming Interviews */}
            <div className="flex flex-col gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5 text-emerald-500" />
                    Upcoming
                  </CardTitle>
                  <CardDescription>Your confirmed interview sessions.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  {upcomingInterviews.map(iv => (
                    <div key={iv.id} className="rounded-lg border p-3 flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{iv.jobTitle}</span>
                        <Badge variant="secondary">{iv.type}</Badge>
                      </div>
                      <span className="text-muted-foreground text-xs">{iv.company}</span>
                      <div className="flex items-center gap-2 mt-1 text-xs text-emerald-500 font-medium">
                        <Calendar className="h-3 w-3" /> {iv.date}
                        <Clock className="h-3 w-3 ml-1" /> {iv.time}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
})

ScheduleInterview.displayName = 'ScheduleInterview'
