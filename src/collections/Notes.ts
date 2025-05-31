import { CollectionConfig } from 'payload'

const Notes: CollectionConfig = {
  slug: 'notes',
  admin: {
    useAsTitle: 'titre',
  },
  access: {
    read: ({ req, data }) => req.user?.id === data.user,
    create: ({ req }) => !!req.user,
    update: ({ req, data }) => req.user?.id === data.user,
    delete: ({ req, data }) => req.user?.id === data.user,
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
