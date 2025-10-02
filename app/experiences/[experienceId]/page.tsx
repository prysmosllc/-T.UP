import { whopSdk } from "@/lib/whop-sdk";
import { verifyUserAccess } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";

export default async function ExperiencePage({
	params,
}: {
	params: Promise<{ experienceId: string }>;
}) {
	// The headers contains the user token
	const headersList = await headers();

	// The experienceId is a path param
	const { experienceId } = await params;

	// Verify user authentication and access
	const authResult = await verifyUserAccess(headersList, experienceId);

	// Handle authentication errors
	if ('error' in authResult) {
		return (
			<div className="min-h-screen bg-light-grey flex justify-center items-center px-4">
				<div className="text-center max-w-md w-full">
					<div className="bg-white rounded-lg shadow-lg p-8 border border-medium-grey/20">
						<h1 className="text-2xl font-poppins font-bold text-stellar mb-4">Access Denied</h1>
						<p className="text-dark-grey font-inter">{authResult.error}</p>
					</div>
				</div>
			</div>
		);
	}

	// If no access, show appropriate message
	if (!authResult.hasAccess) {
		return (
			<div className="min-h-screen bg-light-grey flex justify-center items-center px-4">
				<div className="text-center max-w-md w-full">
					<div className="bg-white rounded-lg shadow-lg p-8 border border-medium-grey/20">
						<h1 className="text-2xl font-poppins font-bold text-gold mb-4">No Access</h1>
						<p className="text-dark-grey font-inter">You do not have access to this experience.</p>
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

	// If no profile exists, redirect to onboarding
	if (!profile) {
		return (
			<div className="min-h-screen bg-light-grey flex justify-center items-center px-4">
				<div className="text-center max-w-md w-full">
					<div className="bg-white rounded-lg shadow-lg p-8 border border-medium-grey/20">
						<h1 className="text-2xl font-poppins font-bold text-stellar mb-4">Welcome to ⭐ T.UP</h1>
						<p className="text-dark-grey font-inter mb-6">Let's get you set up with a profile to start matching!</p>
						<a 
							href={`/experiences/${experienceId}/onboarding`}
							className="inline-block bg-teal hover:bg-teal/90 text-white font-inter font-bold py-3 px-8 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
						>
							Get Started
						</a>
					</div>
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
							<span className={`px-3 py-1 rounded-full text-sm font-inter font-medium ${
								authResult.accessLevel === 'admin' 
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
