import { CollectionConfig } from 'payload'

const Notes: CollectionConfig = {
  slug: 'notes',
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
      name: 'contenu',
      type: 'textarea',
      required: true,
    },
    {
      name: "Carte liée",
      type: 'relationship',
      relationTo: 'cartes',
      required: false,
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
  ],
}

export default Notes
