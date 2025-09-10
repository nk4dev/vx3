"use client";
import { authClient } from "@/lib/auth-client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { trpcClient } from "@/utils/trpc";
import { WalletConnect } from "@/components/wallet-connect";
import { Web3Actions } from "@/components/web3-actions";
import { useAccount, useBalance } from 'wagmi';

interface Project {
	id: string;
	name: string;
	userId: string;
	owner: {
		id: string;
		name: string;
		email: string;
	};
	metadata: {
		id: string;
		icon: string;
		description: string;
		infoId: string;
	}[];
}
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Dashboard() {
	const router = useRouter();
	const { data: session, isPending } = authClient.useSession();
	const queryClient = useQueryClient();
	const { address, isConnected } = useAccount();
	
	const { data: ethBalance } = useBalance({
		address: address,
	});

	// Fetch projects using tRPC client
	const projectsQuery = useQuery<Project[]>({
		queryKey: ['projects'],
		queryFn: () => trpcClient.getProjects.query(),
	});

	// Delete project mutation
	const deleteProjectMutation = useMutation({
		mutationFn: async (projectId: string) => {
			return await trpcClient.deleteProject.mutate({ id: projectId });
		},
		onSuccess: () => {
			// Invalidate and refetch projects
			queryClient.invalidateQueries({ queryKey: ['projects'] });
			toast.success("Project deleted successfully!");
		},
		onError: (error: any) => {
			toast.error(error.message || "Failed to delete project");
		}
	});

	const handleDeleteProject = async (projectId: string, projectName: string) => {
		if (window.confirm(`Are you sure you want to delete "${projectName}"? This action cannot be undone.`)) {
			deleteProjectMutation.mutate(projectId);
		}
	};

	useEffect(() => {
		if (!session && !isPending) {
			router.push("/login");
		}
	}, [session, isPending]);

	if (isPending) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
			</div>
		);
	}

	return (
		<div className="p-6 container mx-auto max-w-7xl">
			{/* Header */}
			<div className="mb-8">
				<h1 className="text-4xl font-bold mb-2">{session?.user.name}'s Dashboard</h1>
				<p className="text-muted-foreground">Manage your projects and track your portfolio</p>
			</div>

			{/* Stats Grid */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">Total Projects</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{projectsQuery.data?.length || 0}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">BTC Balance</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">$0.00</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">ETH Balance</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{isConnected && ethBalance 
								? `${parseFloat(ethBalance.formatted).toFixed(4)} ${ethBalance.symbol}`
								: '$0.00'
							}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Wallet Section */}
			<div className="mb-8">
				<h2 className="text-2xl font-bold mb-6">Wallet</h2>
				<div className="max-w-md">
					<WalletConnect />
				</div>
			</div>

			{/* Projects Section */}
			<div className="mb-8">
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-2xl font-bold">Your Projects</h2>
					<Button
						onClick={() => router.push('/create/project')}
						className="gap-2"
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<path d="M5 12h14"/>
							<path d="M12 5v14"/>
						</svg>
						Create Project
					</Button>
				</div>

				{/* Projects List */}
				{projectsQuery.isLoading ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{[...Array(3)].map((_, i) => (
							<Card key={i} className="animate-pulse">
								<CardHeader>
									<div className="h-4 bg-gray-200 rounded w-3/4"></div>
									<div className="h-3 bg-gray-200 rounded w-1/2"></div>
								</CardHeader>
								<CardContent>
									<div className="space-y-2">
										<div className="h-3 bg-gray-200 rounded"></div>
										<div className="h-3 bg-gray-200 rounded w-5/6"></div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				) : projectsQuery.error ? (
					<Card>
						<CardContent className="pt-6">
							<div className="text-center text-red-600">
								Failed to load projects: {projectsQuery.error.message}
							</div>
						</CardContent>
					</Card>
				) : projectsQuery.data && projectsQuery.data.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{projectsQuery.data.map((project) => (
							<Card key={project.id} className="hover:shadow-lg transition-shadow cursor-pointer">
								<CardHeader>
									<CardTitle className="flex items-center justify-between">
										<span className="truncate">{project.name}</span>
										<span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
											{project.metadata.length} metadata
										</span>
									</CardTitle>
									<CardDescription>
										Owner: {project.owner.name} ({project.owner.email})
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-3">
										{project.metadata.length > 0 && (
											<div>
												<h4 className="text-sm font-medium mb-2">Metadata:</h4>
												<div className="space-y-2">
													{project.metadata.slice(0, 2).map((meta, index) => (
														<div key={meta.id} className="flex items-start gap-2 text-sm">
															{meta.icon && (
																<span className="text-lg" title="Icon">
																	{meta.icon}
																</span>
															)}
															<span className="text-muted-foreground flex-1 line-clamp-2">
																{meta.description || "No description"}
															</span>
														</div>
													))}
													{project.metadata.length > 2 && (
														<div className="text-xs text-muted-foreground">
															+{project.metadata.length - 2} more items
														</div>
													)}
												</div>
											</div>
										)}
										
										<div className="flex gap-2 pt-2">
											<Button
												variant="outline"
												size="sm"
												className="flex-1"
												onClick={(e) => {
													e.stopPropagation();
													router.push(`/project/${project.id}`);
												}}
											>
												View
											</Button>
											<Button
												variant="outline"
												size="sm"
												className="flex-1"
												onClick={(e) => {
													e.stopPropagation();
													router.push(`/project/${project.id}/edit`);
												}}
											>
												Edit
											</Button>
											<Button
												variant="destructive"
												size="sm"
												onClick={(e) => {
													e.stopPropagation();
													handleDeleteProject(project.id, project.name);
												}}
												disabled={deleteProjectMutation.isPending}
											>
												{deleteProjectMutation.isPending ? "..." : "Delete"}
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				) : (
					<Card>
						<CardContent className="pt-6">
							<div className="text-center py-8">
								<div className="mb-4">
									<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-gray-400">
										<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
										<polyline points="14,2 14,8 20,8"/>
										<line x1="16" y1="13" x2="8" y2="13"/>
										<line x1="16" y1="17" x2="8" y2="17"/>
										<polyline points="10,9 9,9 8,9"/>
									</svg>
								</div>
								<h3 className="text-lg font-medium mb-2">No projects yet</h3>
								<p className="text-muted-foreground mb-4">
									Get started by creating your first project
								</p>
								<Button onClick={() => router.push('/create/project')}>
									Create Your First Project
								</Button>
							</div>
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
}
