import { CollectionConfig } from 'payload'

const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    useAPIKey: false,
    disableLocalStrategy: false,
    usernameField: 'pseudo',
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
