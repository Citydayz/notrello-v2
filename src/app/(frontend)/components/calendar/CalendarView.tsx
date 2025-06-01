'use client'

import { useState, useRef, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { Carte } from '@/payload-types'
import CalendarHeader from './CalendarHeader'
import CalendarEventModal from './CalendarEventModal'
import './calendar.css'
import type { EventClickArg, DateClickArg } from '@fullcalendar/interaction'
import type { FullCalendar } from '@fullcalendar/core'

interface CalendarViewProps {
  cartes: Carte[]
  onCarteCreate: (date: Date) => void
  onCarteUpdate: (carte: Carte) => void
  onCarteDelete: (carteId: string) => void
}

export default function CalendarView({
  cartes,
  onCarteCreate,
  onCarteUpdate,
  onCarteDelete,
}: CalendarViewProps) {
  const calendarRef = useRef<FullCalendar | null>(null)
  const [currentView, setCurrentView] = useState<'dayGridMonth' | 'timeGridWeek' | 'timeGridDay'>(
    'dayGridMonth',
  )
  const [selectedEvent, setSelectedEvent] = useState<Carte | null>(null)
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)

  useEffect(() => {
    const calendarApi = calendarRef.current?.getApi()
    if (calendarApi) {
      calendarApi.changeView(currentView)
    }
  }, [currentView])

  const handleEventClick = (info: EventClickArg) => {
    const carte = cartes.find((c) => c.id === info.event.id)
    if (carte) {
      setSelectedEvent(carte)
      setIsEventModalOpen(true)
    }
  }

  const handleDateClick = (info: DateClickArg) => {
    onCarteCreate(info.date)
  }

  return (
    <div className="calendar-container bg-white rounded-xl shadow p-6">
      <CalendarHeader
        currentView={currentView}
        onViewChange={setCurrentView}
        calendarRef={calendarRef}
      />

      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={currentView}
        headerToolbar={false}
        events={cartes.map((carte) => {
          let start = carte.date
          let end = carte.date
          let allDay = false

          // Extraire la date au format YYYY-MM-DD
          const datePart = carte.date ? carte.date.slice(0, 10) : null

          if (datePart && carte.heure && /^\d{2}:\d{2}/.test(carte.heure)) {
            // Combine la date (YYYY-MM-DD) et l'heure (HH:mm) sans UTC
            const [year, month, day] = datePart.split('-')
            const [hour, minute] = carte.heure.split(':')
            const pad = (n: number) => n.toString().padStart(2, '0')
            start = `${year}-${pad(Number(month))}-${pad(Number(day))}T${pad(Number(hour))}:${pad(Number(minute))}:00`
            if (carte.heureFin && /^\d{2}:\d{2}/.test(carte.heureFin)) {
              const [hourFin, minuteFin] = carte.heureFin.split(':')
              end = `${year}-${pad(Number(month))}-${pad(Number(day))}T${pad(Number(hourFin))}:${pad(Number(minuteFin))}:00`
            } else {
              end = start
            }
          } else {
            allDay = true
          }

          return {
            id: carte.id,
            title: carte.titre,
            start,
            end,
            allDay,
            backgroundColor:
              typeof carte.type === 'object' && carte.type && 'couleur' in carte.type
                ? (carte.type as { couleur: string }).couleur
                : '#3B82F6',
            borderColor:
              typeof carte.type === 'object' && carte.type && 'couleur' in carte.type
                ? (carte.type as { couleur: string }).couleur
                : '#3B82F6',
            textColor: '#FFFFFF',
          }
        })}
        eventClick={handleEventClick}
        dateClick={handleDateClick}
        height="auto"
        locale="fr"
        firstDay={1}
        buttonText={{
          today: "Aujourd'hui",
          month: 'Mois',
          week: 'Semaine',
          day: 'Jour',
        }}
        dayMaxEvents={3}
        moreLinkContent={(args) => `+${args.num} autres`}
        timeZone="Europe/Paris"
      />

      {selectedEvent && (
        <CalendarEventModal
          isOpen={isEventModalOpen}
          onClose={() => {
            setIsEventModalOpen(false)
            setSelectedEvent(null)
          }}
          carte={selectedEvent}
          onUpdate={onCarteUpdate}
          onDelete={onCarteDelete}
        />
      )}
    </div>
  )
}
