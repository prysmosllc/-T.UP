'use client'

import { Role } from '@prisma/client'
import { FounderProfileData, InvestorProfileData } from '@/lib/types'

interface ProfilePreviewProps {
  role: Role
  data: FounderProfileData | InvestorProfileData
  onClose: () => void
  onEdit?: () => void
}

export function ProfilePreview({ role, data, onClose, onEdit }: ProfilePreviewProps) {
  const isFounder = role === Role.FOUNDER
  const founderData = isFounder ? data as FounderProfileData : null
  const investorData = !isFounder ? data as InvestorProfileData : null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-stellar to-stellar/90 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-poppins font-bold mb-1">Profile Preview</h2>
              <p className="text-white/80 font-inter">How your profile appears to others</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {isFounder && founderData ? (
            <FounderProfileCard data={founderData} />
          ) : investorData ? (
            <InvestorProfileCard data={investorData} />
          ) : null}
        </div>

        {/* Footer */}
        <div className="bg-light-grey/50 p-6 border-t border-medium-grey/20">
          <div className="flex justify-between items-center">
            <p className="text-sm text-dark-grey font-inter">
              This is how your profile will appear in the discovery feed
            </p>
            <div className="flex space-x-3">
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="px-4 py-2 border border-medium-grey/30 text-dark-grey hover:text-stellar hover:border-stellar/30 rounded-xl font-inter font-medium transition-all duration-200"
                >
                  Edit Profile
                </button>
              )}
              <button
                onClick={onClose}
                className="px-6 py-2 bg-teal hover:bg-teal/90 text-white rounded-xl font-inter font-medium transition-colors duration-200"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function FounderProfileCard({ data }: { data: FounderProfileData }) {
  return (
    <div className="bg-gradient-to-br from-white to-light-grey rounded-2xl p-6 border border-medium-grey/20 shadow-lg">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-2xl font-poppins font-bold text-stellar">{data.startupName}</h3>
            <span className="px-3 py-1 bg-teal text-white text-sm font-inter font-medium rounded-full">
              Founder
            </span>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 bg-stellar/10 text-stellar text-sm font-inter rounded-full">
              {data.industry}
            </span>
            <span className="px-3 py-1 bg-gold/10 text-stellar text-sm font-inter rounded-full">
              {data.stage.toUpperCase()} Stage
            </span>
            <span className="px-3 py-1 bg-teal/10 text-stellar text-sm font-inter rounded-full">
              ${data.fundingAsk.min.toLocaleString()} - ${data.fundingAsk.max.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Pitch */}
      <div className="mb-6">
        <h4 className="text-lg font-poppins font-semibold text-stellar mb-3">About</h4>
        <p className="text-dark-grey font-inter leading-relaxed">{data.briefPitch}</p>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white/50 rounded-xl p-4">
          <h5 className="text-sm font-poppins font-semibold text-stellar mb-1">Location</h5>
          <p className="text-dark-grey font-inter">{data.location}</p>
        </div>
        <div className="bg-white/50 rounded-xl p-4">
          <h5 className="text-sm font-poppins font-semibold text-stellar mb-1">Website</h5>
          <a href={data.website} target="_blank" rel="noopener noreferrer" className="text-teal hover:text-teal/80 font-inter text-sm">
            {data.website}
          </a>
        </div>
        {data.teamSize && (
          <div className="bg-white/50 rounded-xl p-4">
            <h5 className="text-sm font-poppins font-semibold text-stellar mb-1">Team Size</h5>
            <p className="text-dark-grey font-inter">{data.teamSize} members</p>
          </div>
        )}
        {data.tractionMetrics && (
          <div className="bg-white/50 rounded-xl p-4">
            <h5 className="text-sm font-poppins font-semibold text-stellar mb-1">Traction</h5>
            <p className="text-dark-grey font-inter text-sm">{data.tractionMetrics}</p>
          </div>
        )}
      </div>

      {/* Attachments */}
      <div className="flex items-center space-x-4">
        <a href={data.website} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-teal hover:text-teal/80 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          <span className="text-sm font-inter">Website</span>
        </a>
        {data.pitchDeckUrl && (
          <a href={data.pitchDeckUrl} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-gold hover:text-gold/80 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-sm font-inter">Pitch Deck</span>
          </a>
        )}
      </div>
    </div>
  )
}

function InvestorProfileCard({ data }: { data: InvestorProfileData }) {
  return (
    <div className="bg-gradient-to-br from-white to-light-grey rounded-2xl p-6 border border-medium-grey/20 shadow-lg">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-2xl font-poppins font-bold text-stellar">Investor Profile</h3>
            <span className="px-3 py-1 bg-gold text-stellar text-sm font-inter font-medium rounded-full">
              Investor
            </span>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 bg-gold/10 text-stellar text-sm font-inter rounded-full">
              ${data.checkSize.min.toLocaleString()} - ${data.checkSize.max.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Introduction */}
      <div className="mb-6">
        <h4 className="text-lg font-poppins font-semibold text-stellar mb-3">Introduction</h4>
        <p className="text-dark-grey font-inter leading-relaxed">{data.introNote}</p>
      </div>

      {/* Investment Focus */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div>
          <h5 className="text-sm font-poppins font-semibold text-stellar mb-3">Sectors</h5>
          <div className="flex flex-wrap gap-2">
            {data.sectors.map((sector) => (
              <span key={sector} className="px-2 py-1 bg-gold/10 text-stellar text-xs font-inter rounded-full">
                {sector}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h5 className="text-sm font-poppins font-semibold text-stellar mb-3">Stages</h5>
          <div className="flex flex-wrap gap-2">
            {data.stages.map((stage) => (
              <span key={stage} className="px-2 py-1 bg-teal/10 text-stellar text-xs font-inter rounded-full">
                {stage}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h5 className="text-sm font-poppins font-semibold text-stellar mb-3">Geography</h5>
          <div className="flex flex-wrap gap-2">
            {data.geography.map((geo) => (
              <span key={geo} className="px-2 py-1 bg-stellar/10 text-stellar text-xs font-inter rounded-full">
                {geo}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Optional Information */}
      {(data.portfolioLinks || data.theses) && (
        <div className="space-y-4">
          {data.portfolioLinks && data.portfolioLinks.length > 0 && (
            <div className="bg-white/50 rounded-xl p-4">
              <h5 className="text-sm font-poppins font-semibold text-stellar mb-2">Portfolio</h5>
              <div className="space-y-1">
                {data.portfolioLinks.map((link, index) => (
                  <p key={index} className="text-dark-grey font-inter text-sm">{link}</p>
                ))}
              </div>
            </div>
          )}
          {data.theses && (
            <div className="bg-white/50 rounded-xl p-4">
              <h5 className="text-sm font-poppins font-semibold text-stellar mb-2">Investment Theses</h5>
              <p className="text-dark-grey font-inter text-sm">{data.theses}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}