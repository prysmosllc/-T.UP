import { whopSdk } from "@/lib/whop-sdk";
import { verifyUserAccess } from "@/lib/auth";
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
			<div className="flex justify-center items-center h-screen px-8">
				<div className="text-center">
					<h1 className="text-xl font-bold text-red-600 mb-4">Access Denied</h1>
					<p className="text-gray-600">{authResult.error}</p>
				</div>
			</div>
		);
	}

	// If no access, show appropriate message
	if (!authResult.hasAccess) {
		return (
			<div className="flex justify-center items-center h-screen px-8">
				<div className="text-center">
					<h1 className="text-xl font-bold text-yellow-600 mb-4">No Access</h1>
					<p className="text-gray-600">You do not have access to this experience.</p>
				</div>
			</div>
		);
	}

	// Get user and experience details
	const user = await whopSdk.users.getUser({ userId: authResult.userId });
	const experience = await whopSdk.experiences.getExperience({ experienceId });

	return (
		<div className="flex justify-center items-center h-screen px-8">
			<div className="text-center max-w-2xl">
				<h1 className="text-3xl font-bold mb-6 text-gray-800">
					Welcome to Founder-Investor Matching
				</h1>
				
				<div className="bg-white rounded-lg shadow-lg p-6 mb-6">
					<h2 className="text-xl font-semibold mb-4">User Information</h2>
					<div className="space-y-2 text-left">
						<p><strong>Name:</strong> {user.name}</p>
						<p><strong>Username:</strong> @{user.username}</p>
						<p><strong>User ID:</strong> {authResult.userId}</p>
						<p><strong>Access Level:</strong> 
							<span className={`ml-2 px-2 py-1 rounded text-sm ${
								authResult.accessLevel === 'admin' 
									? 'bg-purple-100 text-purple-800' 
									: 'bg-blue-100 text-blue-800'
							}`}>
								{authResult.accessLevel}
							</span>
						</p>
					</div>
				</div>

				<div className="bg-white rounded-lg shadow-lg p-6">
					<h2 className="text-xl font-semibold mb-4">Experience Details</h2>
					<p><strong>Experience:</strong> {experience.name}</p>
					<p className="text-sm text-gray-600 mt-2">
						Experience ID: {experienceId}
					</p>
				</div>

				<div className="mt-8">
					<p className="text-gray-600 mb-4">
						Ready to connect founders with investors? Let's get started!
					</p>
					<button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
						Start Matching
					</button>
				</div>
			</div>
		</div>
	);
}
