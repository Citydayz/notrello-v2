'use client'

import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

import Users from './collections/Users'
import { Media } from './collections/Media'
import Cartes from './collections/Cartes'
import Notes from './collections/Notes'
import CustomCat from './collections/CustomCat'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const clientConfig = {
  collections: [Users, Media, Cartes, Notes, CustomCat],
  editor: lexicalEditor(),
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
}
