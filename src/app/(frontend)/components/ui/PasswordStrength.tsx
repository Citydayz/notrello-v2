'use client'

import { useEffect, useState } from 'react'

interface PasswordStrengthProps {
  password: string
  onStrengthChange?: (strength: number) => void
}

interface StrengthLevel {
  label: string
  color: string
  bgColor: string
}

const strengthLevels: StrengthLevel[] = [
  { label: 'Très faible', color: 'text-red-500', bgColor: 'bg-red-500' },
  { label: 'Faible', color: 'text-orange-500', bgColor: 'bg-orange-500' },
  { label: 'Moyen', color: 'text-yellow-500', bgColor: 'bg-yellow-500' },
  { label: 'Fort', color: 'text-green-500', bgColor: 'bg-green-500' },
  { label: 'Très fort', color: 'text-emerald-500', bgColor: 'bg-emerald-500' },
]

const criteria = [
  { label: '8 caractères minimum', regex: /.{8,}/ },
  { label: 'Une lettre majuscule', regex: /[A-Z]/ },
  { label: 'Une lettre minuscule', regex: /[a-z]/ },
  { label: 'Un chiffre', regex: /[0-9]/ },
  { label: 'Un caractère spécial', regex: /[!@#$%^&*(),.?&quot;:{}|<>]/ },
]

export default function PasswordStrength({ password, onStrengthChange }: PasswordStrengthProps) {
  const [strength, setStrength] = useState(0)
  const [metCriteria, setMetCriteria] = useState<boolean[]>([])

  useEffect(() => {
    const newMetCriteria = criteria.map((criterion) => criterion.regex.test(password))
    setMetCriteria(newMetCriteria)

    const newStrength = newMetCriteria.reduce((acc, met) => acc + (met ? 1 : 0), 0)
    const strengthLevel = Math.min(
      Math.floor((newStrength / criteria.length) * strengthLevels.length),
      strengthLevels.length - 1,
    )
    setStrength(strengthLevel)
    onStrengthChange?.(strengthLevel)
  }, [password, onStrengthChange])

  return (
    <div className="space-y-2">
      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${strengthLevels[strength].bgColor}`}
          style={{ width: `${((strength + 1) / strengthLevels.length) * 100}%` }}
        />
      </div>
      <div className="flex justify-between text-sm">
        <span className={strengthLevels[strength].color}>{strengthLevels[strength].label}</span>
        <span className="text-gray-500">{password.length} caractères</span>
      </div>
      <div className="space-y-1">
        {criteria.map((criterion, index) => (
          <div key={index} className="flex items-center text-sm">
            <div
              className={`w-4 h-4 mr-2 rounded-full flex items-center justify-center ${
                metCriteria[index] ? 'bg-green-500' : 'bg-gray-200'
              }`}
            >
              {metCriteria[index] && (
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
            <span className={metCriteria[index] ? 'text-green-500' : 'text-gray-500'}>
              {criterion.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
