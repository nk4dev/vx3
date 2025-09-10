"use client";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { trpcClient } from "@/utils/trpc";

interface MetadataItem {
    icon: string;
    description: string;
}

export default function CreateProject() {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();
    
    // Form state
    const [projectName, setProjectName] = useState("");
    const [ownerName, setOwnerName] = useState("");
    const [ownerEmail, setOwnerEmail] = useState("");
    const [metadata, setMetadata] = useState<MetadataItem[]>([
        { icon: "", description: "" }
    ]);

    // tRPC mutation using the client directly
    const createProjectMutation = useMutation({
        mutationFn: async (data: {
            projectName: string;
            ownerName: string;
            ownerEmail: string;
            metadata: MetadataItem[];
        }) => {
            return await trpcClient.createProject.mutate(data);
        },
        onSuccess: () => {
            toast.success("Project created successfully!");
            router.push("/dashboard");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to create project");
        }
    });

    useEffect(() => {
        if (!session && !isPending) {
            router.push("/login?redirect=/create/project");
        }
        
        // Pre-fill owner data from session if available
        if (session?.user) {
            setOwnerName(session.user.name || "");
            setOwnerEmail(session.user.email || "");
        }
    }, [session, isPending, router]);

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

        createProjectMutation.mutate({
            projectName,
            ownerName,
            ownerEmail,
            metadata: metadata.filter(m => m.icon.trim() || m.description.trim())
        });
    };

    if (isPending) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-4xl px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Create New Project</h1>
                <p className="text-muted-foreground">Fill in the details below to create your project</p>
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
                        <CardDescription>Add additional information and icons for your project</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {metadata.map((item, index) => (
                            <div key={index} className="border rounded-lg p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-medium">Metadata Item {index + 1}</h4>
                                    {metadata.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => removeMetadataItem(index)}
                                        >
                                            Remove
                                        </Button>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <Label htmlFor={`icon-${index}`}>Icon</Label>
                                        <Input
                                            id={`icon-${index}`}
                                            value={item.icon}
                                            onChange={(e) => updateMetadataItem(index, "icon", e.target.value)}
                                            placeholder="Icon name or URL"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor={`description-${index}`}>Description</Label>
                                        <Input
                                            id={`description-${index}`}
                                            value={item.description}
                                            onChange={(e) => updateMetadataItem(index, "description", e.target.value)}
                                            placeholder="Description or note"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        <Button
                            type="button"
                            variant="outline"
                            onClick={addMetadataItem}
                            className="w-full"
                        >
                            Add Metadata Item
                        </Button>
                    </CardContent>
                </Card>

                {/* Submit Button */}
                <div className="flex gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        disabled={createProjectMutation.isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={createProjectMutation.isPending}
                        className="min-w-32"
                    >
                        {createProjectMutation.isPending ? (
                            <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Creating...
                            </div>
                        ) : (
                            "Create Project"
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}