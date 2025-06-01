'use client'

import { useState, useEffect } from 'react'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

interface InputFieldProps {
  type: 'text' | 'email' | 'password'
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  required?: boolean
  icon?: React.ReactNode
  validation?: {
    pattern?: RegExp
    message?: string
    minLength?: number
    maxLength?: number
  }
  placeholder?: string
  className?: string
  autoComplete?: string
  name?: string
  readOnly?: boolean
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  rightIcon?: React.ReactNode
}

export default function InputField({
  type,
  label,
  value,
  onChange,
  error: externalError,
  required = false,
  icon,
  validation,
  placeholder,
  className = '',
  autoComplete,
  name,
  readOnly,
  onFocus,
  onBlur,
  rightIcon,
}: InputFieldProps) {
  const [error, setError] = useState<string>('')
  const [showPassword, setShowPassword] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    if (externalError) {
      setError(externalError)
    }
  }, [externalError])

  const validateInput = (value: string) => {
    if (required && !value) {
      setError('Ce champ est requis')
      return false
    }

    if (validation?.pattern && !validation.pattern.test(value)) {
      setError(validation.message || 'Format invalide')
      return false
    }

    if (validation?.minLength && value.length < validation.minLength) {
      setError(`Minimum ${validation.minLength} caractères`)
      return false
    }

    if (validation?.maxLength && value.length > validation.maxLength) {
      setError(`Maximum ${validation.maxLength} caractères`)
      return false
    }

    setError('')
    return true
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(newValue)
    validateInput(newValue)
  }

  const handleBlur = () => {
    setIsFocused(false)
    validateInput(value)
  }

  const inputType = type === 'password' && showPassword ? 'text' : type

  return (
    <div className={`relative ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>
        )}
        <input
          type={inputType}
          value={value}
          onChange={handleChange}
          onFocus={onFocus ? onFocus : () => setIsFocused(true)}
          onBlur={(e) => {
            handleBlur()
            if (onBlur) {
              onBlur(e)
            }
          }}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          name={name}
          className={`
            w-full px-4 py-2 border rounded-lg transition-colors
            ${icon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
            ${error ? 'border-red-500' : isFocused ? 'border-blue-500' : 'border-gray-300'}
            focus:outline-none focus:ring-2 focus:ring-blue-500/20
          `}
          readOnly={readOnly}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
            {rightIcon}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
}
