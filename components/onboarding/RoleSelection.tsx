'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Role } from '@prisma/client'
import { motion } from 'framer-motion'

interface RoleSelectionProps {
  userId: string
  experienceId: string
}

export function RoleSelection({ userId, experienceId }: RoleSelectionProps) {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hoveredRole, setHoveredRole] = useState<Role | null>(null)
  const router = useRouter()

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role)
  }

  const handleContinue = async () => {
    if (!selectedRole) return

    setIsLoading(true)
    try {
      router.push(`/experiences/${experienceId}/profile/create?role=${selectedRole.toLowerCase()}`)
    } catch (error) {
      console.error('Error navigating to profile creation:', error)
      setIsLoading(false)
    }
  }

  const handleBrowseFirst = () => {
    router.push(`/experiences/${experienceId}/discovery?mode=browse`)
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-neutral-50 via-white to-primary-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary-400/20 to-secondary-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-secondary-400/20 to-accent-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-accent-400/10 to-primary-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-6xl"
        >
          {/* Header Section */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              className="inline-flex items-center justify-center w-24 h-24 mb-8"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-3xl blur-xl opacity-50 animate-pulse-soft" />
                <div className="relative bg-gradient-to-br from-primary-500 to-secondary-500 rounded-3xl p-5 shadow-hard">
                  <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-6xl md:text-7xl font-display font-bold mb-6 text-gradient"
            >
              Choose Your Path
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-neutral-600 font-body max-w-3xl mx-auto leading-relaxed"
            >
              Join the ecosystem where groundbreaking ideas meet visionary capital
            </motion.p>
          </div>

          {/* Role Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Founder Card */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
              onHoverStart={() => setHoveredRole(Role.FOUNDER)}
              onHoverEnd={() => setHoveredRole(null)}
              onClick={() => handleRoleSelect(Role.FOUNDER)}
              className="relative cursor-pointer group"
            >
              <div className={`
                relative overflow-hidden rounded-3xl p-8 h-full
                glass-card card-interactive
                ${selectedRole === Role.FOUNDER ? 'ring-4 ring-secondary-500 shadow-glow-secondary' : ''}
              `}>
                {/* Background gradient overlay */}
                <div className={`
                  absolute inset-0 bg-gradient-to-br from-secondary-500/10 via-transparent to-secondary-600/10 opacity-0
                  transition-opacity duration-500
                  ${hoveredRole === Role.FOUNDER || selectedRole === Role.FOUNDER ? 'opacity-100' : ''}
                `} />

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="mb-6 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
                    <div className="relative w-20 h-20 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-2xl flex items-center justify-center shadow-medium group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                      </svg>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-3xl font-display font-bold text-neutral-900 mb-3 group-hover:text-secondary-600 transition-colors duration-300">
                    I'm a Founder
                  </h3>

                  {/* Description */}
                  <p className="text-lg text-neutral-600 font-body mb-6 leading-relaxed">
                    Transform your vision into reality with the right investment partners
                  </p>

                  {/* Features */}
                  <ul className="space-y-3">
                    {[
                      'Create your startup profile',
                      'Upload pitch deck & materials',
                      'Connect with investors',
                      'Track engagement analytics',
                    ].map((feature, index) => (
                      <motion.li
                        key={feature}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className="flex items-center space-x-3"
                      >
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-secondary-500 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-neutral-700 font-body">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>

                  {/* Selected indicator */}
                  {selectedRole === Role.FOUNDER && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-6 right-6 w-12 h-12 bg-secondary-500 rounded-full flex items-center justify-center shadow-medium"
                    >
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Investor Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
              onHoverStart={() => setHoveredRole(Role.INVESTOR)}
              onHoverEnd={() => setHoveredRole(null)}
              onClick={() => handleRoleSelect(Role.INVESTOR)}
              className="relative cursor-pointer group"
            >
              <div className={`
                relative overflow-hidden rounded-3xl p-8 h-full
                glass-card card-interactive
                ${selectedRole === Role.INVESTOR ? 'ring-4 ring-accent-500 shadow-glow-accent' : ''}
              `}>
                {/* Background gradient overlay */}
                <div className={`
                  absolute inset-0 bg-gradient-to-br from-accent-500/10 via-transparent to-accent-600/10 opacity-0
                  transition-opacity duration-500
                  ${hoveredRole === Role.INVESTOR || selectedRole === Role.INVESTOR ? 'opacity-100' : ''}
                `} />

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="mb-6 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-accent-400 to-accent-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
                    <div className="relative w-20 h-20 bg-gradient-to-br from-accent-400 to-accent-600 rounded-2xl flex items-center justify-center shadow-medium group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-3xl font-display font-bold text-neutral-900 mb-3 group-hover:text-accent-600 transition-colors duration-300">
                    I'm an Investor
                  </h3>

                  {/* Description */}
                  <p className="text-lg text-neutral-600 font-body mb-6 leading-relaxed">
                    Discover exceptional startups and deploy capital strategically
                  </p>

                  {/* Features */}
                  <ul className="space-y-3">
                    {[
                      'Set investment criteria',
                      'Browse curated startups',
                      'Connect with founders',
                      'Manage your portfolio',
                    ].map((feature, index) => (
                      <motion.li
                        key={feature}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className="flex items-center space-x-3"
                      >
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-accent-500 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-neutral-700 font-body">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>

                  {/* Selected indicator */}
                  {selectedRole === Role.INVESTOR && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-6 right-6 w-12 h-12 bg-accent-500 rounded-full flex items-center justify-center shadow-medium"
                    >
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col items-center space-y-6"
          >
            <button
              onClick={handleContinue}
              disabled={!selectedRole || isLoading}
              className={`
                btn-base group relative
                w-full max-w-md px-8 py-5 rounded-2xl
                font-display font-bold text-lg
                transition-all duration-300
                ${selectedRole && !isLoading
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-hard hover:shadow-glow-primary hover:scale-105'
                  : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                }
              `}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Loading...</span>
                </div>
              ) : (
                <span className="flex items-center justify-center space-x-2">
                  <span>Continue to Profile Setup</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              )}
            </button>

            <button
              onClick={handleBrowseFirst}
              className="text-neutral-600 hover:text-primary-600 font-body font-medium transition-colors duration-200 group flex items-center space-x-2"
            >
              <span>Explore the platform first</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </motion.div>

          {/* Help Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 text-center"
          >
            <div className="inline-flex items-center space-x-2 px-6 py-3 glass-card rounded-full">
              <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm text-neutral-600 font-body">
                You can change your role anytime in settings
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
