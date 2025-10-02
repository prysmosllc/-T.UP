'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ProfilePreview } from './ProfilePreview'
import { useToast } from '@/components/ui/Toast'
import { Role } from '@prisma/client'
import type { InvestorProfileData } from '@/lib/types'

const investorSchema = z.object({
  sectors: z.array(z.string()).min(1, 'Please select at least one sector'),
  checkSizeMin: z.number().min(1000, 'Minimum check size must be at least $1,000'),
  checkSizeMax: z.number().min(1000, 'Maximum check size must be at least $1,000'),
  stages: z.array(z.string()).min(1, 'Please select at least one stage'),
  geography: z.array(z.string()).min(1, 'Please select at least one geography'),
  introNote: z.string().min(50, 'Introduction must be at least 50 characters').max(500, 'Introduction must be less than 500 characters'),
  portfolioLinks: z.string().optional(),
  theses: z.string().optional(),
}).refine((data) => data.checkSizeMax >= data.checkSizeMin, {
  message: 'Maximum check size must be greater than or equal to minimum check size',
  path: ['checkSizeMax'],
})

type InvestorFormData = z.infer<typeof investorSchema>

interface InvestorProfileFormProps {
  userId: string
  experienceId: string
}

const sectors = [
  'Technology', 'Healthcare', 'Finance', 'E-commerce', 'Education', 'Real Estate',
  'Manufacturing', 'Energy', 'Transportation', 'Food & Beverage', 'Entertainment',
  'Agriculture', 'Biotechnology', 'Cybersecurity', 'AI/ML', 'Blockchain', 'Climate Tech'
]

const investmentStages = [
  'Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C+', 'Growth', 'Late Stage'
]

const geographies = [
  'North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East', 'Africa', 'Global'
]

export function InvestorProfileForm({ userId, experienceId }: InvestorProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isDraft, setIsDraft] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const router = useRouter()
  const toast = useToast()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors, isValid }
  } = useForm<InvestorFormData>({
    resolver: zodResolver(investorSchema),
    mode: 'onChange',
    defaultValues: {
      sectors: [],
      stages: [],
      geography: []
    }
  })

  const watchedValues = watch()

  const handleArrayToggle = (field: 'sectors' | 'stages' | 'geography', value: string) => {
    const currentValues = getValues(field) || []
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value]
    setValue(field, newValues, { shouldValidate: true })
  }

  const onSubmit = async (data: InvestorFormData, saveAsDraft = false) => {
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
          role: 'INVESTOR',
          data: {
            ...data,
            checkSize: {
              min: data.checkSizeMin,
              max: data.checkSizeMax
            },
            portfolioLinks: data.portfolioLinks ? data.portfolioLinks.split('\n').filter(link => link.trim()) : []
          },
          isComplete: !saveAsDraft
        }),
      })

      if (response.ok) {
        if (saveAsDraft) {
          toast.success('Profile saved as draft!')
        } else {
          toast.success('Profile created successfully!')
          setTimeout(() => {
            router.push(`/experiences/${experienceId}/discovery`)
          }, 1000)
        }
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save profile')
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      toast.error(error instanceof Error ? error.message : 'Error saving profile. Please try again.')
    } finally {
      setIsLoading(false)
      setIsDraft(false)
    }
  }

  const handleSaveDraft = () => {
    handleSubmit((data) => onSubmit(data, true))()
  }

  const handlePreview = () => {
    const values = getValues()
    if (!values.sectors || values.sectors.length === 0 || !values.introNote) {
      toast.warning('Please fill in at least the sectors and introduction to preview')
      return
    }
    setShowPreview(true)
  }

  return (
    <>
      <form onSubmit={handleSubmit((data) => onSubmit(data, false))} className="p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Investment Sectors */}
          <div>
            <label className="block text-sm font-poppins font-semibold text-stellar mb-3">
              Investment Sectors *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {sectors.map((sector) => (
                <label key={sector} className="flex items-center space-x-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={watchedValues.sectors?.includes(sector) || false}
                    onChange={() => handleArrayToggle('sectors', sector)}
                    className="w-4 h-4 text-gold border-medium-grey/30 rounded focus:ring-gold/20"
                  />
                  <span className="text-sm font-inter text-dark-grey group-hover:text-stellar transition-colors">
                    {sector}
                  </span>
                </label>
              ))}
            </div>
            {errors.sectors && (
              <p className="mt-1 text-sm text-red-500 font-inter">{errors.sectors.message}</p>
            )}
          </div>

          {/* Investment Stages */}
          <div>
            <label className="block text-sm font-poppins font-semibold text-stellar mb-3">
              Investment Stages *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {investmentStages.map((stage) => (
                <label key={stage} className="flex items-center space-x-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={watchedValues.stages?.includes(stage) || false}
                    onChange={() => handleArrayToggle('stages', stage)}
                    className="w-4 h-4 text-gold border-medium-grey/30 rounded focus:ring-gold/20"
                  />
                  <span className="text-sm font-inter text-dark-grey group-hover:text-stellar transition-colors">
                    {stage}
                  </span>
                </label>
              ))}
            </div>
            {errors.stages && (
              <p className="mt-1 text-sm text-red-500 font-inter">{errors.stages.message}</p>
            )}
          </div>

          {/* Geography */}
          <div>
            <label className="block text-sm font-poppins font-semibold text-stellar mb-3">
              Geographic Focus *
            </label>
            <div className="space-y-2">
              {geographies.map((geo) => (
                <label key={geo} className="flex items-center space-x-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={watchedValues.geography?.includes(geo) || false}
                    onChange={() => handleArrayToggle('geography', geo)}
                    className="w-4 h-4 text-gold border-medium-grey/30 rounded focus:ring-gold/20"
                  />
                  <span className="text-sm font-inter text-dark-grey group-hover:text-stellar transition-colors">
                    {geo}
                  </span>
                </label>
              ))}
            </div>
            {errors.geography && (
              <p className="mt-1 text-sm text-red-500 font-inter">{errors.geography.message}</p>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Check Size */}
          <div>
            <label className="block text-sm font-poppins font-semibold text-stellar mb-2">
              Check Size Range *
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  {...register('checkSizeMin', { valueAsNumber: true })}
                  type="number"
                  className="w-full px-4 py-3 rounded-xl border border-medium-grey/30 focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all duration-200 font-inter bg-white/50 backdrop-blur-sm"
                  placeholder="Min ($)"
                />
                {errors.checkSizeMin && (
                  <p className="mt-1 text-sm text-red-500 font-inter">{errors.checkSizeMin.message}</p>
                )}
              </div>
              <div>
                <input
                  {...register('checkSizeMax', { valueAsNumber: true })}
                  type="number"
                  className="w-full px-4 py-3 rounded-xl border border-medium-grey/30 focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all duration-200 font-inter bg-white/50 backdrop-blur-sm"
                  placeholder="Max ($)"
                />
                {errors.checkSizeMax && (
                  <p className="mt-1 text-sm text-red-500 font-inter">{errors.checkSizeMax.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Introduction Note */}
          <div>
            <label className="block text-sm font-poppins font-semibold text-stellar mb-2">
              Introduction Note *
            </label>
            <textarea
              {...register('introNote')}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-medium-grey/30 focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all duration-200 font-inter bg-white/50 backdrop-blur-sm resize-none"
              placeholder="Tell founders about your investment approach, what you look for, and how you add value beyond capital."
            />
            <div className="flex justify-between mt-1">
              {errors.introNote ? (
                <p className="text-sm text-red-500 font-inter">{errors.introNote.message}</p>
              ) : (
                <p className="text-sm text-medium-grey font-inter">
                  {watchedValues.introNote?.length || 0}/500 characters
                </p>
              )}
            </div>
          </div>

          {/* Portfolio Links (Optional) */}
          <div>
            <label className="block text-sm font-poppins font-semibold text-stellar mb-2">
              Portfolio Companies <span className="text-medium-grey font-normal">(Optional)</span>
            </label>
            <textarea
              {...register('portfolioLinks')}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-medium-grey/30 focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all duration-200 font-inter bg-white/50 backdrop-blur-sm resize-none"
              placeholder="List your portfolio companies or investment links (one per line)"
            />
            <p className="mt-1 text-sm text-medium-grey font-inter">
              Enter one company or link per line
            </p>
          </div>

          {/* Investment Theses (Optional) */}
          <div>
            <label className="block text-sm font-poppins font-semibold text-stellar mb-2">
              Investment Theses <span className="text-medium-grey font-normal">(Optional)</span>
            </label>
            <textarea
              {...register('theses')}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-medium-grey/30 focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all duration-200 font-inter bg-white/50 backdrop-blur-sm resize-none"
              placeholder="Share your investment philosophy, market views, or specific theses you're excited about."
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
            onClick={handlePreview}
            className="flex-1 sm:flex-none px-6 py-3 border border-medium-grey/30 text-dark-grey hover:text-stellar hover:border-stellar/30 rounded-xl font-inter font-medium transition-all duration-200 bg-white/50 backdrop-blur-sm"
          >
            Preview Profile
          </button>
          <button
            type="submit"
            disabled={!isValid || isLoading}
            className={`flex-1 sm:flex-none px-8 py-3 rounded-xl font-inter font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
              isValid && !isLoading
                ? 'bg-gold hover:bg-gold/90 text-stellar'
                : 'bg-medium-grey text-white cursor-not-allowed'
            }`}
          >
            {isLoading ? 'Creating Profile...' : 'Complete Profile'}
          </button>
        </div>
      </div>
    </form>

    {/* Profile Preview Modal */}
    {showPreview && (
      <ProfilePreview
        role={Role.INVESTOR}
        data={{
          sectors: watchedValues.sectors || [],
          checkSize: {
            min: watchedValues.checkSizeMin || 0,
            max: watchedValues.checkSizeMax || 0
          },
          stages: watchedValues.stages || [],
          geography: watchedValues.geography || [],
          introNote: watchedValues.introNote || '',
          portfolioLinks: watchedValues.portfolioLinks ? watchedValues.portfolioLinks.split('\n').filter(link => link.trim()) : [],
          theses: watchedValues.theses
        } as InvestorProfileData}
        onClose={() => setShowPreview(false)}
      />
    )}
  </>
  )
}