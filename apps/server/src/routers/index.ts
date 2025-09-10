import { protectedProcedure, publicProcedure, router } from "../lib/trpc";
import { z } from "zod";
import prisma from "../../prisma";

const createProjectSchema = z.object({
	projectName: z.string().min(1, "Project name is required"),
	ownerName: z.string().min(1, "Owner name is required"),
	ownerEmail: z.string().email("Valid email is required"),
	metadata: z.array(z.object({
		icon: z.string(),
		description: z.string()
	})).optional().default([])
});

const updateProjectSchema = z.object({
	id: z.string(),
	projectName: z.string().min(1, "Project name is required"),
	ownerName: z.string().min(1, "Owner name is required"),
	ownerEmail: z.string().email("Valid email is required"),
	metadata: z.array(z.object({
		id: z.string().optional(),
		icon: z.string(),
		description: z.string()
	})).optional().default([])
});

export const appRouter = router({
	healthCheck: publicProcedure.query(() => {
		return "OK";
	}),
	privateData: protectedProcedure.query(({ ctx }) => {
		return {
			message: "This is private",
			user: ctx.session.user,
		};
	}),
	createProject: protectedProcedure
		.input(createProjectSchema)
		.mutation(async ({ input, ctx }) => {
			const { projectName, ownerName, ownerEmail, metadata } = input;
			
			// Create or find the owner
			const owner = await prisma.owner.upsert({
				where: { email: ownerEmail },
				update: { name: ownerName },
				create: {
					name: ownerName,
					email: ownerEmail
				}
			});

			// Create the project (Info)
			const project = await prisma.info.create({
				data: {
					name: projectName,
					userId: owner.id,
					metadata: {
						create: metadata.filter(m => m.icon || m.description).map(m => ({
							icon: m.icon,
							description: m.description
						}))
					}
				},
				include: {
					metadata: true,
					owner: true
				}
			});

			return {
				success: true,
				project
			};
		}),
	getProjects: protectedProcedure.query(async ({ ctx }) => {
		const projects = await prisma.info.findMany({
			include: {
				metadata: true,
				owner: true
			},
			orderBy: {
				id: 'desc'
			}
		});

		return projects;
	}),
	getProject: protectedProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ input }) => {
			const project = await prisma.info.findUnique({
				where: { id: input.id },
				include: {
					metadata: true,
					owner: true
				}
			});

			if (!project) {
				throw new Error("Project not found");
			}

			return project;
		}),
	updateProject: protectedProcedure
		.input(updateProjectSchema)
		.mutation(async ({ input, ctx }) => {
			const { id, projectName, ownerName, ownerEmail, metadata } = input;
			
			// Update or create the owner
			const owner = await prisma.owner.upsert({
				where: { email: ownerEmail },
				update: { name: ownerName },
				create: {
					name: ownerName,
					email: ownerEmail
				}
			});

			// Delete existing metadata
			await prisma.metadata.deleteMany({
				where: { infoId: id }
			});

			// Update the project
			const project = await prisma.info.update({
				where: { id },
				data: {
					name: projectName,
					userId: owner.id,
					metadata: {
						create: metadata.filter(m => m.icon || m.description).map(m => ({
							icon: m.icon,
							description: m.description
						}))
					}
				},
				include: {
					metadata: true,
					owner: true
				}
			});

			return {
				success: true,
				project
			};
		}),
	deleteProject: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ input, ctx }) => {
			const { id } = input;

			// Delete metadata first (due to foreign key constraints)
			await prisma.metadata.deleteMany({
				where: { infoId: id }
			});

			// Delete the project
			await prisma.info.delete({
				where: { id }
			});

			return {
				success: true,
				message: "Project deleted successfully"
			};
		})
});
export type AppRouter = typeof appRouter;
