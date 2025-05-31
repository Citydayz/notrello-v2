'use client'

import { useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import {
  CalendarIcon,
  ClockIcon,
  TagIcon,
  DocumentTextIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'
import DatePicker from './ui/DatePicker'
import { format } from 'date-fns'

interface Category {
  id: string
  nom: string
  couleur: string
}

interface CreateCardModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: {
    titre: string
    description: string
    type: string
    heure: string
    heureFin?: string
    date: string
  }) => void
  defaultValues?: {
    titre?: string
    description?: string
    type?: string
    heure?: string
    heureFin?: string
    date?: Date
  }
  isEdit?: boolean
  categories: Category[]
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>
}

export default function CreateCardModal({
  isOpen,
  onClose,
  onSubmit,
  defaultValues,
  isEdit,
  categories,
  setCategories,
}: CreateCardModalProps) {
  const [titre, setTitre] = useState(defaultValues?.titre || '')
  const [description, setDescription] = useState(defaultValues?.description || '')
  const [type, setType] = useState(defaultValues?.type || '')
  const [heureHeure, setHeureHeure] = useState(
    defaultValues?.heure ? defaultValues.heure.split(':')[0] : '',
  )
  const [heureMinute, setHeureMinute] = useState(
    defaultValues?.heure ? defaultValues.heure.split(':')[1] : '',
  )
  const [heureFinHeure, setHeureFinHeure] = useState(
    defaultValues?.heureFin ? defaultValues.heureFin.split(':')[0] : '',
  )
  const [heureFinMinute, setHeureFinMinute] = useState(
    defaultValues?.heureFin ? defaultValues.heureFin.split(':')[1] : '',
  )
  const [date, setDate] = useState<Date | undefined>(defaultValues?.date)
  const [showNewCat, setShowNewCat] = useState(false)
  const [newCatNom, setNewCatNom] = useState('')
  const [newCatCouleur, setNewCatCouleur] = useState('blue')
  const [catLoading, setCatLoading] = useState(false)
  const [catError, setCatError] = useState<string | null>(null)

  useEffect(() => {
    setTitre(defaultValues?.titre || '')
    setDescription(defaultValues?.description || '')
    setType(defaultValues?.type || '')
    setHeureHeure(defaultValues?.heure ? defaultValues.heure.split(':')[0] : '')
    setHeureMinute(defaultValues?.heure ? defaultValues.heure.split(':')[1] : '')
    setHeureFinHeure(defaultValues?.heureFin ? defaultValues.heureFin.split(':')[0] : '')
    setHeureFinMinute(defaultValues?.heureFin ? defaultValues.heureFin.split(':')[1] : '')
    setDate(defaultValues?.date)
  }, [defaultValues])

  // Vider les champs après fermeture de la modale en mode création
  useEffect(() => {
    if (!isOpen && !isEdit) {
      setTitre('')
      setDescription('')
      setType(categories[0]?.id || '')
      setHeureHeure('')
      setHeureMinute('')
      setHeureFinHeure('')
      setHeureFinMinute('')
      setDate(undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const heureValue = heureHeure && heureMinute ? `${heureHeure}:${heureMinute}` : ''
    const heureFinValue =
      heureFinHeure && heureFinMinute ? `${heureFinHeure}:${heureFinMinute}` : ''
    onSubmit({
      titre,
      description,
      type,
      heure: heureValue,
      heureFin: heureFinValue,
      date: date ? format(date, 'yyyy-MM-dd') : '',
    })
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="mx-auto w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
              <Dialog.Title className="text-2xl font-bold text-gray-900 mb-6">
                {isEdit ? 'Modifier la carte' : 'Nouvelle carte'}
              </Dialog.Title>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="titre" className="block text-sm font-medium text-gray-700">
                    Titre
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="titre"
                      value={titre}
                      onChange={(e) => setTitre(e.target.value)}
                      className="block w-full rounded-lg border-gray-300 pl-10 pr-4 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                      placeholder="Titre de votre carte"
                      required
                    />
                    <DocumentTextIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="block w-full rounded-lg border-gray-300 px-4 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    rows={3}
                    placeholder="Description de votre carte (optionnelle)"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                    Catégorie
                  </label>
                  <div className="relative">
                    <select
                      id="type"
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="block w-full rounded-lg border-gray-300 pl-10 pr-4 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 appearance-none"
                      required
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.nom}
                        </option>
                      ))}
                    </select>
                    <TagIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      type="button"
                      className="flex items-center gap-1 text-blue-600 hover:underline text-xs font-medium"
                      onClick={() => setShowNewCat((v) => !v)}
                    >
                      <PlusIcon className="h-4 w-4" /> Nouvelle catégorie
                    </button>
                  </div>
                  {showNewCat && (
                    <div className="flex flex-col gap-2 mt-2 bg-blue-50 p-3 rounded-lg border border-blue-100">
                      <input
                        type="text"
                        placeholder="Nom de la catégorie"
                        value={newCatNom}
                        onChange={(e) => setNewCatNom(e.target.value)}
                        className="block w-full rounded border-gray-300 px-2 py-1 text-sm"
                        required
                      />
                      <select
                        value={newCatCouleur}
                        onChange={(e) => setNewCatCouleur(e.target.value)}
                        className="block w-full rounded border-gray-300 px-2 py-1 text-sm"
                        required
                      >
                        <option value="blue">Bleu</option>
                        <option value="green">Vert</option>
                        <option value="purple">Violet</option>
                        <option value="orange">Orange</option>
                        <option value="red">Rouge</option>
                        <option value="pink">Rose</option>
                        <option value="yellow">Jaune</option>
                        <option value="gray">Gris</option>
                      </select>
                      <div className="flex gap-2 mt-1">
                        <button
                          type="button"
                          className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-blue-700 disabled:opacity-60"
                          disabled={catLoading || !newCatNom}
                          onClick={async () => {
                            setCatLoading(true)
                            setCatError(null)
                            try {
                              console.log('Envoi création catégorie', {
                                nom: newCatNom,
                                couleur: newCatCouleur,
                              })
                              const res = await fetch('/api/custom-cat', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                credentials: 'include',
                                body: JSON.stringify({ nom: newCatNom, couleur: newCatCouleur }),
                              })
                              if (res.ok) {
                                const { categorie } = await res.json()
                                setCategories((old) => [
                                  ...old,
                                  {
                                    id: categorie.id || categorie._id,
                                    nom: categorie.nom,
                                    couleur: categorie.couleur,
                                  },
                                ])
                                setType(categorie.id || categorie._id)
                                setShowNewCat(false)
                                setNewCatNom('')
                                setNewCatCouleur('blue')
                              } else {
                                const data = await res.json()
                                setCatError(data.error || 'Erreur lors de la création')
                              }
                            } catch (err) {
                              setCatError('Erreur lors de la création')
                            } finally {
                              setCatLoading(false)
                            }
                          }}
                        >
                          {catLoading ? 'Création...' : 'Créer'}
                        </button>
                        <button
                          type="button"
                          className="text-xs text-gray-500 hover:underline"
                          onClick={() => setShowNewCat(false)}
                        >
                          Annuler
                        </button>
                      </div>
                      {catError && <div className="text-xs text-red-500 mt-1">{catError}</div>}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                      Date
                    </label>
                    <DatePicker value={date} onChange={setDate} placeholder="Choisir une date" />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="heure" className="block text-sm font-medium text-gray-700">
                      Heure de début
                    </label>
                    <div className="flex gap-2 items-center">
                      <select
                        id="heureHeure"
                        value={heureHeure}
                        onChange={(e) => setHeureHeure(e.target.value)}
                        className="rounded-lg border-gray-300 py-2.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
                        required
                      >
                        <option value="">--</option>
                        {Array.from({ length: 12 }, (_, i) => {
                          const h = i + 8
                          return (
                            <option key={h} value={h.toString().padStart(2, '0')}>
                              {h.toString().padStart(2, '0')}
                            </option>
                          )
                        })}
                      </select>
                      <span>:</span>
                      <select
                        id="heureMinute"
                        value={heureMinute}
                        onChange={(e) => setHeureMinute(e.target.value)}
                        className="rounded-lg border-gray-300 py-2.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
                        required
                      >
                        <option value="">--</option>
                        {Array.from({ length: 12 }, (_, i) => {
                          const m = i * 5
                          return (
                            <option key={m} value={m.toString().padStart(2, '0')}>
                              {m.toString().padStart(2, '0')}
                            </option>
                          )
                        })}
                      </select>
                      <ClockIcon className="ml-2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="heureFin" className="block text-sm font-medium text-gray-700">
                      Heure de fin
                    </label>
                    <div className="flex gap-2 items-center">
                      <select
                        id="heureFinHeure"
                        value={heureFinHeure}
                        onChange={(e) => setHeureFinHeure(e.target.value)}
                        className="rounded-lg border-gray-300 py-2.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
                      >
                        <option value="">--</option>
                        {Array.from({ length: 12 }, (_, i) => {
                          const h = i + 8
                          return (
                            <option key={h} value={h.toString().padStart(2, '0')}>
                              {h.toString().padStart(2, '0')}
                            </option>
                          )
                        })}
                      </select>
                      <span>:</span>
                      <select
                        id="heureFinMinute"
                        value={heureFinMinute}
                        onChange={(e) => setHeureFinMinute(e.target.value)}
                        className="rounded-lg border-gray-300 py-2.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
                      >
                        <option value="">--</option>
                        {Array.from({ length: 12 }, (_, i) => {
                          const m = i * 5
                          return (
                            <option key={m} value={m.toString().padStart(2, '0')}>
                              {m.toString().padStart(2, '0')}
                            </option>
                          )
                        })}
                      </select>
                      <ClockIcon className="ml-2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                  >
                    {isEdit ? 'Modifier la carte' : 'Créer la carte'}
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}
