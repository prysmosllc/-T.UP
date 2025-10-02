'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType, duration?: number) => void
  success: (message: string, duration?: number) => void
  error: (message: string, duration?: number) => void
  info: (message: string, duration?: number) => void
  warning: (message: string, duration?: number) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback((message: string, type: ToastType = 'info', duration = 5000) => {
    const id = Math.random().toString(36).substring(2, 9)
    const toast: Toast = { id, message, type, duration }

    setToasts((prev) => [...prev, toast])

    if (duration > 0) {
      setTimeout(() => removeToast(id), duration)
    }
  }, [removeToast])

  const success = useCallback((message: string, duration?: number) => {
    showToast(message, 'success', duration)
  }, [showToast])

  const error = useCallback((message: string, duration?: number) => {
    showToast(message, 'error', duration)
  }, [showToast])

  const info = useCallback((message: string, duration?: number) => {
    showToast(message, 'info', duration)
  }, [showToast])

  const warning = useCallback((message: string, duration?: number) => {
    showToast(message, 'warning', duration)
  }, [showToast])

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, warning }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) {
  return (
    <div className="fixed top-6 right-6 z-50 space-y-3 max-w-md w-full px-4 sm:px-0">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: -50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{
              opacity: 0,
              scale: 0.5,
              transition: { duration: 0.2 }
            }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 40
            }}
            className="relative"
          >
            <div className={`relative rounded-2xl shadow-hard overflow-hidden ${getToastStyles(toast.type)}`}>
              {/* Animated Progress Bar */}
              <motion.div
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{
                  duration: (toast.duration || 5000) / 1000,
                  ease: "linear"
                }}
                className={`absolute bottom-0 left-0 h-1 origin-left ${getProgressBarColor(toast.type)}`}
              />

              {/* Content */}
              <div className="flex items-start gap-4 p-4">
                {/* Icon with gradient background */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${getIconBackground(toast.type)}`}>
                  {getToastIcon(toast.type)}
                </div>

                {/* Message */}
                <div className="flex-1 min-w-0 pt-1">
                  <p className="text-sm font-body font-semibold text-neutral-900 leading-relaxed">
                    {toast.message}
                  </p>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => onRemove(toast.id)}
                  className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

function getToastStyles(type: ToastType): string {
  switch (type) {
    case 'success':
      return 'glass-card border-secondary-200'
    case 'error':
      return 'glass-card border-red-200'
    case 'warning':
      return 'glass-card border-accent-200'
    case 'info':
      return 'glass-card border-primary-200'
  }
}

function getIconBackground(type: ToastType): string {
  switch (type) {
    case 'success':
      return 'bg-gradient-to-br from-secondary-400 to-secondary-600'
    case 'error':
      return 'bg-gradient-to-br from-red-400 to-red-600'
    case 'warning':
      return 'bg-gradient-to-br from-accent-400 to-accent-600'
    case 'info':
      return 'bg-gradient-to-br from-primary-400 to-primary-600'
  }
}

function getProgressBarColor(type: ToastType): string {
  switch (type) {
    case 'success':
      return 'bg-gradient-to-r from-secondary-400 to-secondary-600'
    case 'error':
      return 'bg-gradient-to-r from-red-400 to-red-600'
    case 'warning':
      return 'bg-gradient-to-r from-accent-400 to-accent-600'
    case 'info':
      return 'bg-gradient-to-r from-primary-400 to-primary-600'
  }
}

function getToastIcon(type: ToastType) {
  switch (type) {
    case 'success':
      return (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )
    case 'error':
      return (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      )
    case 'warning':
      return (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    case 'info':
      return (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
  }
}
