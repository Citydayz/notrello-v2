'use client'

import { useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { TagIcon, PlusIcon } from '@heroicons/react/24/outline'

interface Category {
  id: string
  nom: string
  couleur: string
}

interface CalendarImportModalProps {
  isOpen: boolean
  onClose: () => void
  onImport: (categoryId: string) => void
  categories: Category[]
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>
}

export default function CalendarImportModal({
  isOpen,
  onClose,
  onImport,
  categories,
  setCategories,
}: CalendarImportModalProps) {
  const [selectedCategory, setSelectedCategory] = useState('')
  const [showNewCat, setShowNewCat] = useState(false)
  const [newCatNom, setNewCatNom] = useState('')
  const [newCatCouleur, setNewCatCouleur] = useState('blue')
  const [catLoading, setCatLoading] = useState(false)
  const [catError, setCatError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedCategory) {
      onImport(selectedCategory)
    }
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
            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
              <Dialog.Title className="text-2xl font-bold text-gray-900 mb-6">
                Importer un calendrier
              </Dialog.Title>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                    Catégorie pour les événements importés
                  </label>
                  <div className="relative">
                    <select
                      id="type"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="block w-full rounded-lg border-gray-300 pl-10 pr-4 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 appearance-none"
                      required
                    >
                      <option value="">Sélectionner une catégorie</option>
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
                  <div className="mt-1">
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
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-blue-700 disabled:opacity-60"
                          disabled={catLoading || !newCatNom}
                          onClick={async () => {
                            setCatLoading(true)
                            setCatError(null)
                            try {
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
                                setSelectedCategory(categorie.id || categorie._id)
                                setShowNewCat(false)
                                setNewCatNom('')
                                setNewCatCouleur('blue')
                              } else {
                                const data = await res.json()
                                setCatError(data.error || 'Erreur lors de la création')
                              }
                            } catch (_error) {
                              setCatError('Erreur lors de la création de la catégorie')
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
                    disabled={!selectedCategory}
                    className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-60"
                  >
                    Importer
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
