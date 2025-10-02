'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Role } from '@prisma/client'

interface RoleSelectionProps {
  userId: string
  experienceId: string
}

export function RoleSelection({ userId, experienceId }: RoleSelectionProps) {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role)
  }

  const handleContinue = async () => {
    if (!selectedRole) return

    setIsLoading(true)
    try {
      // Navigate to profile creation with the selected role
      router.push(`/experiences/${experienceId}/profile/create?role=${selectedRole.toLowerCase()}`)
    } catch (error) {
      console.error('Error navigating to profile creation:', error)
      setIsLoading(false)
    }
  }

  const handleBrowseFirst = () => {
    // Navigate to discovery with read-only mode
    router.push(`/experiences/${experienceId}/discovery?mode=browse`)
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-stellar/5 via-white to-teal/5"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-teal/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-gold/10 to-transparent rounded-full blur-3xl"></div>
      
      <div className="relative z-10 flex justify-center items-center min-h-screen px-4">
        <div className="max-w-4xl w-full text-center">
          {/* Header */}
          <div className="mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-teal to-gold rounded-2xl mb-6 shadow-2xl">
              <span className="text-2xl font-poppins font-bold text-white">⭐</span>
            </div>
            <h1 className="text-5xl font-poppins font-bold text-stellar mb-6">
              Choose Your Role
            </h1>
            <p className="text-xl text-dark-grey font-inter max-w-2xl mx-auto leading-relaxed">
              Select how you'd like to participate in the T.UP ecosystem and start building meaningful connections
            </p>
          </div>

          {/* Role Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Founder Card */}
            <div
              onClick={() => handleRoleSelect(Role.FOUNDER)}
              className={`cursor-pointer p-8 rounded-2xl border-2 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2 ${
                selectedRole === Role.FOUNDER
                  ? 'border-teal bg-gradient-to-br from-teal/10 to-teal/5 shadow-2xl scale-105'
                  : 'border-white/30 bg-white/80 backdrop-blur-sm hover:border-teal/50 shadow-lg'
              }`}
            >
              <div className="mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-teal to-teal/70 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                    <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-poppins font-bold text-stellar mb-3">
                  I'm a Founder
                </h3>
                <p className="text-dark-grey font-inter text-lg leading-relaxed">
                  Looking for investors to fund and grow my startup
                </p>
              </div>
            <div className="space-y-2 text-sm text-dark-grey font-inter">
              <div className="flex items-center justify-center">
                <span className="w-2 h-2 bg-teal rounded-full mr-2"></span>
                Create startup profile
              </div>
              <div className="flex items-center justify-center">
                <span className="w-2 h-2 bg-teal rounded-full mr-2"></span>
                Upload pitch deck
              </div>
              <div className="flex items-center justify-center">
                <span className="w-2 h-2 bg-teal rounded-full mr-2"></span>
                Connect with investors
              </div>
            </div>
          </div>

            {/* Investor Card */}
            <div
              onClick={() => handleRoleSelect(Role.INVESTOR)}
              className={`cursor-pointer p-8 rounded-2xl border-2 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2 ${
                selectedRole === Role.INVESTOR
                  ? 'border-gold bg-gradient-to-br from-gold/10 to-gold/5 shadow-2xl scale-105'
                  : 'border-white/30 bg-white/80 backdrop-blur-sm hover:border-gold/50 shadow-lg'
              }`}
            >
              <div className="mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-gold to-gold/70 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-3xl font-poppins font-bold text-stellar mb-3">
                  I'm an Investor
                </h3>
                <p className="text-dark-grey font-inter text-lg leading-relaxed">
                  Seeking promising startups to invest in and mentor
                </p>
              </div>
            <div className="space-y-2 text-sm text-dark-grey font-inter">
              <div className="flex items-center justify-center">
                <span className="w-2 h-2 bg-gold rounded-full mr-2"></span>
                Set investment criteria
              </div>
              <div className="flex items-center justify-center">
                <span className="w-2 h-2 bg-gold rounded-full mr-2"></span>
                Browse startup profiles
              </div>
              <div className="flex items-center justify-center">
                <span className="w-2 h-2 bg-gold rounded-full mr-2"></span>
                Connect with founders
              </div>
            </div>
          </div>
        </div>

          {/* Action Buttons */}
          <div className="space-y-6">
            <button
              onClick={handleContinue}
              disabled={!selectedRole || isLoading}
              className={`w-full max-w-md mx-auto block py-4 px-10 rounded-2xl font-inter font-bold transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 ${
                selectedRole && !isLoading
                  ? 'bg-gradient-to-r from-teal to-teal/90 hover:from-teal/90 hover:to-teal text-white'
                  : 'bg-medium-grey text-white cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Loading...
                </div>
              ) : (
                'Continue to Profile Setup'
              )}
            </button>

            <button
              onClick={handleBrowseFirst}
              className="block mx-auto text-dark-grey hover:text-stellar font-inter font-medium transition-all duration-200 hover:underline"
            >
              Browse profiles first →
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-12 p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20">
            <p className="text-sm text-medium-grey font-inter">
              💡 You can change your role later in your profile settings
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}