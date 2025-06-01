'use client'

import { useState } from 'react'
import { CalendarIcon } from '@heroicons/react/24/outline'
import CalendarImportModal from './CalendarImportModal'

interface Category {
  id: string
  nom: string
  couleur: string
}

interface CalendarImportProps {
  categories: Category[]
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>
}

interface CalendarEvent {
  icalId?: string
  titre?: string
  date?: string
  heure?: string
  heureFin?: string
  description?: string
}

export default function CalendarImport({ categories, setCategories }: CalendarImportProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = async (categoryId: string) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.ics,.ical'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      setIsLoading(true)
      setError(null)

      try {
        const text = await file.text()
        const events = parseICS(text)

        if (events.length === 0) {
          setError('Aucun événement valide n&apos;a été trouvé dans le fichier')
          return
        }

        console.log('Événements parsés:', events)

        const response = await fetch('/api/calendar/import', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            events: events.map((event) => ({
              ...event,
              type: categoryId,
            })),
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Erreur lors de l&apos;importation')
        }

        if (data.errors && data.errors.length > 0) {
          setError(data.errors.join('\n'))
        } else if (data.imported === 0) {
          setError('Aucun événement n&apos;a été importé')
        } else {
          window.location.reload()
        }
      } catch (err) {
        console.error('Erreur complète:', err)
        setError(err instanceof Error ? err.message : 'Erreur lors de l&apos;importation')
      } finally {
        setIsLoading(false)
        setIsModalOpen(false)
      }
    }
    input.click()
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
      >
        <CalendarIcon className="h-5 w-5" />
        Importer un calendrier
      </button>

      <CalendarImportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onImport={handleFileSelect}
        categories={categories}
        setCategories={setCategories}
      />

      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="rounded-lg bg-white p-6 shadow-xl">
            <div className="text-center">
              <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
              <p className="text-lg font-semibold text-gray-900">Importation en cours...</p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="rounded-lg bg-white p-6 shadow-xl max-w-lg w-full">
            <div className="text-center">
              <p className="text-lg font-semibold text-red-600 mb-4">
                Erreur lors de l&apos;importation
              </p>
              <div className="text-sm text-gray-600 whitespace-pre-line mb-4">{error}</div>
              <button
                onClick={() => setError(null)}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function parseICS(icsContent: string) {
  const events: CalendarEvent[] = []
  // Normaliser les sauts de ligne et joindre les lignes qui commencent par un espace
  const normalizedContent = icsContent.replace(/\r\n /g, '').replace(/\n /g, '')
  const lines = normalizedContent.split(/\r?\n/)
  let currentEvent: CalendarEvent | null = null
  const now = new Date()

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    if (line === 'BEGIN:VEVENT') {
      currentEvent = {}
    } else if (line === 'END:VEVENT') {
      if (currentEvent) {
        // Vérifier si l'événement a les champs requis
        if (currentEvent.titre && currentEvent.date) {
          // Si pas d&apos;heure spécifiée, c&apos;est un événement sur toute la journée
          if (!currentEvent.heure) {
            currentEvent.heure = '00:00'
          }
          const eventDate = new Date(currentEvent.date + 'T' + currentEvent.heure)
          if (eventDate >= now) {
            events.push(currentEvent)
          }
        }
        currentEvent = null
      }
    } else if (currentEvent) {
      // Gérer les lignes avec paramètres (ex: SUMMARY;LANGUAGE=fr:)
      const [keyWithParams, ...valueParts] = line.split(':')
      const value = valueParts.join(':')
      const [key] = keyWithParams.split(';')

      switch (key) {
        case 'SUMMARY':
          currentEvent.titre = value
          break
        case 'DESCRIPTION':
          currentEvent.description = value
          break
        case 'DTSTART':
          // Gérer les dates avec ou sans heure
          if (value.includes('T')) {
            // Format avec heure
            const startDate = new Date(
              value.replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z)?/, '$1-$2-$3T$4:$5:$6'),
            )
            currentEvent.date = startDate.toISOString().split('T')[0]
            currentEvent.heure = startDate.toTimeString().slice(0, 5)
          } else {
            // Format date seule (événement sur toute la journée)
            const startDate = new Date(value.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'))
            currentEvent.date = startDate.toISOString().split('T')[0]
            currentEvent.heure = '00:00'
          }
          break
        case 'DTEND':
          if (value.includes('T')) {
            const endDate = new Date(
              value.replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z)?/, '$1-$2-$3T$4:$5:$6'),
            )
            currentEvent.heureFin = endDate.toTimeString().slice(0, 5)
          } else {
            const endDate = new Date(value.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'))
            endDate.setDate(endDate.getDate() - 1) // Pour les événements sur toute la journée, DTEND est le jour suivant
            currentEvent.heureFin = '23:59'
          }
          break
        case 'UID':
          currentEvent.icalId = value
          break
      }
    }
  }

  return events
}
