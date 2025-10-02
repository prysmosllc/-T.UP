'use client'

import { useState } from 'react'
import { Profile } from '@prisma/client'

interface DiscoveryInterfaceProps {
  userId: string
  experienceId: string
  userProfile: Profile | null
  browseMode?: boolean
}

export function DiscoveryInterface({ userId, experienceId, userProfile, browseMode = false }: DiscoveryInterfaceProps) {
  const [isLoading, setIsLoading] = useState(false)

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
                <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-teal to-gold rounded-xl shadow-lg">
                  <span className="text-lg font-poppins font-bold text-white">⭐</span>
                </div>
                <div>
                  <h1 className="text-xl font-poppins font-bold text-stellar">
                    {browseMode ? 'Browse Profiles' : 'Discovery'}
                  </h1>
                  <p className="text-sm text-dark-grey font-inter">
                    {browseMode ? 'Preview mode - complete your profile to start matching' : 'Find your perfect match'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {!browseMode && (
                  <>
                    <button className="p-2 text-dark-grey hover:text-stellar transition-colors duration-200">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                      </svg>
                    </button>
                    <button className="p-2 text-dark-grey hover:text-stellar transition-colors duration-200">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] px-4">
          <div className="text-center max-w-2xl w-full">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-12 border border-white/20">
              <div className="mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-teal to-gold rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                
                <h2 className="text-3xl font-poppins font-bold text-stellar mb-4">
                  {browseMode ? 'Browse Mode' : 'Discovery Coming Soon'}
                </h2>
                
                <p className="text-lg text-dark-grey font-inter mb-8">
                  {browseMode 
                    ? 'You\'re in preview mode. Complete your profile to start matching with founders and investors.'
                    : 'The discovery interface is being built. You\'ll be able to swipe through profiles and find perfect matches here.'
                  }
                </p>

                {userProfile && (
                  <div className="bg-light-grey/50 rounded-xl p-6 mb-8">
                    <h3 className="text-lg font-poppins font-semibold text-stellar mb-2">Your Profile</h3>
                    <div className="flex items-center justify-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-inter font-medium ${
                        userProfile.role === 'FOUNDER' ? 'bg-teal text-white' : 'bg-gold text-stellar'
                      }`}>
                        {userProfile.role}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-inter font-medium ${
                        userProfile.isComplete ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {userProfile.isComplete ? 'Complete' : 'Draft'}
                      </span>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {browseMode ? (
                    <a
                      href={`/experiences/${experienceId}/onboarding`}
                      className="inline-block bg-gradient-to-r from-teal to-teal/90 hover:from-teal/90 hover:to-teal text-white font-inter font-bold py-3 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      Complete Your Profile
                    </a>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-medium-grey font-inter">
                        Coming in the next update:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center justify-center space-x-2 text-dark-grey">
                          <div className="w-2 h-2 bg-teal rounded-full"></div>
                          <span>Swipe Interface</span>
                        </div>
                        <div className="flex items-center justify-center space-x-2 text-dark-grey">
                          <div className="w-2 h-2 bg-gold rounded-full"></div>
                          <span>Smart Matching</span>
                        </div>
                        <div className="flex items-center justify-center space-x-2 text-dark-grey">
                          <div className="w-2 h-2 bg-stellar rounded-full"></div>
                          <span>Chat System</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}