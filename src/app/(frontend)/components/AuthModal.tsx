'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createPortal } from 'react-dom'
import { UserIcon, EnvelopeIcon, KeyIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import InputField from './ui/InputField'
import PasswordStrength from './ui/PasswordStrength'

type AuthMode = 'login' | 'register'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: AuthMode
}

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [identifier, setIdentifier] = useState('')
  const [pseudo, setPseudo] = useState('')
  const [email, setEmail] = useState('')
  const [_password, _setPassword] = useState('')
  const [_confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSelecting, setIsSelecting] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [pseudoError, setPseudoError] = useState<string | undefined>()
  const [emailError, setEmailError] = useState<string | undefined>()
  const [_loginPasswordReadOnly, _setLoginPasswordReadOnly] = useState(true)
  const [_registerPasswordReadOnly, _setRegisterPasswordReadOnly] = useState(true)
  const [_registerConfirmPasswordReadOnly, _setRegisterConfirmPasswordReadOnly] = useState(true)
  const [_loginPasswordType, _setLoginPasswordType] = useState<'text' | 'password'>('text')
  const [_registerPasswordType, _setRegisterPasswordType] = useState<'text' | 'password'>('text')
  const [_registerConfirmPasswordType, _setRegisterConfirmPasswordType] = useState<
    'text' | 'password'
  >('text')
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [showRegisterPassword, setShowRegisterPassword] = useState(false)
  const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState(false)
  const router = useRouter()

  // États séparés pour les mots de passe connexion/inscription
  const [loginPassword, setLoginPassword] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('')

  // Réinitialiser les champs uniquement lors du changement de mode
  useEffect(() => {
    if (mode === 'login') {
      setPseudo('')
      setEmail('')
      setConfirmPassword('')
    } else {
      setIdentifier('')
    }
    setError('')
  }, [mode])

  // Fermer sur Échap
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Désactiver le scroll du fond
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Fermer en cliquant sur l'overlay
  const handleOverlayClick = useCallback(
    (_e: React.MouseEvent<HTMLDivElement>) => {
      // Ne pas fermer si on vient de sélectionner du texte
      if (isSelecting) {
        setIsSelecting(false)
        return
      }
      if (_e.target === _e.currentTarget) {
        onClose()
      }
    },
    [onClose, isSelecting],
  )

  if (!isOpen) return null

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ identifier, password: loginPassword }),
    })
    if (res.ok) {
      onClose()
      router.push('/dashboard')
    } else {
      const data = await res.json()
      setError(data.error || 'Erreur inconnue')
    }
    setLoading(false)
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    if (registerPassword !== registerConfirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      setLoading(false)
      return
    }
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pseudo, email, password: registerPassword }),
      })
      if (res.ok) {
        onClose()
        router.push('/dashboard')
      } else {
        const data = await res.json()
        setError(data.error || 'Erreur lors de la création du compte')
      }
    } catch (_err) {
      setError('Erreur de connexion au serveur')
    }
    setLoading(false)
  }

  async function checkPseudoExists(pseudo: string) {
    if (!pseudo) return
    const res = await fetch(`/api/find-pseudo?pseudo=${encodeURIComponent(pseudo)}`)
    if (res.ok) {
      const data = await res.json()
      if (data.exists) setPseudoError('Ce pseudo est déjà utilisé')
      else setPseudoError(undefined)
    }
  }

  async function checkEmailExists(email: string) {
    if (!email) return
    const res = await fetch(`/api/find-email?email=${encodeURIComponent(email)}`)
    if (res.ok) {
      const data = await res.json()
      if (data.exists) setEmailError('Cet email est déjà utilisé')
      else setEmailError(undefined)
    }
  }

  // Nouvelle logique pour le type de champ mot de passe
  const _getPasswordType = (show: boolean, forcePassword: boolean) => {
    if (show) return 'text'
    return forcePassword ? 'password' : 'text'
  }

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center z-[9999] bg-black bg-opacity-50"
      onClick={handleOverlayClick}
      onMouseDown={(_e) => {
        // Détecter si on commence une sélection dans un input
        if ((_e.target as HTMLElement).closest('input')) {
          setIsSelecting(true)
        }
      }}
      onMouseUp={(_e) => {
        // Réinitialiser l'état de sélection après un court délai
        setTimeout(() => {
          setIsSelecting(false)
        }, 100)
      }}
    >
      <div
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md relative"
        onClick={(_e) => _e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          type="button"
        >
          ✕
        </button>

        {mode === 'login' ? (
          <>
            <form onSubmit={handleLogin} className="flex flex-col gap-6" autoComplete="off">
              {/* Champ leurre caché pour tromper l'autofill */}
              <input
                type="password"
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
                name="fake-login-password"
              />
              <h1 className="text-2xl font-bold text-center text-blue-700">Connexion</h1>
              <InputField
                type="text"
                label="Email ou pseudo"
                name="no-autofill-login-identifier"
                value={identifier}
                onChange={setIdentifier}
                required
                icon={<UserIcon className="h-5 w-5" />}
                placeholder="Entrez votre email ou pseudo"
                autoComplete="off"
                readOnly
                onFocus={(e) => e.currentTarget.removeAttribute('readonly')}
              />
              <InputField
                type={showLoginPassword ? 'text' : 'password'}
                label="Mot de passe"
                name="no-autofill-login-password"
                value={loginPassword}
                onChange={setLoginPassword}
                required
                icon={<KeyIcon className="h-5 w-5" />}
                placeholder="Entrez votre mot de passe"
                autoComplete="off"
                rightIcon={
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowLoginPassword((v) => !v)}
                  >
                    {showLoginPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                }
              />
              {error && <div className="text-red-600 text-center">{error}</div>}
              <button
                type="submit"
                className="bg-blue-600 text-white rounded px-4 py-2 font-semibold hover:bg-blue-700 transition"
                disabled={loading}
              >
                {loading ? 'Connexion...' : 'Se connecter'}
              </button>
            </form>
            <div className="mt-4 flex flex-col items-center gap-2">
              <button type="button" className="text-blue-600 hover:underline text-sm" disabled>
                Mot de passe oublié&nbsp;?
              </button>
              <button
                type="button"
                className="text-blue-600 hover:underline text-sm"
                onClick={() => setMode('register')}
              >
                Créer un compte
              </button>
            </div>
          </>
        ) : (
          <>
            <form onSubmit={handleRegister} className="flex flex-col gap-6" autoComplete="off">
              <h1 className="text-2xl font-bold text-center text-blue-700">Créer un compte</h1>
              <InputField
                type="email"
                label="Email"
                name="register-email"
                value={email}
                onChange={setEmail}
                required
                icon={<EnvelopeIcon className="h-5 w-5" />}
                placeholder="Entrez votre email"
                autoComplete="email"
                validation={{
                  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Format d'email invalide",
                }}
                error={emailError}
                onBlur={() => checkEmailExists(email)}
              />
              <InputField
                type="text"
                label="Pseudo"
                name="register-username"
                value={pseudo}
                onChange={setPseudo}
                required
                icon={<UserIcon className="h-5 w-5" />}
                placeholder="Choisissez un pseudo"
                autoComplete="new-username"
                validation={{
                  minLength: 3,
                  maxLength: 20,
                  pattern: /^[a-zA-Z0-9_-]+$/,
                  message:
                    'Le pseudo ne doit contenir que des lettres, chiffres, tirets et underscores',
                }}
                error={pseudoError}
                onBlur={() => checkPseudoExists(pseudo)}
              />
              {/* Champ leurre caché pour tromper l'autofill */}
              <input
                type="password"
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
                name="fake-password"
              />
              <InputField
                type={showRegisterPassword ? 'text' : 'password'}
                label="Mot de passe"
                name="no-autofill-password"
                value={registerPassword}
                onChange={setRegisterPassword}
                required
                icon={<KeyIcon className="h-5 w-5" />}
                placeholder="Créez un mot de passe"
                autoComplete="off"
                rightIcon={
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowRegisterPassword((v) => !v)}
                  >
                    {showRegisterPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                }
              />
              {registerPassword && (
                <PasswordStrength
                  password={registerPassword}
                  onStrengthChange={setPasswordStrength}
                />
              )}
              <InputField
                type={showRegisterConfirmPassword ? 'text' : 'password'}
                label="Confirmer le mot de passe"
                name="no-autofill-password-confirm"
                value={registerConfirmPassword}
                onChange={setRegisterConfirmPassword}
                required
                icon={<KeyIcon className="h-5 w-5" />}
                placeholder="Confirmez votre mot de passe"
                error={
                  registerConfirmPassword && registerPassword !== registerConfirmPassword
                    ? 'Les mots de passe ne correspondent pas'
                    : undefined
                }
                autoComplete="off"
                rightIcon={
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowRegisterConfirmPassword((v) => !v)}
                  >
                    {showRegisterConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                }
              />
              {error && <div className="text-red-600 text-center">{error}</div>}
              <button
                type="submit"
                className="bg-blue-600 text-white rounded px-4 py-2 font-semibold hover:bg-blue-700 transition"
                disabled={loading || passwordStrength < 2}
              >
                {loading ? 'Création...' : 'Créer mon compte'}
              </button>
            </form>
            <div className="mt-4 text-center">
              <button
                type="button"
                className="text-blue-600 hover:underline text-sm"
                onClick={() => setMode('login')}
              >
                Déjà un compte ? Se connecter
              </button>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body,
  )
}
