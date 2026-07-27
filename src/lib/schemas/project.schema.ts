import z from 'zod';

export const createProjectSchema = z.object({
  projectName: z
    .string('Project name must be a string.')
    .min(1, 'Project name is required.'),
  houseType: z
    .string('House type must be a string.')
    .min(1, 'House type is required.'),
  location: z
    .string('Location must be a string.')
    .min(1, 'Location is required.'),
  estimatedBudget: z
    .number('Estimated budget must be a number.')
    .positive('Estimated budget must be positive.'),
  description: z.string().optional()
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;

export const addProjectMaterialSchema = z.object({
  materialId: z.string('Material is required.').min(1, 'Material is required.'),
  plannedQty: z
    .number('Planned quantity must be a number.')
    .int('Planned quantity must be an integer.')
    .positive('Planned quantity must be positive.')
});

export type AddProjectMaterialInput = z.infer<typeof addProjectMaterialSchema>;

export const updateProjectMaterialSchema = z.object({
  plannedQty: z
    .number('Planned quantity must be a number.')
    .int('Planned quantity must be an integer.')
    .positive('Planned quantity must be positive.')
});

export type UpdateProjectMaterialInput = z.infer<
  typeof updateProjectMaterialSchema
>;

export const withdrawMaterialSchema = z.object({
  qty: z
    .number('Quantity must be a number.')
    .int('Quantity must be an integer.')
    .positive('Quantity must be positive.')
});

export type WithdrawMaterialInput = z.infer<typeof withdrawMaterialSchema>;

export const createChecklistItemSchema = z.object({
  title: z.string('Title must be a string.').min(1, 'Title is required.')
});

export type CreateChecklistItemInput = z.infer<
  typeof createChecklistItemSchema
>;

export const updateChecklistItemSchema = z.object({
  title: z.string('Title must be a string.').min(1, 'Title is required.')
});

export type UpdateChecklistItemInput = z.infer<
  typeof updateChecklistItemSchema
>;
