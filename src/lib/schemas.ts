import { z } from 'zod'

export const loginSchema = z.object({
  identifier: z.string().min(1),
  password: z.string().min(1),
})

export const registerSchema = z.object({
  pseudo: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(1),
})

export const carteCreateSchema = z.object({
  titre: z.string().min(1),
  type: z.string().optional(),
  description: z.string().optional(),
  heure: z.string().min(1),
  heureFin: z.string().optional(),
})

export const carteUpdateSchema = carteCreateSchema.partial().extend({
  date: z.string().optional(),
})

export const customCatSchema = z.object({
  nom: z.string().min(1),
  couleur: z.string().optional(),
})
