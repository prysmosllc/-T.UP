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
			<div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-700 to-indigo-800">
				{/* Header */}
				<div className="border-b border-white/20 bg-black/50 backdrop-blur-sm">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex items-center justify-between h-20">
							<div className="flex items-center space-x-4">
								<div className="w-12 h-12 bg-gradient-to-br from-white to-blue-300 rounded-2xl flex items-center justify-center shadow-lg">
									<span className="text-blue-600 font-bold text-xl">T</span>
								</div>
								<h1 className="text-2xl font-bold text-white">T.UP</h1>
							</div>
							<div className="text-sm text-white/80">
								Founder-Investor Matching
							</div>
						</div>
					</div>
				</div>

				{/* Main Content */}
				<div className="flex items-center justify-center min-h-[80vh] px-4 sm:px-6 lg:px-8">
					<div className="max-w-4xl w-full text-center">
						{/* Star Icon */}
						<div className="inline-block mb-8">
							<div className="w-24 h-24 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-3xl flex items-center justify-center mx-auto shadow-2xl border-4 border-white/20">
								<span className="text-4xl">⭐</span>
							</div>
						</div>

						{/* Main Heading */}
						<h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">
							Welcome to <span className="text-yellow-300">⭐ T.UP</span>
						</h1>

						{/* Subheading */}
						<p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto mb-12 leading-relaxed drop-shadow-md font-medium">
							Let's get you set up with a profile to start <span className="font-bold text-yellow-300">matching</span>
						</p>

						{/* Get Started Button */}
						<a
							href={`/experiences/${experienceId}/onboarding`}
							className="inline-flex items-center px-12 py-5 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xl font-bold rounded-2xl shadow-2xl hover:shadow-yellow-400/50 transition-all duration-300 hover:scale-105 border-4 border-white/20"
						>
							<span>Get Started</span>
							<svg className="ml-3 w-6 h-6" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
							</svg>
						</a>

						{/* Feature Grid */}
						<div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
							<div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-2 border-white/30">
								<div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
									<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
									</svg>
								</div>
								<h3 className="text-lg font-bold text-gray-900 mb-2">Fast Matching</h3>
								<p className="text-gray-700 font-medium">Connect with the perfect founder or investor in minutes</p>
							</div>

							<div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-2 border-white/30">
								<div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
									<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
								</div>
								<h3 className="text-lg font-bold text-gray-900 mb-2">Verified Partners</h3>
								<p className="text-gray-700 font-medium">All profiles are verified for quality and authenticity</p>
							</div>

							<div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-2 border-white/30">
								<div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
									<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
									</svg>
								</div>
								<h3 className="text-lg font-bold text-gray-900 mb-2">Smart Algorithm</h3>
								<p className="text-gray-700 font-medium">AI-powered matching for better startup-investor fit</p>
							</div>
						</div>
					</div>
				</div>

				{/* Footer */}
				<footer className="text-center py-8 text-white/80 text-sm">
					<p>© 2024 T.UP. Connecting founders and investors globally.</p>
				</footer>
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
