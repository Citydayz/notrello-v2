import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

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

export async function POST(req: Request) {
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

    let events
    try {
      const body = await req.json()
      events = body.events
    } catch (error) {
      console.error('Erreur lors de la lecture du corps de la requête:', error)
      return NextResponse.json({ error: 'Format de données invalide' }, { status: 400 })
    }

    if (!Array.isArray(events) || events.length === 0) {
      return NextResponse.json({ error: 'Aucun événement à importer' }, { status: 400 })
    }

    const importedEvents = []
    const errors = []

    for (const event of events) {
      try {
        // Vérifier les champs requis
        if (!event.titre || !event.date || !event.heure) {
          errors.push(`Événement invalide: champs requis manquants (titre, date ou heure)`)
          continue
        }

        // Vérifier si l'événement existe déjà
        const existingEvent = await payload.find({
          collection: 'cartes',
          where: {
            icalId: { equals: event.icalId },
          },
        })

        if (existingEvent.docs.length > 0) {
          continue
        }

        // Ajuster les heures au fuseau horaire de Paris
        const adjustedHeure = adjustToParisTime(event.heure)
        const adjustedHeureFin = event.heureFin ? adjustToParisTime(event.heureFin) : null

        // Préparer les données de l'événement
        const eventData = {
          titre: event.titre,
          description: event.description || '',
          date: event.date,
          heure: adjustedHeure,
          heureFin: adjustedHeureFin,
          icalId: event.icalId,
          user: user.id,
        }

        // Ajouter le type si spécifié
        if (event.type) {
          eventData.type = event.type
        }

        // Créer l'événement
        const newEvent = await payload.create({
          collection: 'cartes',
          data: eventData,
        })

        importedEvents.push(newEvent)
      } catch (error) {
        console.error("Erreur lors de la création de l'événement:", error)
        errors.push(
          `Erreur lors de la création de l'événement: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
        )
      }
    }

    return NextResponse.json({
      success: true,
      imported: importedEvents.length,
      events: importedEvents,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (error) {
    console.error("Erreur lors de l'importation:", error)
    return NextResponse.json(
      {
        error: "Erreur lors de l'importation",
        details: error instanceof Error ? error.message : 'Erreur inconnue',
      },
      { status: 500 },
    )
  }
}
