'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const founderSchema = z.object({
  startupName: z.string().min(2, 'Startup name must be at least 2 characters'),
  industry: z.string().min(1, 'Please select an industry'),
  stage: z.enum(['idea', 'mvp', 'pmf'], { message: 'Please select a stage' }),
  fundingAskMin: z.number().min(1000, 'Minimum funding must be at least $1,000'),
  fundingAskMax: z.number().min(1000, 'Maximum funding must be at least $1,000'),
  briefPitch: z.string().min(50, 'Pitch must be at least 50 characters').max(500, 'Pitch must be less than 500 characters'),
  website: z.string().url('Please enter a valid website URL'),
  location: z.string().min(2, 'Location is required'),
  teamSize: z.number().optional(),
  tractionMetrics: z.string().optional(),
})

type FounderFormData = z.infer<typeof founderSchema>

interface FounderProfileFormProps {
  userId: string
  experienceId: string
}

const industries = [
  'Technology', 'Healthcare', 'Finance', 'E-commerce', 'Education', 'Real Estate',
  'Manufacturing', 'Energy', 'Transportation', 'Food & Beverage', 'Entertainment',
  'Agriculture', 'Biotechnology', 'Cybersecurity', 'AI/ML', 'Blockchain', 'Other'
]

const stages = [
  { value: 'idea', label: 'Idea Stage', description: 'Concept development and validation' },
  { value: 'mvp', label: 'MVP Stage', description: 'Minimum viable product built' },
  { value: 'pmf', label: 'Product-Market Fit', description: 'Proven market demand' }
]

export function FounderProfileForm({ userId, experienceId }: FounderProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isDraft, setIsDraft] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid }
  } = useForm<FounderFormData>({
    resolver: zodResolver(founderSchema),
    mode: 'onChange'
  })

  const watchedValues = watch()

  const onSubmit = async (data: FounderFormData, saveAsDraft = false) => {
    setIsLoading(true)
    setIsDraft(saveAsDraft)

    try {
      const response = await fetch('/api/profile/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          experienceId,
          role: 'FOUNDER',
          data: {
            ...data,
            fundingAsk: {
              min: data.fundingAskMin,
              max: data.fundingAskMax
            }
          },
          isComplete: !saveAsDraft
        }),
      })

      if (response.ok) {
        if (saveAsDraft) {
          // Show success message for draft
          alert('Profile saved as draft!')
        } else {
          // Navigate to discovery
          router.push(`/experiences/${experienceId}/discovery`)
        }
      } else {
        throw new Error('Failed to save profile')
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('Error saving profile. Please try again.')
    } finally {
      setIsLoading(false)
      setIsDraft(false)
    }
  }

  const handleSaveDraft = () => {
    handleSubmit((data) => onSubmit(data, true))()
  }

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data, false))} className="p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Startup Name */}
          <div>
            <label className="block text-sm font-poppins font-semibold text-stellar mb-2">
              Startup Name *
            </label>
            <input
              {...register('startupName')}
              className="w-full px-4 py-3 rounded-xl border border-medium-grey/30 focus:border-teal focus:ring-2 focus:ring-teal/20 transition-all duration-200 font-inter bg-white/50 backdrop-blur-sm"
              placeholder="Enter your startup name"
            />
            {errors.startupName && (
              <p className="mt-1 text-sm text-red-500 font-inter">{errors.startupName.message}</p>
            )}
          </div>

          {/* Industry */}
          <div>
            <label className="block text-sm font-poppins font-semibold text-stellar mb-2">
              Industry *
            </label>
            <select
              {...register('industry')}
              className="w-full px-4 py-3 rounded-xl border border-medium-grey/30 focus:border-teal focus:ring-2 focus:ring-teal/20 transition-all duration-200 font-inter bg-white/50 backdrop-blur-sm"
            >
              <option value="">Select an industry</option>
              {industries.map((industry) => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
            {errors.industry && (
              <p className="mt-1 text-sm text-red-500 font-inter">{errors.industry.message}</p>
            )}
          </div>

          {/* Stage */}
          <div>
            <label className="block text-sm font-poppins font-semibold text-stellar mb-3">
              Current Stage *
            </label>
            <div className="space-y-3">
              {stages.map((stage) => (
                <label key={stage.value} className="flex items-start space-x-3 cursor-pointer group">
                  <input
                    {...register('stage')}
                    type="radio"
                    value={stage.value}
                    className="mt-1 w-4 h-4 text-teal border-medium-grey/30 focus:ring-teal/20"
                  />
                  <div className="flex-1">
                    <div className="font-inter font-medium text-stellar group-hover:text-teal transition-colors">
                      {stage.label}
                    </div>
                    <div className="text-sm text-dark-grey font-inter">
                      {stage.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
            {errors.stage && (
              <p className="mt-1 text-sm text-red-500 font-inter">{errors.stage.message}</p>
            )}
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-poppins font-semibold text-stellar mb-2">
              Website *
            </label>
            <input
              {...register('website')}
              type="url"
              className="w-full px-4 py-3 rounded-xl border border-medium-grey/30 focus:border-teal focus:ring-2 focus:ring-teal/20 transition-all duration-200 font-inter bg-white/50 backdrop-blur-sm"
              placeholder="https://yourstartu.com"
            />
            {errors.website && (
              <p className="mt-1 text-sm text-red-500 font-inter">{errors.website.message}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-poppins font-semibold text-stellar mb-2">
              Location *
            </label>
            <input
              {...register('location')}
              className="w-full px-4 py-3 rounded-xl border border-medium-grey/30 focus:border-teal focus:ring-2 focus:ring-teal/20 transition-all duration-200 font-inter bg-white/50 backdrop-blur-sm"
              placeholder="San Francisco, CA"
            />
            {errors.location && (
              <p className="mt-1 text-sm text-red-500 font-inter">{errors.location.message}</p>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Funding Ask */}
          <div>
            <label className="block text-sm font-poppins font-semibold text-stellar mb-2">
              Funding Ask *
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  {...register('fundingAskMin', { valueAsNumber: true })}
                  type="number"
                  className="w-full px-4 py-3 rounded-xl border border-medium-grey/30 focus:border-teal focus:ring-2 focus:ring-teal/20 transition-all duration-200 font-inter bg-white/50 backdrop-blur-sm"
                  placeholder="Min ($)"
                />
                {errors.fundingAskMin && (
                  <p className="mt-1 text-sm text-red-500 font-inter">{errors.fundingAskMin.message}</p>
                )}
              </div>
              <div>
                <input
                  {...register('fundingAskMax', { valueAsNumber: true })}
                  type="number"
                  className="w-full px-4 py-3 rounded-xl border border-medium-grey/30 focus:border-teal focus:ring-2 focus:ring-teal/20 transition-all duration-200 font-inter bg-white/50 backdrop-blur-sm"
                  placeholder="Max ($)"
                />
                {errors.fundingAskMax && (
                  <p className="mt-1 text-sm text-red-500 font-inter">{errors.fundingAskMax.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Brief Pitch */}
          <div>
            <label className="block text-sm font-poppins font-semibold text-stellar mb-2">
              Brief Pitch *
            </label>
            <textarea
              {...register('briefPitch')}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-medium-grey/30 focus:border-teal focus:ring-2 focus:ring-teal/20 transition-all duration-200 font-inter bg-white/50 backdrop-blur-sm resize-none"
              placeholder="Describe your startup in 2-3 sentences. What problem do you solve and how?"
            />
            <div className="flex justify-between mt-1">
              {errors.briefPitch ? (
                <p className="text-sm text-red-500 font-inter">{errors.briefPitch.message}</p>
              ) : (
                <p className="text-sm text-medium-grey font-inter">
                  {watchedValues.briefPitch?.length || 0}/500 characters
                </p>
              )}
            </div>
          </div>

          {/* Team Size (Optional) */}
          <div>
            <label className="block text-sm font-poppins font-semibold text-stellar mb-2">
              Team Size <span className="text-medium-grey font-normal">(Optional)</span>
            </label>
            <input
              {...register('teamSize', { valueAsNumber: true })}
              type="number"
              min="1"
              className="w-full px-4 py-3 rounded-xl border border-medium-grey/30 focus:border-teal focus:ring-2 focus:ring-teal/20 transition-all duration-200 font-inter bg-white/50 backdrop-blur-sm"
              placeholder="Number of team members"
            />
          </div>

          {/* Traction Metrics (Optional) */}
          <div>
            <label className="block text-sm font-poppins font-semibold text-stellar mb-2">
              Traction Metrics <span className="text-medium-grey font-normal">(Optional)</span>
            </label>
            <textarea
              {...register('tractionMetrics')}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-medium-grey/30 focus:border-teal focus:ring-2 focus:ring-teal/20 transition-all duration-200 font-inter bg-white/50 backdrop-blur-sm resize-none"
              placeholder="Revenue, users, growth rate, partnerships, etc."
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-8 pt-6 border-t border-medium-grey/20">
        <button
          type="button"
          onClick={handleSaveDraft}
          disabled={isLoading}
          className="w-full sm:w-auto mb-4 sm:mb-0 px-6 py-3 border border-medium-grey/30 text-dark-grey hover:text-stellar hover:border-stellar/30 rounded-xl font-inter font-medium transition-all duration-200 bg-white/50 backdrop-blur-sm"
        >
          {isDraft ? 'Saving Draft...' : 'Save Draft'}
        </button>

        <div className="flex space-x-4 w-full sm:w-auto">
          <button
            type="button"
            className="flex-1 sm:flex-none px-6 py-3 border border-medium-grey/30 text-dark-grey hover:text-stellar hover:border-stellar/30 rounded-xl font-inter font-medium transition-all duration-200 bg-white/50 backdrop-blur-sm"
          >
            Preview Profile
          </button>
          <button
            type="submit"
            disabled={!isValid || isLoading}
            className={`flex-1 sm:flex-none px-8 py-3 rounded-xl font-inter font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
              isValid && !isLoading
                ? 'bg-teal hover:bg-teal/90 text-white'
                : 'bg-medium-grey text-white cursor-not-allowed'
            }`}
          >
            {isLoading ? 'Creating Profile...' : 'Complete Profile'}
          </button>
        </div>
      </div>
    </form>
  )
}