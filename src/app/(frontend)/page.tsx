import Footer from './components/layouts/Footer'
import Link from 'next/link'
import Image from 'next/image'
import './styles.css'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 via-white to-blue-100 text-gray-900">
      {/* <Header /> */}
      {/* Hero full screen */}
      <section className="flex flex-col items-center justify-center flex-1 text-center px-4 py-32 min-h-[90vh] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none select-none opacity-30" aria-hidden>
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 800 600"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="400" cy="300" r="280" fill="#3B82F6" fillOpacity="0.08" />
            <circle cx="600" cy="100" r="120" fill="#3B82F6" fillOpacity="0.06" />
            <circle cx="200" cy="500" r="100" fill="#3B82F6" fillOpacity="0.05" />
          </svg>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight text-blue-800 drop-shadow-xl z-10">
          Organise tes journées
          <br className="hidden md:inline" /> comme ton cerveau les pense
        </h1>
        <p className="mb-10 text-lg md:text-2xl text-gray-700 max-w-2xl mx-auto z-10">
          Notrello t&apos;aide à structurer ta journée avec un agenda visuel, des cartes
          interactives et des notes liées.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center z-10">
          <Link
            href="/login"
            className="px-8 py-3 bg-blue-600 text-white rounded-full text-lg font-semibold shadow-lg hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Essayer maintenant
          </Link>
          <a
            href="#features"
            className="px-8 py-3 border-2 border-blue-600 text-blue-700 rounded-full text-lg font-semibold bg-white/80 hover:bg-blue-50 shadow hover:shadow-lg transition-all duration-200"
          >
            Découvrir les fonctionnalités
          </a>
        </div>
        {/* Bloc réassurance */}
        <div className="mt-14 max-w-xl mx-auto bg-white/90 rounded-2xl shadow-lg p-8 border border-blue-100 z-10 backdrop-blur">
          <p className="text-base md:text-lg text-gray-700">
            <span className="font-semibold text-blue-700">Pas de pression.</span> Notrello
            n&apos;est pas là pour te rendre &quot;ultra-productif&quot;.
            <br />
            C&apos;est un espace pour t&apos;aider à retrouver le fil, à ton rythme, sans jugement.
          </p>
        </div>
      </section>
      {/* Fonctionnalités */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 px-4">
          {[
            {
              icon: '📅',
              title: 'Agenda visuel',
              desc: 'Visualise ta journée d&apos;un coup d&apos;œil, déplace tes tâches comme tu veux.',
            },
            {
              icon: '🗂️',
              title: 'Cartes personnalisées',
              desc: 'Organise tes idées et projets avec des cartes simples et modulables.',
            },
            {
              icon: '📝',
              title: 'Notes libres',
              desc: 'Note tout ce qui te passe par la tête, relie-les à tes cartes ou ton agenda.',
            },
            {
              icon: '🔒',
              title: 'Connexion sécurisée',
              desc: 'Tout est protégé, tu es le seul à accéder à tes données.',
            },
          ].map((f, _i) => (
            <div
              key={f.title}
              className="flex flex-col items-center text-center p-8 rounded-2xl bg-blue-50 border border-blue-100 shadow-md hover:shadow-xl transition-all duration-200 group"
            >
              <span className="flex items-center justify-center w-20 h-20 rounded-full bg-white shadow group-hover:bg-blue-100 text-4xl mb-4 border-2 border-blue-200 transition-all">
                {f.icon}
              </span>
              <h3 className="font-bold text-xl mb-2 text-blue-800">{f.title}</h3>
              <p className="text-gray-700 text-base">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
      {/* Comment ça marche */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-10 text-blue-800">
            Comment ça marche&nbsp;?
          </h2>
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 justify-center items-center">
            <div className="flex-1 bg-white rounded-xl shadow p-6 border border-blue-100 flex flex-col items-center">
              <span className="text-3xl mb-2">1️⃣</span>
              <h4 className="font-semibold text-lg mb-1">Connecte-toi</h4>
              <p className="text-gray-600 text-sm">
                Accède à ton espace Notrello sécurisé en un clic.
              </p>
            </div>
            <div className="flex-1 bg-white rounded-xl shadow p-6 border border-blue-100 flex flex-col items-center">
              <span className="text-3xl mb-2">2️⃣</span>
              <h4 className="font-semibold text-lg mb-1">Crée, déplace, note</h4>
              <p className="text-gray-600 text-sm">
                Ajoute des cartes, des notes, organise ta journée visuellement.
              </p>
            </div>
            <div className="flex-1 bg-white rounded-xl shadow p-6 border border-blue-100 flex flex-col items-center">
              <span className="text-3xl mb-2">3️⃣</span>
              <h4 className="font-semibold text-lg mb-1">Respire</h4>
              <p className="text-gray-600 text-sm">
                Profite d&apos;un outil qui s&apos;adapte à ton rythme, sans pression.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Pourquoi */}
      <section id="pourquoi" className="py-20 bg-white text-center px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-blue-800">
          Notrello n&apos;est pas un outil de productivité de plus. C&apos;est un outil de clarté.
        </h2>
        <p className="max-w-2xl mx-auto text-lg text-gray-700">
          Conçu pour les cerveaux qui s&apos;éparpillent, Notrello t&apos;aide à poser les choses
          visuellement, simplement.
        </p>
      </section>
      {/* Témoignage / Perso */}
      <section id="about" className="py-16 text-center px-4">
        <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-blue-100 flex flex-col items-center">
          <Image
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="Créateur Notrello"
            width={64}
            height={64}
            className="rounded-full mb-4 shadow-md object-cover border-2 border-blue-200"
            loading="lazy"
          />
          <blockquote className="italic text-xl text-gray-600 mb-2">
            « Créé par quelqu&apos;un avec un TDAH, pour tous ceux qui galèrent à structurer leurs
            journées. »
          </blockquote>
          <span className="text-gray-500 text-sm">Hugo, créateur de Notrello</span>
        </div>
      </section>
      {/* Bloc d'appel à l'action final */}
      <section className="py-14 bg-blue-600 text-white text-center">
        <h3 className="text-2xl md:text-3xl font-bold mb-4">Prêt à retrouver le fil&nbsp;?</h3>
        <p className="mb-6 text-lg">
          Rejoins Notrello et commence à organiser tes journées à ta façon.
        </p>
        <Link
          href="/login"
          className="inline-block px-10 py-4 bg-white text-blue-700 rounded-full text-lg font-bold shadow hover:bg-blue-50 transition-all"
        >
          Se lancer maintenant
        </Link>
      </section>
      <Footer />
    </div>
  )
}
