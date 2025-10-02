'use client'

import { useRouter } from 'next/navigation'
import { Role } from '@prisma/client'
import { motion } from 'framer-motion'
import { FounderProfileData, InvestorProfileData } from '@/lib/types'
import { FounderProfileForm } from './FounderProfileForm'
import { InvestorProfileForm } from './InvestorProfileForm'

interface ProfileCreationProps {
  userId: string
  experienceId: string
  role: Role
}

export function ProfileCreation({ userId, experienceId, role }: ProfileCreationProps) {
  const router = useRouter()

  const handleBack = () => {
    router.push(`/experiences/${experienceId}/onboarding`)
  }

  const handleProfileSubmit = async (data: FounderProfileData | InvestorProfileData, isDraft = false) => {
    try {
      // Upload pitch deck if provided
      let pitchDeckUrl = undefined
      if ('pitchDeckUrl' in data && data.pitchDeckUrl && typeof data.pitchDeckUrl === 'object') {
        const formData = new FormData()
        formData.append('file', data.pitchDeckUrl as File)

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json()
          pitchDeckUrl = uploadResult.data?.url
        }
      }

      // Create the profile
      const profileData = {
        ...data,
        pitchDeckUrl,
        isComplete: !isDraft
      }

      const response = await fetch('/api/profile/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          experienceId,
          data: profileData,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save profile')
      }

      // Navigate to success page or discovery
      if (isDraft) {
        // Stay on the same page for draft saves
        return
      } else {
        // Profile completed, redirect to discovery/discovery page
        router.push(`/experiences/${experienceId}/discovery`)
      }
    } catch (error) {
      console.error('Profile submission error:', error)
      throw error // Re-throw so the form can handle the error
    }
  }

  const isFounder = role === Role.FOUNDER

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-neutral-50 via-white to-primary-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className={`absolute top-20 right-20 w-80 h-80 rounded-full blur-3xl ${
            isFounder ? 'bg-gradient-to-br from-secondary-400/20 to-secondary-600/20' : 'bg-gradient-to-br from-accent-400/20 to-accent-600/20'
          }`}
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 45, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-tr from-primary-400/20 to-primary-600/20 rounded-full blur-3xl"
          animate={{
            scale: [1.1, 1, 1.1],
            rotate: [45, 0, 45],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Enhanced Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="sticky top-0 z-50 glass-card border-b border-white/20 shadow-soft"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              {/* Left Section */}
              <div className="flex items-center space-x-6">
                <button
                  onClick={handleBack}
                  className="group flex items-center space-x-2 text-neutral-600 hover:text-neutral-900 transition-all duration-200"
                >
                  <div className="w-10 h-10 rounded-xl bg-neutral-100 group-hover:bg-neutral-200 flex items-center justify-center transition-colors duration-200">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </div>
                  <span className="hidden sm:block font-body font-medium">Back</span>
                </button>

                <div className="h-8 w-px bg-neutral-200"></div>

                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isFounder ? 'bg-gradient-to-br from-secondary-500 to-secondary-600' : 'bg-gradient-to-br from-accent-500 to-accent-600'
                  }`}>
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      {isFounder ? (
                        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                      ) : (
                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      )}
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-lg font-display font-bold text-neutral-900">
                      {isFounder ? 'Founder Profile' : 'Investor Profile'}
                    </h1>
                    <p className="text-xs text-neutral-500 font-body">Step 2 of 3</p>
                  </div>
                </div>
              </div>

              {/* Right Section - Status Badge */}
              <div className="hidden md:flex items-center space-x-2 px-4 py-2 rounded-xl bg-neutral-100">
                <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse-soft"></div>
                <span className="text-sm font-body font-medium text-neutral-700">In Progress</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative h-1 bg-neutral-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '66%' }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`absolute top-0 left-0 h-full ${
                  isFounder ? 'bg-gradient-to-r from-secondary-500 to-secondary-600' : 'bg-gradient-to-r from-accent-500 to-accent-600'
                }`}
              />
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-neutral-900 mb-4">
              {isFounder ? 'Tell us about your startup' : 'Share your investment focus'}
            </h2>
            <p className="text-lg md:text-xl text-neutral-600 font-body max-w-3xl mx-auto leading-relaxed">
              {isFounder
                ? 'Create a compelling profile that showcases your vision and attracts the right investors'
                : 'Define your investment criteria to discover startups that match your strategy'
              }
            </p>
          </motion.div>

          {/* Modern Progress Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-4 md:space-x-8">
                {/* Step 1 - Completed */}
                <div className="flex items-center">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-soft">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-3 hidden md:block">
                    <div className="text-sm font-body font-bold text-neutral-900">Role Selected</div>
                    <div className="text-xs text-neutral-500">Choose your path</div>
                  </div>
                </div>

                {/* Connector */}
                <div className="w-16 md:w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"></div>

                {/* Step 2 - Active */}
                <div className="flex items-center">
                  <div className="relative">
                    <div className={`absolute inset-0 rounded-2xl blur-lg ${
                      isFounder ? 'bg-secondary-500' : 'bg-accent-500'
                    } opacity-50 animate-pulse-soft`}></div>
                    <div className={`relative w-12 h-12 rounded-2xl flex items-center justify-center shadow-soft ${
                      isFounder ? 'bg-gradient-to-br from-secondary-500 to-secondary-600' : 'bg-gradient-to-br from-accent-500 to-accent-600'
                    }`}>
                      <span className="text-lg font-display font-bold text-white">2</span>
                    </div>
                  </div>
                  <div className="ml-3 hidden md:block">
                    <div className="text-sm font-body font-bold text-neutral-900">Profile Details</div>
                    <div className="text-xs text-neutral-500">Tell your story</div>
                  </div>
                </div>

                {/* Connector */}
                <div className="w-16 md:w-24 h-1 bg-neutral-200 rounded-full"></div>

                {/* Step 3 - Upcoming */}
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-2xl bg-neutral-200 flex items-center justify-center">
                    <span className="text-lg font-display font-bold text-neutral-400">3</span>
                  </div>
                  <div className="ml-3 hidden md:block">
                    <div className="text-sm font-body font-bold text-neutral-400">Start Matching</div>
                    <div className="text-xs text-neutral-400">Discover connections</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form Container with Glass Effect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            {/* Decorative gradient border */}
            <div className={`absolute -inset-0.5 rounded-3xl opacity-75 blur ${
              isFounder ? 'bg-gradient-to-r from-secondary-500 to-secondary-600' : 'bg-gradient-to-r from-accent-500 to-accent-600'
            }`}></div>

            <div className="relative glass-card rounded-3xl shadow-hard overflow-hidden">
              {/* Gradient accent bar at top */}
              <div className={`h-1 ${
                isFounder ? 'bg-gradient-to-r from-secondary-500 to-secondary-600' : 'bg-gradient-to-r from-accent-500 to-accent-600'
              }`}></div>

              {/* Form Content */}
              {isFounder ? (
                <FounderProfileForm userId={userId} experienceId={experienceId} onSubmit={handleProfileSubmit} />
              ) : (
                <InvestorProfileForm userId={userId} experienceId={experienceId} onSubmit={handleProfileSubmit} />
              )}
            </div>
          </motion.div>

          {/* Help Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 text-center"
          >
            <div className="inline-flex items-center space-x-2 px-6 py-3 glass-card rounded-2xl shadow-soft">
              <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm text-neutral-600 font-body">
                Your progress is automatically saved • You can edit anytime
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
