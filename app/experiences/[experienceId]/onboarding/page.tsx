import { whopSdk } from "@/lib/whop-sdk";
import { verifyUserAccess } from "@/lib/auth";
import { headers } from "next/headers";
import { RoleSelection } from "@/components/onboarding/RoleSelection";

export default async function OnboardingPage({
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

	return (
		<div className="min-h-screen bg-light-grey">
			<RoleSelection 
				userId={authResult.userId} 
				experienceId={experienceId}
			/>
		</div>
	);
}