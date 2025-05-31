import { CollectionConfig } from 'payload'

const CustomCat: CollectionConfig = {
  slug: 'custom-cat',
  admin: {
    useAsTitle: 'nom',
  },
  access: {
    read: ({ req }) => !!req.user,
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  fields: [
    {
      name: 'nom',
      type: 'text',
      required: true,
    },
    {
      name: 'couleur',
      type: 'select',
      required: false,
      options: [
        { label: 'Bleu', value: 'blue' },
        { label: 'Vert', value: 'green' },
        { label: 'Violet', value: 'purple' },
        { label: 'Orange', value: 'orange' },
        { label: 'Rouge', value: 'red' },
        { label: 'Rose', value: 'pink' },
        { label: 'Jaune', value: 'yellow' },
        { label: 'Gris', value: 'gray' },
      ],
      defaultValue: 'blue',
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
  ],
}

export default CustomCat
