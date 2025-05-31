export default function Footer() {
  return (
    <footer className="py-6 border-t text-center text-sm text-gray-500 bg-white">
      <div className="flex flex-col md:flex-row justify-center gap-4 mb-2">
        <a href="#about" className="hover:text-blue-600 transition">
          À propos
        </a>
        <a href="#contact" className="hover:text-blue-600 transition">
          Contact
        </a>
        <a href="#" className="hover:text-blue-600 transition">
          Mentions légales
        </a>
      </div>
      <div>Notrello © 2025 – Créé pour retrouver le fil.</div>
    </footer>
  )
}
