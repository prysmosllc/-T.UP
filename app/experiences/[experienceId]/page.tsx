import { whopSdk } from "@/lib/whop-sdk";
import { getAuthHeaders } from "@/lib/hooks/useAuth";
import { db } from "@/lib/db";

export default async function ExperiencePage({
	params,
}: {
	params: Promise<{ experienceId: string }>;
}) {
	// The experienceId is a path param
	const { experienceId } = await params;

	// Get authenticated user info from middleware headers
	const authResult = await getAuthHeaders();

	// If no auth info (shouldn't happen due to middleware), show error
	if (!authResult) {
		return (
			<div className="min-h-screen bg-light-grey flex justify-center items-center px-4">
				<div className="text-center max-w-md w-full">
					<div className="bg-white rounded-lg shadow-lg p-8 border border-medium-grey/20">
						<h1 className="text-2xl font-poppins font-bold text-stellar mb-4">Authentication Error</h1>
						<p className="text-dark-grey font-inter">Unable to verify authentication. Please try again.</p>
					</div>
				</div>
			</div>
		);
	}

	// Check if user has a profile
	const profile = await db.profile.findUnique({
		where: {
			userId_experienceId: {
				userId: authResult.userId,
				experienceId: experienceId,
			},
		},
	});

	// If no profile exists, show the beautiful welcome page
	if (!profile) {
		return (
			<div className="min-h-screen bg-white flex justify-center items-center px-6">
				<div className="max-w-4xl mx-auto text-center">

					{/* Header */}
					<header className="mb-16">
						<div className="flex items-center justify-center mb-8">
							<div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center shadow-xl">
								<span className="text-white font-bold text-2xl">T</span>
							</div>
							<h1 className="text-4xl font-bold text-slate-900 ml-4">T.UP</h1>
						</div>
						<div className="text-slate-600 text-lg font-medium">Founder-Investor Matching Platform</div>
					</header>

					{/* Main Content */}
					<main className="space-y-12">
						{/* Hero Section */}
						<div className="space-y-8">
							<h2 className="text-6xl md:text-7xl font-bold text-slate-900 leading-tight">
								Ready to Start <span className="text-slate-900 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Matching</span>?
							</h2>
							<p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
								Create your professional profile and get matched with verified partners in the startup ecosystem.
							</p>
						</div>

						{/* CTA Button */}
						<div className="flex justify-center">
							<a
								href={`/experiences/${experienceId}/onboarding`}
								className="inline-flex items-center px-12 py-4 bg-slate-900 hover:bg-slate-800 text-white text-xl font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-slate-900"
							>
								<span>Get Started</span>
								<svg className="ml-3 w-6 h-6" fill="none" stroke="white" strokeWidth={2} viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
								</svg>
							</a>
						</div>

						{/* Features Grid */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
							<div className="bg-slate-50 rounded-xl p-8 border border-slate-200 hover:border-slate-300 transition-colors duration-300">
								<div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center mb-6 shadow-lg">
									<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
									</svg>
								</div>
								<h3 className="text-xl font-bold text-slate-900 mb-3">Fast Matching</h3>
								<p className="text-slate-600 leading-relaxed">Smart algorithm connects you with relevant partners within minutes of setup.</p>
							</div>

							<div className="bg-slate-50 rounded-xl p-8 border border-slate-200 hover:border-slate-300 transition-colors duration-300">
								<div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-6 shadow-lg">
									<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
								</div>
								<h3 className="text-xl font-bold text-slate-900 mb-3">Verified Partners</h3>
								<p className="text-slate-600 leading-relaxed">All profiles undergo verification for quality and legitimacy in the ecosystem.</p>
							</div>

							<div className="bg-slate-50 rounded-xl p-8 border border-slate-200 hover:border-slate-300 transition-colors duration-300">
								<div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-6 shadow-lg">
									<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
									</svg>
								</div>
								<h3 className="text-xl font-bold text-slate-900 mb-3">Smart Algorithm</h3>
								<p className="text-slate-600 leading-relaxed">AI-powered matching considers multiple factors for the perfect partnership.</p>
							</div>
						</div>
					</main>

					{/* Footer */}
					<footer className="mt-20 pt-8 border-t border-slate-200">
						<p className="text-slate-500 text-sm">© 2024 T.UP. Connecting founders and investors globally.</p>
					</footer>
				</div>
			</div>
		);
	}

	// Get user and experience details
	const user = await whopSdk.users.getUser({ userId: authResult.userId });
	const experience = await whopSdk.experiences.getExperience({ experienceId });

	return (
		<div className="min-h-screen bg-light-grey flex justify-center items-center px-4">
			<div className="text-center max-w-2xl w-full">
				<h1 className="text-4xl font-poppins font-bold mb-8 text-stellar">
					Welcome to ⭐ T.UP
				</h1>
				<p className="text-lg text-dark-grey mb-8 font-inter">
					Connect founders with investors through intelligent matching
				</p>

				<div className="bg-white rounded-lg shadow-lg p-6 mb-6 border border-medium-grey/20">
					<h2 className="text-xl font-poppins font-semibold mb-4 text-stellar">User Information</h2>
					<div className="space-y-3 text-left">
						<div className="flex justify-between items-center">
							<span className="font-inter font-medium text-dark-grey">Name:</span>
							<span className="text-stellar font-inter">{user.name}</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="font-inter font-medium text-dark-grey">Username:</span>
							<span className="text-stellar font-inter">@{user.username}</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="font-inter font-medium text-dark-grey">User ID:</span>
							<span className="text-stellar font-inter text-sm">{authResult.userId}</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="font-inter font-medium text-dark-grey">Access Level:</span>
							<span className={`px-3 py-1 rounded-full text-sm font-inter font-medium ${authResult.accessLevel === 'admin'
								? 'bg-gold text-stellar'
								: 'bg-teal text-white'
								}`}>
								{authResult.accessLevel}
							</span>
						</div>
					</div>
				</div>

				<div className="bg-white rounded-lg shadow-lg p-6 mb-8 border border-medium-grey/20">
					<h2 className="text-xl font-poppins font-semibold mb-4 text-stellar">Experience Details</h2>
					<div className="space-y-3 text-left">
						<div className="flex justify-between items-center">
							<span className="font-inter font-medium text-dark-grey">Experience:</span>
							<span className="text-stellar font-inter">{experience.name}</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="font-inter font-medium text-dark-grey">Experience ID:</span>
							<span className="text-stellar font-inter text-sm">{experienceId}</span>
						</div>
					</div>
				</div>

				<div className="space-y-4">
					<p className="text-dark-grey mb-6 font-inter">
						Ready to connect founders with investors? Let's get started!
					</p>
					<button className="bg-teal hover:bg-teal/90 text-white font-inter font-bold py-3 px-8 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl">
						Start Matching
					</button>
				</div>
			</div>
		</div>
	);
}
