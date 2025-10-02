'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Role } from '@prisma/client'
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

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-stellar/5 via-white to-teal/5"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-teal/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-gold/10 to-transparent rounded-full blur-3xl"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleBack}
                  className="flex items-center text-dark-grey hover:text-stellar transition-colors duration-200"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span className="font-inter font-medium">Back</span>
                </button>
                <div className="h-6 w-px bg-medium-grey/30"></div>
                <div>
                  <h1 className="text-lg font-poppins font-semibold text-stellar">
                    Create Your {role === Role.FOUNDER ? 'Founder' : 'Investor'} Profile
                  </h1>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${role === Role.FOUNDER ? 'bg-teal' : 'bg-gold'}`}></div>
                  <span className="text-sm font-inter font-medium text-dark-grey">
                    {role === Role.FOUNDER ? 'Founder Profile' : 'Investor Profile'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-poppins font-bold text-stellar mb-4">
                {role === Role.FOUNDER ? 'Tell us about your startup' : 'Share your investment focus'}
              </h2>
              <p className="text-lg text-dark-grey font-inter max-w-2xl mx-auto">
                {role === Role.FOUNDER 
                  ? 'Help investors discover your startup by providing key details about your business, team, and funding needs.'
                  : 'Help founders understand your investment criteria by sharing your focus areas, check size, and portfolio preferences.'
                }
              </p>
            </div>

            {/* Progress Indicator */}
            <div className="flex justify-center mb-8">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-teal rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="ml-2 text-sm font-inter font-medium text-dark-grey">Role Selected</span>
                </div>
                <div className="w-16 h-px bg-medium-grey/30"></div>
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    role === Role.FOUNDER ? 'bg-teal' : 'bg-gold'
                  }`}>
                    <span className="text-white font-inter font-bold text-sm">2</span>
                  </div>
                  <span className="ml-2 text-sm font-inter font-medium text-stellar">Profile Details</span>
                </div>
                <div className="w-16 h-px bg-medium-grey/30"></div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-medium-grey/30 rounded-full flex items-center justify-center">
                    <span className="text-medium-grey font-inter font-bold text-sm">3</span>
                  </div>
                  <span className="ml-2 text-sm font-inter font-medium text-medium-grey">Start Matching</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
            {role === Role.FOUNDER ? (
              <FounderProfileForm userId={userId} experienceId={experienceId} />
            ) : (
              <InvestorProfileForm userId={userId} experienceId={experienceId} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}