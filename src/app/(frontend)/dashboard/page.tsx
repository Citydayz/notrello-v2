'use client'

import { useState, useEffect } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  useDroppable,
} from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import CreateCardModal from '../components/CreateCardModal'

const HEURES = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
]

interface Category {
  id: string
  nom: string
  couleur: string
}

interface Carte {
  id: string
  titre: string
  description?: string
  type: Category
  heure: string
  heureFin?: string
  date: string
}

interface TypeColors {
  blue: string
  green: string
  purple: string
  orange: string
  red: string
  pink: string
  yellow: string
  gray: string
  none: string
}

function SortableCarte({ carte, onClick }: { carte: Carte; onClick?: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: carte.id,
  })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  }

  const typeColors = {
    blue: 'bg-blue-50 text-blue-800 border-blue-200',
    green: 'bg-green-50 text-green-800 border-green-200',
    purple: 'bg-purple-50 text-purple-800 border-purple-200',
    orange: 'bg-orange-50 text-orange-800 border-orange-200',
    red: 'bg-red-50 text-red-800 border-red-200',
    pink: 'bg-pink-50 text-pink-800 border-pink-200',
    yellow: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    gray: 'bg-gray-50 text-gray-800 border-gray-200',
    none: 'bg-gray-100 text-gray-400 border-gray-200',
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`px-4 py-3 rounded-lg shadow border font-medium select-none flex flex-col gap-1 relative group ${
        carte.type?.couleur
          ? typeColors[carte.type.couleur as keyof typeof typeColors] || typeColors.blue
          : typeColors.none
      }`}
      onClick={onClick}
      tabIndex={0}
      role="button"
    >
      {/* Poignée de drag */}
      <div
        {...attributes}
        {...listeners}
        className="absolute left-2 top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing text-gray-400 hover:text-blue-500"
        style={{ fontSize: 18 }}
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
        aria-label="Déplacer la carte"
      >
        ≡
      </div>
      <div className="flex items-center justify-between pl-6">
        <span className="font-semibold">
          {carte.titre}
          {!carte.type && (
            <span className="ml-2 text-xs italic text-gray-400">(Aucune catégorie)</span>
          )}
        </span>
        <button className="text-xs underline opacity-75 hover:opacity-100" disabled>
          Notes
        </button>
      </div>
      {/* Affichage de l'heure et de l'heure de fin */}
      <div className="pl-6 text-xs text-gray-500 font-mono">
        {carte.heure}
        {carte.heureFin && carte.heureFin !== carte.heure ? ` - ${carte.heureFin}` : ''}
      </div>
      {carte.description && (
        <p className="text-sm opacity-75 line-clamp-2 pl-6">{carte.description}</p>
      )}
    </div>
  )
}

function DroppableHeure({ heure, children }: { heure: string; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id: heure })
  return (
    <div
      ref={setNodeRef}
      className={`flex-1 flex gap-2 flex-wrap min-h-[40px] transition-all duration-100 ${
        isOver ? 'bg-blue-100' : ''
      }`}
      style={{ borderRadius: 8 }}
    >
      {children}
    </div>
  )
}

export default function DashboardHome() {
  const [cartes, setCartes] = useState<Carte[]>([])
  const [filtre, setFiltre] = useState<string | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [_user, _setUser] = useState<{ pseudo?: string } | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCarte, setSelectedCarte] = useState<Carte | null>(null)
  const [dateActuelle, _setDateActuelle] = useState(() => {
    const now = new Date()
    return now.toISOString().split('T')[0]
  })

  const sensors = useSensors(useSensor(PointerSensor))

  useEffect(() => {
    const loadData = async () => {
      try {
        // Charger l'utilisateur
        const userRes = await fetch('/api/me', { credentials: 'include' })
        const userData = await userRes.json()
        _setUser(userData.user)

        // Charger les catégories
        const categoriesRes = await fetch('/api/custom-cat', { credentials: 'include' })
        const categoriesData = await categoriesRes.json()
        setCategories(
          categoriesData.categories.map(
            (cat: { id?: string; _id?: string; nom: string; couleur: string }) => ({
              id: cat.id || cat._id,
              nom: cat.nom,
              couleur: cat.couleur,
            }),
          ),
        )

        // Charger les cartes avec la date actuelle
        const cartesRes = await fetch(`/api/cartes?date=${dateActuelle}&view=timeline`, {
          credentials: 'include',
        })
        const cartesData = await cartesRes.json()
        setCartes(cartesData.cartes)
      } catch (_e) {
        console.error('Erreur lors du chargement des données:', _e)
      }
    }

    loadData()
  }, [dateActuelle]) // Recharger les données quand la date change

  // On regroupe les cartes par heure
  const cartesParHeure: Record<string, Carte[]> = {}
  HEURES.forEach((h) => (cartesParHeure[h] = []))
  ;(filtre ? cartes.filter((c) => c.type?.id === filtre) : cartes).forEach((c) => {
    if (cartesParHeure[c.heure]) cartesParHeure[c.heure].push(c)
  })

  async function handleCreateCard(data: {
    titre: string
    description: string
    type: string
    heure: string
    heureFin?: string
    date: string
  }) {
    try {
      const res = await fetch('/api/cartes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      })
      if (res.ok) {
        const { carte } = await res.json()
        setCartes((old) => [...old, carte])
        setIsCreateModalOpen(false)
      } else {
        const error = await res.json()
        alert(`Erreur lors de la création de la carte: ${error.error}`)
      }
    } catch (error) {
      console.error('Erreur lors de la création de la carte:', error)
      alert('Erreur lors de la création de la carte')
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over) return
    // Si on drop sur une heure vide, over.id est l'heure
    const carteId = active.id
    const overId = over.id
    if (typeof overId === 'string' && HEURES.includes(overId)) {
      setCartes((old) => {
        const moved = old.find((c) => c.id === carteId)
        if (!moved) return old
        if (moved.heure === overId) return old
        // Calcul du décalage si heureFin existe
        let newHeureFin = moved.heureFin
        if (moved.heureFin && moved.heureFin !== moved.heure) {
          const [oldHeure, oldMinute] = moved.heure.split(':').map(Number)
          const [oldFinHeure, oldFinMinute] = moved.heureFin.split(':').map(Number)
          const [newHeure, newMinute] = overId.split(':').map(Number)
          const diffHeures = newHeure - oldHeure
          const diffMinutes = newMinute - oldMinute
          const newFinHeure = oldFinHeure + diffHeures
          const newFinMinute = oldFinMinute + diffMinutes
          newHeureFin = `${newFinHeure.toString().padStart(2, '0')}:${newFinMinute.toString().padStart(2, '0')}`
        }
        return old.map((c) =>
          c.id === carteId
            ? {
                ...c,
                heure: overId,
                heureFin: newHeureFin,
              }
            : c,
        )
      })
    } else if (typeof overId === 'string' && overId.startsWith('carte-')) {
      // Si on drop sur une autre carte
      const [fromHeure, fromIdx] = active.id.toString().split('-')
      const [toHeure, toIdx] = overId.split('-')
      if (fromHeure === toHeure) {
        // Même heure, on réorganise
        setCartes((old) => {
          const cartesHeure = old.filter((c) => c.heure === fromHeure)
          const moved = cartesHeure[Number(fromIdx)]
          const newCartesHeure = [...cartesHeure]
          newCartesHeure.splice(Number(fromIdx), 1)
          newCartesHeure.splice(Number(toIdx), 0, moved)
          return old.map((c) =>
            c.heure === fromHeure ? newCartesHeure[old.findIndex((c2) => c2.id === c.id)] : c,
          )
        })
      } else {
        // Heure différente, on déplace
        setCartes((old) => {
          const moved = old.find((c) => c.id === active.id)
          if (!moved) return old
          return old.map((c) =>
            c.id === active.id
              ? {
                  ...c,
                  heure: toHeure,
                }
              : c,
          )
        })
      }
    }
  }

  const typeColors = {
    blue: 'bg-blue-100 text-blue-700 border-blue-200',
    green: 'bg-green-100 text-green-700 border-green-200',
    purple: 'bg-purple-100 text-purple-700 border-purple-200',
    orange: 'bg-orange-100 text-orange-700 border-orange-200',
    red: 'bg-red-100 text-red-700 border-red-200',
    pink: 'bg-pink-100 text-pink-700 border-pink-200',
    yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    gray: 'bg-gray-100 text-gray-700 border-gray-200',
    none: 'bg-gray-100 text-gray-400 border-gray-200',
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-10">
      {/* Bouton d'ajout de carte */}
      <div className="mb-6">
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="w-full bg-blue-600 text-white rounded-lg px-4 py-3 font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
        >
          <span className="text-xl">+</span>
          <span>Nouvelle carte</span>
        </button>
      </div>

      {/* Filtres par type de carte */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFiltre(null)}
          className={`px-3 py-1 rounded-full border ${
            filtre === null ? 'bg-blue-600 text-white' : 'bg-white text-blue-700'
          }`}
        >
          Toutes
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFiltre(cat.id)}
            className={`px-3 py-1 rounded-full border transition-colors duration-150 ${
              filtre === cat.id
                ? `${typeColors[cat.couleur as keyof typeof typeColors] || typeColors.blue} text-white border-2 border-blue-600`
                : `${typeColors[cat.couleur as keyof typeof typeColors] || typeColors.blue} border`
            }`}
          >
            {cat.nom}
          </button>
        ))}
      </div>

      {/* Timeline du jour avec drag & drop */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="bg-white rounded-xl shadow p-6 mb-8 border border-blue-100">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">Ma journée</h2>
          <div className="flex flex-col gap-4">
            {HEURES.map((heure) => (
              <div key={heure} className="flex items-center gap-4">
                <div className="w-16 text-right text-gray-400 font-mono">{heure}</div>
                <DroppableHeure heure={heure}>
                  <SortableContext
                    items={cartesParHeure[heure].map((c) => c.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {cartesParHeure[heure].map((carte) => (
                      <SortableCarte
                        key={carte.id}
                        carte={carte}
                        onClick={() => setSelectedCarte(carte)}
                      />
                    ))}
                  </SortableContext>
                </DroppableHeure>
              </div>
            ))}
          </div>
        </div>
      </DndContext>

      {/* Encart bienveillance */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center text-blue-800 shadow">
        <p className="text-lg font-semibold mb-2">Pas de pression.</p>
        <p className="text-sm">
          Notrello n&apos;est pas là pour te rendre &quot;ultra-productif&quot;.
          <br />
          C&apos;est un espace pour t&apos;aider à retrouver le fil, à ton rythme, sans jugement.
        </p>
      </div>

      <CreateCardModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateCard}
        categories={categories}
        setCategories={setCategories}
      />

      {/* Modale d'affichage détaillé de la carte */}
      {selectedCarte && categories.length > 0 && (
        <ModalCarteDetail
          onClose={() => setSelectedCarte(null)}
          carte={selectedCarte}
          typeColors={typeColors}
          setCartes={setCartes}
          setSelectedCarte={setSelectedCarte}
          categories={categories}
          setCategories={setCategories}
        />
      )}
    </div>
  )
}

function ModalCarteDetail({
  carte,
  onClose,
  typeColors,
  setCartes,
  setSelectedCarte,
  categories,
  setCategories,
}: {
  carte: Carte
  onClose: () => void
  typeColors: TypeColors
  setCartes: React.Dispatch<React.SetStateAction<Carte[]>>
  setSelectedCarte: React.Dispatch<React.SetStateAction<Carte | null>>
  categories: Category[]
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>
}) {
  const [isEdit, setIsEdit] = useState(false)
  const [_isDeleting, _setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [editKey, setEditKey] = useState(0) // Pour forcer le remount du modal édition
  const [localCarte, setLocalCarte] = useState<Carte>(carte)

  // Synchroniser localCarte avec la prop carte uniquement si carte change (ex: ouverture d'une autre carte)
  useEffect(() => {
    setLocalCarte((prev) => {
      // Ne synchronise que si on change de carte (id différent)
      if (prev.id !== carte.id) return carte
      return prev
    })
  }, [carte])

  // Fermer avec Échap
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && !isEdit && !showConfirm) onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose, isEdit, showConfirm])

  // Fermer au clic dehors
  function handleBackdrop(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget && !isEdit && !showConfirm) onClose()
  }

  // Suppression
  async function handleDelete() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/cartes/${carte.id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (res.ok) {
        setCartes((old) => old.filter((c) => c.id !== carte.id))
        onClose()
      } else {
        const data = await res.json()
        setError(data.error || 'Erreur lors de la suppression')
      }
    } catch (_e) {
      setError('Erreur lors de la suppression')
    } finally {
      setLoading(false)
      setShowConfirm(false)
    }
  }

  // Édition
  function handleEditSubmit(data: {
    titre: string
    description: string
    type: string
    heure: string
    heureFin?: string
    date: string
  }) {
    setLoading(true)
    setError(null)
    fetch(`/api/cartes/${carte.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    })
      .then(async (res) => {
        if (res.ok) {
          const { carte: updated } = await res.json()
          setCartes((old) => old.map((c) => (c.id === updated.id ? updated : c)))
          setLocalCarte(updated)
          setSelectedCarte(updated)
          setIsEdit(false)
          setEditKey((k) => k + 1)
        } else {
          const data = await res.json()
          setError(data.error || 'Erreur lors de la modification')
        }
      })
      .catch(() => setError('Erreur lors de la modification'))
      .finally(() => setLoading(false))
  }

  if (isEdit) {
    const defaultDate = localCarte.date ? new Date(localCarte.date) : undefined
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
        onMouseDown={handleBackdrop}
      >
        <div
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full relative"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl"
            onClick={() => setIsEdit(false)}
            aria-label="Fermer"
            disabled={loading}
          >
            ×
          </button>
          <div className="mb-4 text-lg font-bold">Modifier la carte</div>
          <CreateCardModal
            isOpen={true}
            onClose={() => setIsEdit(false)}
            onSubmit={handleEditSubmit}
            defaultValues={{
              titre: localCarte.titre,
              description: localCarte.description,
              type: localCarte.type?.id || '',
              heure: localCarte.heure,
              heureFin: localCarte.heureFin,
              date: defaultDate,
            }}
            isEdit={true}
            key={editKey}
            categories={categories}
            setCategories={setCategories}
          />
          {error && <div className="text-red-500 mt-2 text-sm">{error}</div>}
        </div>
      </div>
    )
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onMouseDown={handleBackdrop}
    >
      <div
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full relative"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl"
          onClick={onClose}
          aria-label="Fermer"
        >
          ×
        </button>
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            {localCarte.type && (
              <span
                className={`inline-block w-3 h-3 rounded-full ${typeColors[localCarte.type.couleur as keyof typeof typeColors] || typeColors.blue}`}
              ></span>
            )}
            <span className="text-xl font-bold">{localCarte.titre}</span>
          </div>
          {localCarte.type && (
            <span
              className="text-xs px-2 py-1 rounded-full border font-medium mr-2"
              style={{ background: 'rgba(0,0,0,0.03)' }}
            >
              {localCarte.type.nom}
            </span>
          )}
        </div>
        <div className="mb-2">
          <span className="block text-gray-500 text-xs mb-1">Description</span>
          <p className="text-gray-800 whitespace-pre-line">
            {localCarte.description || (
              <span className="italic text-gray-400">Aucune description</span>
            )}
          </p>
        </div>
        <div className="flex gap-4 mt-4 mb-6">
          <div>
            <span className="block text-gray-500 text-xs">Date</span>
            <span className="font-mono">{localCarte.date}</span>
          </div>
          <div>
            <span className="block text-gray-500 text-xs">Heure</span>
            <span className="font-mono">{localCarte.heure}</span>
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <button
            className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50"
            onClick={() => setIsEdit(true)}
          >
            Modifier
          </button>
          <button
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 shadow-sm hover:bg-red-100"
            onClick={() => setShowConfirm(true)}
          >
            Supprimer
          </button>
        </div>
        {showConfirm && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-xl p-6 max-w-xs w-full relative">
              <div className="text-lg font-bold mb-2">Confirmer la suppression</div>
              <div className="mb-4 text-sm text-gray-600">
                Voulez-vous vraiment supprimer cette carte ?
              </div>
              {error && <div className="text-red-500 mb-2 text-sm">{error}</div>}
              <div className="flex gap-2 justify-end">
                <button
                  className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50"
                  onClick={() => setShowConfirm(false)}
                  disabled={loading}
                >
                  Annuler
                </button>
                <button
                  className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  {loading ? 'Suppression...' : 'Supprimer'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
