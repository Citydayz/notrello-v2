import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

interface CalendarEvent {
  titre: string
  description: string
  date: string
  heure: string
  heureFin: string | null
  icalId: string
  user: string
  type?: string
}

interface EventData {
  titre: string
  description: string
  date: string
  heure: string
  heureFin: string | null
  icalId: string
  user: string
  type?: string
}

async function getUserIdFromRequest() {
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value
  if (!token) return null
  const decoded = jwt.decode(token)
  if (!decoded || typeof decoded !== 'object' || !decoded.id) return null
  return decoded.id
}

// Fonction pour ajuster l'heure au fuseau horaire de Paris
function adjustToParisTime(time: string): string {
  if (!time) return time
  const [hours, minutes] = time.split(':')
  let adjustedHours = parseInt(hours) + 2
  if (adjustedHours >= 24) {
    adjustedHours -= 24
  }
  return `${adjustedHours.toString().padStart(2, '0')}:${minutes}`
}

export async function POST(request: Request) {
  try {
    const payload = await getPayload({ config })

    const userId = await getUserIdFromRequest()
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const user = await payload.findByID({
      collection: 'users',
      id: userId,
    })

    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { events } = await request.json()

    if (!Array.isArray(events)) {
      return NextResponse.json({ error: 'Format invalide' }, { status: 400 })
    }

    const importedEvents = []
    const errors = []

    for (const event of events as CalendarEvent[]) {
      try {
        // Vérifier les champs requis
        if (!event.titre || !event.date) {
          errors.push(`Événement ignoré : titre ou date manquant`)
          continue
        }

        // Créer l'objet de données pour l'événement
        const eventData: EventData = {
          titre: event.titre,
          description: event.description || '',
          date: event.date,
          heure: adjustToParisTime(event.heure || '00:00'),
          heureFin: event.heureFin ? adjustToParisTime(event.heureFin) : null,
          icalId: event.icalId,
          user: userId,
        }

        // Ajouter le type si spécifié
        if (event.type) {
          eventData.type = event.type
        }

        // Créer l'événement
        const createdEvent = await payload.create({
          collection: 'cartes',
          data: eventData,
        })

        importedEvents.push(createdEvent)
      } catch (error) {
        console.error("Erreur lors de l'importation d'un événement:", error)
        errors.push(`Erreur lors de l'importation de l'événement: ${event.titre}`)
      }
    }

    return NextResponse.json({
      imported: importedEvents.length,
      errors: errors,
    })
  } catch (error) {
    console.error("Erreur lors de l'importation:", error)
    return NextResponse.json({ error: "Erreur lors de l'importation" }, { status: 500 })
  }
}
