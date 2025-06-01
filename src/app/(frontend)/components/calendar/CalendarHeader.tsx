'use client'

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { RefObject, useState, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import CalendarImport from './CalendarImport'

interface Category {
  id: string
  nom: string
  couleur: string
}

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
  const [categories, setCategories] = useState<Category[]>([])

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

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetch('/api/custom-cat', { credentials: 'include' })
        const data = await res.json()
        setCategories(data.categories)
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error)
      }
    }

    loadCategories()
  }, [])

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
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">{formatDate()}</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <button
            onClick={handleToday}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
          >
            Aujourd'hui
          </button>
          <button
            onClick={handleNext}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={() => onViewChange('dayGridMonth')}
            className={`rounded-lg px-4 py-2 text-sm font-semibold ${
              currentView === 'dayGridMonth'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Mois
          </button>
          <button
            onClick={() => onViewChange('timeGridWeek')}
            className={`rounded-lg px-4 py-2 text-sm font-semibold ${
              currentView === 'timeGridWeek'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Semaine
          </button>
          <button
            onClick={() => onViewChange('timeGridDay')}
            className={`rounded-lg px-4 py-2 text-sm font-semibold ${
              currentView === 'timeGridDay'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Jour
          </button>
        </div>
      </div>
      <CalendarImport categories={categories} setCategories={setCategories} />
    </div>
  )
}
