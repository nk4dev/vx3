"use client";
import { authClient } from "@/lib/auth-client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { trpcClient } from "@/utils/trpc";

interface MetadataItem {
    id?: string;
    icon: string;
    description: string;
}

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

export default function EditProject() {
    const params = useParams();
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();
    const projectId = params.id as string;
    
    // Form state
    const [projectName, setProjectName] = useState("");
    const [ownerName, setOwnerName] = useState("");
    const [ownerEmail, setOwnerEmail] = useState("");
    const [metadata, setMetadata] = useState<MetadataItem[]>([
        { icon: "", description: "" }
    ]);

    // Fetch project data
    const projectQuery = useQuery<Project>({
        queryKey: ['project', projectId],
        queryFn: () => trpcClient.getProject.query({ id: projectId }),
        enabled: !!projectId,
    });

    // Update project mutation
    const updateProjectMutation = useMutation({
        mutationFn: async (data: {
            id: string;
            projectName: string;
            ownerName: string;
            ownerEmail: string;
            metadata: MetadataItem[];
        }) => {
            return await trpcClient.updateProject.mutate(data);
        },
        onSuccess: () => {
            toast.success("Project updated successfully!");
            router.push(`/project/${projectId}`);
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to update project");
        }
    });

    // Load project data into form when fetched
    useEffect(() => {
        if (projectQuery.data) {
            const project = projectQuery.data;
            setProjectName(project.name);
            setOwnerName(project.owner.name);
            setOwnerEmail(project.owner.email);
            
            if (project.metadata.length > 0) {
                setMetadata(project.metadata.map(m => ({
                    id: m.id,
                    icon: m.icon,
                    description: m.description
                })));
            }
        }
    }, [projectQuery.data]);

    useEffect(() => {
        if (!session && !isPending) {
            router.push(`/login?redirect=/project/${projectId}/edit` as any);
        }
    }, [session, isPending, router, projectId]);

    const addMetadataItem = () => {
        setMetadata([...metadata, { icon: "", description: "" }]);
    };

    const removeMetadataItem = (index: number) => {
        if (metadata.length > 1) {
            setMetadata(metadata.filter((_, i) => i !== index));
        }
    };

    const updateMetadataItem = (index: number, field: keyof MetadataItem, value: string) => {
        const updated = metadata.map((item, i) => 
            i === index ? { ...item, [field]: value } : item
        );
        setMetadata(updated);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!projectName.trim()) {
            toast.error("Project name is required");
            return;
        }
        
        if (!ownerName.trim() || !ownerEmail.trim()) {
            toast.error("Owner information is required");
            return;
        }

        updateProjectMutation.mutate({
            id: projectId,
            projectName,
            ownerName,
            ownerEmail,
            metadata: metadata.filter(m => m.icon.trim() || m.description.trim())
        });
    };

    if (isPending || projectQuery.isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
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

    if (!projectQuery.data) {
        return (
            <div className="container mx-auto max-w-4xl px-4 py-8">
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <h2 className="text-lg font-medium mb-2">Project not found</h2>
                            <p className="text-muted-foreground mb-4">
                                The project you're trying to edit doesn't exist or you don't have access to it.
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
            <div className="mb-8">
                <Button 
                    variant="outline" 
                    onClick={() => router.push(`/project/${projectId}`)}
                    className="mb-4"
                >
                    ← Back to Project
                </Button>
                <h1 className="text-3xl font-bold mb-2">Edit Project</h1>
                <p className="text-muted-foreground">Update your project details below</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Project Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Project Information</CardTitle>
                        <CardDescription>Basic details about your project</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="projectName">Project Name</Label>
                            <Input
                                id="projectName"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                placeholder="Enter project name"
                                required
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Owner Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Owner Information</CardTitle>
                        <CardDescription>Details about the project owner</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="ownerName">Owner Name</Label>
                                <Input
                                    id="ownerName"
                                    value={ownerName}
                                    onChange={(e) => setOwnerName(e.target.value)}
                                    placeholder="Enter owner name"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="ownerEmail">Owner Email</Label>
                                <Input
                                    id="ownerEmail"
                                    type="email"
                                    value={ownerEmail}
                                    onChange={(e) => setOwnerEmail(e.target.value)}
                                    placeholder="Enter owner email"
                                    required
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Metadata */}
                <Card>
                    <CardHeader>
                        <CardTitle>Project Metadata</CardTitle>
                        <CardDescription>Add additional information, icons, and attributes for your project</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {metadata.map((item, index) => (
                            <div key={index} className="border-2 border-dashed border-muted rounded-xl p-6 space-y-4 hover:border-primary/50 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                                            {index + 1}
                                        </div>
                                        <h4 className="text-base font-semibold">Metadata Item {index + 1}</h4>
                                        {item.icon && (
                                            <div className="text-xl">{item.icon}</div>
                                        )}
                                    </div>
                                    {metadata.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => removeMetadataItem(index)}
                                            className="opacity-70 hover:opacity-100"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                                                <path d="M3 6h18"/>
                                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                                            </svg>
                                            Remove
                                        </Button>
                                    )}
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor={`icon-${index}`} className="flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="12" cy="12" r="3"/>
                                                <path d="M12 1v6m0 6v6"/>
                                                <path d="m21 12-6 0m-6 0-6 0"/>
                                            </svg>
                                            Icon / Emoji
                                        </Label>
                                        <Input
                                            id={`icon-${index}`}
                                            value={item.icon}
                                            onChange={(e) => updateMetadataItem(index, "icon", e.target.value)}
                                            placeholder="🚀 or icon name"
                                            className="text-center text-lg"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Use emojis, symbols, or short text
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor={`description-${index}`} className="flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                                <polyline points="14,2 14,8 20,8"/>
                                                <line x1="16" y1="13" x2="8" y2="13"/>
                                                <line x1="16" y1="17" x2="8" y2="17"/>
                                                <polyline points="10,9 9,9 8,9"/>
                                            </svg>
                                            Description
                                        </Label>
                                        <Input
                                            id={`description-${index}`}
                                            value={item.description}
                                            onChange={(e) => updateMetadataItem(index, "description", e.target.value)}
                                            placeholder="Describe this metadata item..."
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Brief description or note about this metadata
                                        </p>
                                    </div>
                                </div>

                                {/* Preview */}
                                {(item.icon || item.description) && (
                                    <div className="mt-4 p-3 bg-muted/50 rounded-lg border">
                                        <p className="text-xs text-muted-foreground mb-2 font-medium">Preview:</p>
                                        <div className="flex items-center gap-3">
                                            {item.icon && (
                                                <div className="text-xl">{item.icon}</div>
                                            )}
                                            <div>
                                                <p className="text-sm font-medium">
                                                    {item.description || `Metadata Item ${index + 1}`}
                                                </p>
                                                {item.description && (
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        This will appear in your project details
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                        
                        <Button
                            type="button"
                            variant="outline"
                            onClick={addMetadataItem}
                            className="w-full border-2 border-dashed border-muted hover:border-primary h-12"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                                <path d="M5 12h14"/>
                                <path d="M12 5v14"/>
                            </svg>
                            Add New Metadata Item
                        </Button>

                        {/* Metadata Tips */}
                        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                            <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"/>
                                    <path d="m9 12 2 2 4-4"/>
                                </svg>
                                Metadata Tips
                            </h5>
                            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                                <li>• Use emojis for visual icons: 🚀 📱 💡 🎯</li>
                                <li>• Add project status, priority, or category information</li>
                                <li>• Include technical details like frameworks or tools used</li>
                                <li>• Store project-specific notes or important links</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>

                {/* Submit Button */}
                <div className="flex gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push(`/project/${projectId}`)}
                        disabled={updateProjectMutation.isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={updateProjectMutation.isPending}
                        className="min-w-32"
                    >
                        {updateProjectMutation.isPending ? (
                            <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Updating...
                            </div>
                        ) : (
                            "Update Changes"
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
