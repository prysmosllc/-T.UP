import { whopSdk } from "@/lib/whop-sdk";
import { verifyUserAccess } from "@/lib/auth";
import { headers } from "next/headers";
import { ProfileCreation } from "@/components/profile/ProfileCreation";
import { Role } from "@prisma/client";

export default async function ProfileCreatePage({
	params,
	searchParams,
}: {
	params: Promise<{ experienceId: string }>;
	searchParams: Promise<{ role?: string }>;
}) {
	// The headers contains the user token
	const headersList = await headers();

	// The experienceId is a path param
	const { experienceId } = await params;
	const { role } = await searchParams;

	// Verify user authentication and access
	const authResult = await verifyUserAccess(headersList, experienceId);

	// Handle authentication errors
	if ('error' in authResult) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-light-grey via-white to-light-grey flex justify-center items-center px-4">
				<div className="text-center max-w-md w-full">
					<div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
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
			<div className="min-h-screen bg-gradient-to-br from-light-grey via-white to-light-grey flex justify-center items-center px-4">
				<div className="text-center max-w-md w-full">
					<div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
						<h1 className="text-2xl font-poppins font-bold text-gold mb-4">No Access</h1>
						<p className="text-dark-grey font-inter">You do not have access to this experience.</p>
					</div>
				</div>
			</div>
		);
	}

	// Validate role parameter
	const validRole = role?.toUpperCase() as Role;
	if (!validRole || !Object.values(Role).includes(validRole)) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-light-grey via-white to-light-grey flex justify-center items-center px-4">
				<div className="text-center max-w-md w-full">
					<div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
						<h1 className="text-2xl font-poppins font-bold text-stellar mb-4">Invalid Role</h1>
						<p className="text-dark-grey font-inter mb-6">Please select a valid role to continue.</p>
						<a 
							href={`/experiences/${experienceId}/onboarding`}
							className="inline-block bg-teal hover:bg-teal/90 text-white font-inter font-bold py-3 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
						>
							Back to Role Selection
						</a>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-light-grey via-white to-light-grey">
			<ProfileCreation 
				userId={authResult.userId} 
				experienceId={experienceId}
				role={validRole}
			/>
		</div>
	);
}