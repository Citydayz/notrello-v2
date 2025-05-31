'use client'

import { useState, useEffect } from 'react'
import { Carte } from '@/payload-types'
import CalendarView from '../../components/calendar/CalendarView'
import CreateCardModal from '../../components/CreateCardModal'

export default function CalendarPage() {
  const [cartes, setCartes] = useState<Carte[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  useEffect(() => {
    const loadCartes = async () => {
      try {
        const res = await fetch('/api/cartes', { credentials: 'include' })
        const data = await res.json()
        setCartes(data.cartes)
      } catch (error) {
        console.error('Erreur lors du chargement des cartes:', error)
      }
    }

    loadCartes()
  }, [])

  const handleCarteCreate = (date: Date) => {
    setSelectedDate(date)
    setIsCreateModalOpen(true)
  }

  const handleCarteUpdate = async (carte: Carte) => {
    try {
      const res = await fetch(`/api/cartes/${carte.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(carte),
      })
      if (res.ok) {
        const { carte: updatedCarte } = await res.json()
        setCartes((old) => old.map((c) => (c.id === updatedCarte.id ? updatedCarte : c)))
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error)
    }
  }

  const handleCarteDelete = async (carteId: string) => {
    try {
      const res = await fetch(`/api/cartes/${carteId}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (res.ok) {
        setCartes((old) => old.filter((c) => c.id !== carteId))
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-blue-700">Calendrier</h1>
        <p className="text-gray-600">Visualisez et gérez vos tâches dans un calendrier</p>
      </div>

      <CalendarView
        cartes={cartes}
        onCarteCreate={handleCarteCreate}
        onCarteUpdate={handleCarteUpdate}
        onCarteDelete={handleCarteDelete}
      />

      {isCreateModalOpen && (
        <CreateCardModal
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false)
            setSelectedDate(null)
          }}
          onSubmit={async (data) => {
            try {
              const res = await fetch('/api/cartes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                  ...data,
                  date: selectedDate ? selectedDate.toISOString().split('T')[0] : data.date,
                }),
              })
              if (res.ok) {
                const { carte } = await res.json()
                setCartes((old) => [...old, carte])
                setIsCreateModalOpen(false)
                setSelectedDate(null)
              }
            } catch (error) {
              console.error('Erreur lors de la création:', error)
            }
          }}
        />
      )}
    </div>
  )
}
