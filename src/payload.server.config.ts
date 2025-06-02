import sharp from 'sharp'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import Users from './collections/Users'
import { Media } from './collections/Media'
import Cartes from './collections/Cartes'
import Notes from './collections/Notes'
import CustomCat from './collections/CustomCat'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const serverConfig = {
  sharp,
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  plugins: [payloadCloudPlugin()],
}
