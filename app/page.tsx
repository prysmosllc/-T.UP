'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Page() {
  const router = useRouter()

  const handleGetStarted = () => {
    // Navigate to the main experience onboarding
    router.push('/experiences/demo/onboarding')
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-neutral-50 via-white to-primary-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Primary gradient orbs */}
        <motion.div
          className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-primary-400/20 to-secondary-400/20 rounded-full blur-3xl"
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
          className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-tr from-accent-400/20 to-primary-400/20 rounded-full blur-3xl"
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
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-secondary-400/10 to-accent-400/10 rounded-full blur-2xl"
          animate={{
            scale: [0.8, 1.3, 0.8],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="sticky top-0 z-50 glass-card border-b border-white/20 shadow-soft"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center shadow-soft">
                  <span className="text-white font-display font-bold text-xl">T</span>
                </div>
                <h1 className="text-2xl font-display font-bold text-neutral-900">T.UP</h1>
              </div>
              <div className="text-sm text-neutral-500 font-body">
                Founder-Investor Matching
              </div>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl w-full">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center mb-16"
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="inline-block mb-8"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-3xl flex items-center justify-center shadow-soft mx-auto mb-6">
                  <span className="text-white text-4xl">⭐</span>
                </div>
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-display font-bold text-neutral-900 mb-6">
                Welcome to <span className="text-gradient bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">T.UP</span>
              </h1>

              <p className="text-xl md:text-2xl text-neutral-600 font-body max-w-2xl mx-auto leading-relaxed">
                Let's get you set up with a profile to start <span className="font-semibold text-primary-600">matching</span>
              </p>
            </motion.div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGetStarted}
                className="inline-flex items-center px-12 py-5 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-xl font-semibold rounded-2xl shadow-hard hover:shadow-glow-primary transition-all duration-300"
              >
                <span>Get Started</span>
                <svg className="ml-3 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </motion.button>

              {/* Feature highlights */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
              >
                <div className="glass-card rounded-3xl p-6 shadow-soft">
                  <div className="w-12 h-12 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-2xl flex items-center justify-center mb-4 shadow-soft">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-display font-bold text-neutral-900 mb-2">Fast Matching</h3>
                  <p className="text-neutral-600 font-body">Connect with the perfect founder or investor in minutes</p>
                </div>

                <div className="glass-card rounded-3xl p-6 shadow-soft">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center mb-4 shadow-soft">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-display font-bold text-neutral-900 mb-2">Verified Partners</h3>
                  <p className="text-neutral-600 font-body">All profiles are verified for quality and authenticity</p>
                </div>

                <div className="glass-card rounded-3xl p-6 shadow-soft">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent-400 to-accent-600 rounded-2xl flex items-center justify-center mb-4 shadow-soft">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-display font-bold text-neutral-900 mb-2">Smart Algorithm</h3>
                  <p className="text-neutral-600 font-body">AI-powered matching for better startup-investor fit</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="text-center py-8 text-neutral-500 text-sm font-body"
        >
          <p>© 2024 T.UP. Connecting founders and investors globally.</p>
        </motion.footer>
      </div>
    </div>
  );
}