import { CollectionConfig } from 'payload'

const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    useAPIKey: false,
    disableLocalStrategy: true,
    verify: false,
  },
  admin: {
    useAsTitle: 'pseudo',
  },
  fields: [
    {
      name: 'pseudo',
      type: 'text',
      required: true,
      unique: true,
    },
  ],
}

export default Users
