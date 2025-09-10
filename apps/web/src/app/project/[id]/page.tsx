"use client";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { trpcClient } from "@/utils/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useEffect } from "react";
import { toast } from "sonner";

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

export default function ProjectDetail() {
	const params = useParams();
	const router = useRouter();
	const { data: session, isPending } = authClient.useSession();
	const queryClient = useQueryClient();
	const projectId = params.id as string;

	// Fetch specific project
	const projectQuery = useQuery<Project>({
		queryKey: ['project', projectId],
		queryFn: () => trpcClient.getProject.query({ id: projectId }),
		enabled: !!projectId,
	});

	// Delete project mutation
	const deleteProjectMutation = useMutation({
		mutationFn: async (projectId: string) => {
			return await trpcClient.deleteProject.mutate({ id: projectId });
		},
		onSuccess: () => {
			// Invalidate projects list and redirect to dashboard
			queryClient.invalidateQueries({ queryKey: ['projects'] });
			toast.success("Project deleted successfully!");
			router.push('/dashboard');
		},
		onError: (error: any) => {
			toast.error(error.message || "Failed to delete project");
		}
	});

	const handleDeleteProject = async (projectName: string) => {
		if (window.confirm(`Are you sure you want to delete "${projectName}"? This action cannot be undone.`)) {
			deleteProjectMutation.mutate(projectId);
		}
	};

	useEffect(() => {
		if (!session && !isPending) {
			router.push("/login");
		}
	}, [session, isPending, router]);

	if (isPending) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
			</div>
		);
	}

	if (projectQuery.isLoading) {
		return (
			<div className="container mx-auto max-w-4xl px-4 py-8">
				<div className="animate-pulse space-y-6">
					<div className="h-8 bg-gray-200 rounded w-1/3"></div>
					<div className="h-4 bg-gray-200 rounded w-1/2"></div>
					<Card>
						<CardHeader>
							<div className="h-6 bg-gray-200 rounded w-1/4"></div>
							<div className="h-4 bg-gray-200 rounded w-1/3"></div>
						</CardHeader>
						<CardContent>
							<div className="space-y-2">
								<div className="h-4 bg-gray-200 rounded"></div>
								<div className="h-4 bg-gray-200 rounded w-5/6"></div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	if (projectQuery.error) {
		return (
			<div className="container mx-auto max-w-4xl px-4 py-8">
				<Card>
					<CardContent className="pt-6">
						<div className="text-center text-red-600">
							Failed to load project: {projectQuery.error.message}
						</div>
						<div className="flex justify-center mt-4">
							<Button onClick={() => router.push('/dashboard')}>
								Back to Dashboard
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	const project = projectQuery.data;

	if (!project) {
		return (
			<div className="container mx-auto max-w-4xl px-4 py-8">
				<Card>
					<CardContent className="pt-6">
						<div className="text-center">
							<h2 className="text-lg font-medium mb-2">Project not found</h2>
							<p className="text-muted-foreground mb-4">
								The project you're looking for doesn't exist or you don't have access to it.
							</p>
							<Button onClick={() => router.push('/dashboard')}>
								Back to Dashboard
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="container mx-auto max-w-4xl px-4 py-8">
			{/* Header */}
			<div className="mb-6">
				<Button 
					variant="outline" 
					onClick={() => router.push('/dashboard')}
					className="mb-4"
				>
					← Back to Dashboard
				</Button>
				<h1 className="text-3xl font-bold mb-2">{project.name}</h1>
				<p className="text-muted-foreground">Project details and metadata</p>
			</div>

			{/* Project Info */}
			<div className="grid gap-6">
				<Card>
					<CardHeader>
						<CardTitle>Project Information</CardTitle>
						<CardDescription>Basic details about this project</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<label className="text-sm font-medium">Project Name</label>
							<p className="text-lg">{project.name}</p>
						</div>
						<div>
							<label className="text-sm font-medium">Project ID</label>
							<p className="text-sm text-muted-foreground font-mono">{project.id}</p>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Owner Information</CardTitle>
						<CardDescription>Details about the project owner</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="text-sm font-medium">Owner Name</label>
								<p>{project.owner.name}</p>
							</div>
							<div>
								<label className="text-sm font-medium">Owner Email</label>
								<p>{project.owner.email}</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<div className="flex items-center justify-between">
							<div>
								<CardTitle>Project Metadata</CardTitle>
								<CardDescription>Additional information and attributes for this project</CardDescription>
							</div>
							<div className="flex items-center gap-2">
								<span className="text-sm text-muted-foreground">
									{project.metadata.length} {project.metadata.length === 1 ? 'item' : 'items'}
								</span>
								<Button
									variant="outline"
									size="sm"
									onClick={() => router.push(`/project/${project.id}/edit`)}
								>
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
										<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
										<path d="m15 5 4 4"/>
									</svg>
									Edit Metadata
								</Button>
							</div>
						</div>
					</CardHeader>
					<CardContent>
						{project.metadata.length > 0 ? (
							<div className="space-y-4">
								{project.metadata.map((meta, index) => (
									<div key={meta.id} className="group relative border rounded-xl p-6 hover:shadow-md transition-all duration-200 bg-gradient-to-r from-background to-muted/20">
										<div className="flex items-start gap-4">
											{/* Icon Section */}
											<div className="flex-shrink-0">
												{meta.icon ? (
													<div className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary/10 text-2xl">
														{meta.icon}
													</div>
												) : (
													<div className="w-12 h-12 flex items-center justify-center rounded-lg bg-muted border-2 border-dashed border-muted-foreground/30">
														<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
															<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
															<circle cx="9" cy="9" r="2"/>
															<path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
														</svg>
													</div>
												)}
											</div>

											{/* Content Section */}
											<div className="flex-1 min-w-0">
												<div className="flex items-start justify-between mb-2">
													<h4 className="font-semibold text-lg">
														{meta.description ? meta.description : `Metadata Item ${index + 1}`}
													</h4>
													<div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
														<span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
															#{index + 1}
														</span>
													</div>
												</div>
												
												{meta.description && (
													<p className="text-muted-foreground text-sm mb-3 leading-relaxed">
														{meta.description}
													</p>
												)}

												{/* Metadata Details */}
												<div className="space-y-2">
													{meta.icon && (
														<div className="flex items-center gap-2 text-sm">
															<span className="text-muted-foreground font-medium">Icon:</span>
															<code className="bg-muted px-2 py-1 rounded text-xs font-mono">
																{meta.icon}
															</code>
														</div>
													)}
													<div className="flex items-center gap-2 text-xs text-muted-foreground">
														<span className="font-medium">Metadata ID:</span>
														<code className="bg-muted/50 px-2 py-1 rounded font-mono">
															{meta.id}
														</code>
													</div>
												</div>
											</div>
										</div>

										{/* Quick Actions (visible on hover) */}
										<div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
											<Button
												variant="ghost"
												size="sm"
												onClick={() => {
													navigator.clipboard.writeText(meta.id);
													toast.success("Metadata ID copied to clipboard");
												}}
												className="h-8 w-8 p-0"
											>
												<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
													<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
													<path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
												</svg>
											</Button>
										</div>
									</div>
								))}
							</div>
						) : (
							<div className="text-center py-12">
								<div className="mx-auto w-24 h-24 mb-4 flex items-center justify-center rounded-full bg-muted/50">
									<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
										<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
									</svg>
								</div>
								<h3 className="text-lg font-medium mb-2">No metadata found</h3>
								<p className="text-muted-foreground mb-4 max-w-sm mx-auto">
									This project doesn't have any metadata items yet. Add some to provide additional context and information.
								</p>
								<Button 
									onClick={() => router.push(`/project/${project.id}/edit`)}
									variant="outline"
								>
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
										<path d="M5 12h14"/>
										<path d="M12 5v14"/>
									</svg>
									Add Metadata
								</Button>
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Actions */}
			<div className="flex gap-4 mt-6">
				<Button onClick={() => router.push('/dashboard')}>
					Back to Dashboard
				</Button>
				<Button 
					variant="outline" 
					onClick={() => router.push(`/project/${project.id}/edit`)}
				>
					Edit Project
				</Button>
				<Button 
					variant="destructive" 
					onClick={() => handleDeleteProject(project.name)}
					disabled={deleteProjectMutation.isPending}
				>
					{deleteProjectMutation.isPending ? (
						<div className="flex items-center gap-2">
							<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
							Deleting...
						</div>
					) : (
						"Delete Project"
					)}
				</Button>
			</div>
		</div>
	);
}
