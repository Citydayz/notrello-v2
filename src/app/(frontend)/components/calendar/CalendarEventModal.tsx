'use client'

import { useState } from 'react'
import { Carte } from '@/payload-types'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface CalendarEventModalProps {
  isOpen: boolean
  onClose: () => void
  carte: Carte
  onUpdate: (carte: Carte) => void
  onDelete: (carteId: string) => void
}

export default function CalendarEventModal({
  isOpen,
  onClose,
  carte,
  onUpdate,
  onDelete,
}: CalendarEventModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedCarte, setEditedCarte] = useState<Carte>(carte)

  if (!isOpen) return null

  const handleUpdate = async () => {
    try {
      await onUpdate(editedCarte)
      setIsEditing(false)
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      try {
        await onDelete(carte.id)
        onClose()
      } catch (error) {
        console.error('Erreur lors de la suppression:', error)
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            {isEditing ? "Modifier l'événement" : "Détails de l'événement"}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {isEditing ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                <input
                  type="text"
                  value={editedCarte.titre}
                  onChange={(e) => setEditedCarte((prev) => ({ ...prev, titre: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={editedCarte.description || ''}
                  onChange={(e) =>
                    setEditedCarte((prev) => ({ ...prev, description: e.target.value }))
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <h4 className="text-lg font-medium text-gray-800">{carte.titre}</h4>
                {carte.description && <p className="mt-2 text-gray-600">{carte.description}</p>}
              </div>
              <div className="text-sm text-gray-500">
                <p>Date : {format(new Date(carte.date), 'EEEE d MMMM yyyy', { locale: fr })}</p>
                <p>Heure : {carte.heure}</p>
              </div>
            </>
          )}

          <div className="flex justify-end gap-2 mt-6">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Enregistrer
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  Modifier
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Supprimer
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
