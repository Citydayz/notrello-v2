'use client'

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { RefObject, useState, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface CalendarHeaderProps {
  currentView: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay'
  onViewChange: (view: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay') => void
  calendarRef: RefObject<FullCalendar>
}

export default function CalendarHeader({
  currentView,
  onViewChange,
  calendarRef,
}: CalendarHeaderProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date())

  useEffect(() => {
    const calendarApi = calendarRef.current?.getApi()
    if (calendarApi) {
      const updateDate = () => {
        setCurrentDate(calendarApi.getDate())
      }

      calendarApi.on('datesSet', updateDate)
      return () => {
        calendarApi.off('datesSet', updateDate)
      }
    }
  }, [calendarRef])

  const handlePrev = () => {
    const calendarApi = calendarRef.current?.getApi()
    if (calendarApi) {
      calendarApi.prev()
    }
  }

  const handleNext = () => {
    const calendarApi = calendarRef.current?.getApi()
    if (calendarApi) {
      calendarApi.next()
    }
  }

  const handleToday = () => {
    const calendarApi = calendarRef.current?.getApi()
    if (calendarApi) {
      calendarApi.today()
    }
  }

  const formatDate = () => {
    switch (currentView) {
      case 'dayGridMonth':
        return format(currentDate, 'MMMM yyyy', { locale: fr })
      case 'timeGridWeek':
        const startOfWeek = new Date(currentDate)
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1)
        const endOfWeek = new Date(startOfWeek)
        endOfWeek.setDate(startOfWeek.getDate() + 6)
        return `${format(startOfWeek, 'd MMM', { locale: fr })} - ${format(endOfWeek, 'd MMM yyyy', { locale: fr })}`
      case 'timeGridDay':
        return format(currentDate, 'EEEE d MMMM yyyy', { locale: fr })
      default:
        return format(currentDate, 'MMMM yyyy', { locale: fr })
    }
  }

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <button
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          onClick={handlePrev}
          title="Mois précédent"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
        <button
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          onClick={handleNext}
          title="Mois suivant"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>
        <button
          className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          onClick={handleToday}
        >
          Aujourd&apos;hui
        </button>
        <h2 className="text-xl font-semibold text-gray-800 capitalize">{formatDate()}</h2>
      </div>

      <div className="flex items-center gap-2">
        <button
          className={`px-4 py-2 rounded-lg transition-colors ${
            currentView === 'dayGridMonth'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => onViewChange('dayGridMonth')}
        >
          Mois
        </button>
        <button
          className={`px-4 py-2 rounded-lg transition-colors ${
            currentView === 'timeGridWeek'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => onViewChange('timeGridWeek')}
        >
          Semaine
        </button>
        <button
          className={`px-4 py-2 rounded-lg transition-colors ${
            currentView === 'timeGridDay'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => onViewChange('timeGridDay')}
        >
          Jour
        </button>
      </div>
    </div>
  )
}
