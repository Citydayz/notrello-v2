import { CollectionConfig } from 'payload'

interface _CustomCategory {
  id: string
  nom: string
  couleur: string
  user: string
}

const Cartes: CollectionConfig = {
  slug: 'cartes',
  admin: {
    useAsTitle: 'titre',
  },
  access: {
    read: ({ req }) => !!req.user,
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  fields: [
    {
      name: 'titre',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'type',
      type: 'relationship',
      relationTo: 'custom-cat',
      required: false,
    },
    {
      name: 'heure',
      type: 'text',
      required: true,
    },
    {
      name: 'date',
      type: 'date',
      required: true,
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'heureFin',
      type: 'text',
      required: false,
    },
  ],
}

export default Cartes
