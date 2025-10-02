import { Role, ActionType, ReportStatus } from '@prisma/client'

export interface UserProfile {
  id: string
  userId: string
  experienceId: string
  role: Role
  isComplete: boolean
  data: FounderProfileData | InvestorProfileData
  createdAt: Date
  updatedAt: Date
}

export interface FounderProfileData {
  startupName: string
  industry: string
  stage: 'idea' | 'mvp' | 'pmf'
  fundingAsk: { min: number; max: number }
  briefPitch: string
  website: string
  location: string
  teamSize?: number
  tractionMetrics?: string
  pitchDeckUrl?: string
}

export interface InvestorProfileData {
  sectors: string[]
  checkSize: { min: number; max: number }
  stages: string[]
  geography: string[]
  introNote: string
  portfolioLinks?: string[]
  theses?: string
}

export interface FilterCriteria {
  // For founders filtering investors
  investorSectors?: string[]
  checkSizeRange?: { min: number; max: number }
  stagePreferences?: string[]
  geography?: string[]
  
  // For investors filtering founders
  industry?: string[]
  stage?: string[]
  location?: string[]
  revenueRange?: { min: number; max: number }
}

export interface MatchWithProfiles {
  id: string
  user1Id: string
  user2Id: string
  experienceId: string
  threadId: string
  createdAt: Date
  user1Profile: UserProfile
  user2Profile: UserProfile
}

export interface ThreadWithMessages {
  id: string
  matchId: string
  createdAt: Date
  lastMessageAt: Date
  messages: MessageWithSender[]
}

export interface MessageWithSender {
  id: string
  threadId: string
  senderId: string
  content: string
  attachments: string[]
  createdAt: Date
  senderName?: string
}

export type AccessLevel = 'admin' | 'customer' | 'no_access'

export { Role, ActionType, ReportStatus }