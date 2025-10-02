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
    <div className="flex justify-center items-center min-h-screen px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-poppins font-bold text-stellar mb-4">
            Choose Your Role
          </h1>
          <p className="text-lg text-dark-grey font-inter">
            Select how you'd like to participate in the T.UP ecosystem
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Founder Card */}
          <div
            onClick={() => handleRoleSelect(Role.FOUNDER)}
            className={`cursor-pointer p-8 rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${
              selectedRole === Role.FOUNDER
                ? 'border-teal bg-teal/5 shadow-lg'
                : 'border-medium-grey/30 bg-white hover:border-teal/50'
            }`}
          >
            <div className="mb-6">
              <div className="w-16 h-16 bg-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-teal" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                  <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                </svg>
              </div>
              <h3 className="text-2xl font-poppins font-semibold text-stellar mb-2">
                I'm a Founder
              </h3>
              <p className="text-dark-grey font-inter">
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
            className={`cursor-pointer p-8 rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${
              selectedRole === Role.INVESTOR
                ? 'border-gold bg-gold/5 shadow-lg'
                : 'border-medium-grey/30 bg-white hover:border-gold/50'
            }`}
          >
            <div className="mb-6">
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-poppins font-semibold text-stellar mb-2">
                I'm an Investor
              </h3>
              <p className="text-dark-grey font-inter">
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
        <div className="space-y-4">
          <button
            onClick={handleContinue}
            disabled={!selectedRole || isLoading}
            className={`w-full max-w-md mx-auto block py-3 px-8 rounded-lg font-inter font-bold transition-all duration-200 ${
              selectedRole && !isLoading
                ? 'bg-teal hover:bg-teal/90 text-white shadow-lg hover:shadow-xl'
                : 'bg-medium-grey text-white cursor-not-allowed'
            }`}
          >
            {isLoading ? 'Loading...' : 'Continue'}
          </button>

          <button
            onClick={handleBrowseFirst}
            className="block mx-auto text-dark-grey hover:text-stellar font-inter font-medium transition-colors duration-200"
          >
            Browse first →
          </button>
        </div>

        {/* Help Text */}
        <p className="text-sm text-medium-grey font-inter mt-8">
          You can change your role later in your profile settings
        </p>
      </div>
    </div>
  )
}