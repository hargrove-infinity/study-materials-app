import { z } from "zod";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import {
  categoryTable,
  materialTable,
  menteeTable,
  userTable,
} from "../drizzle/schema";

/* VALIDATION SCHEMAS */

// ENV
export const envSchema = z.object({
  port: z
    .string()
    .default("4000")
    .transform((val) => parseInt(val, 10)),
  databaseUrl: z.string().nonempty(),
});

// Query Params Id
export const queryParamsIdSchema = z.object({ id: z.uuid() });

// Users
export const userInsertSchema = createInsertSchema(userTable);
export const userUpdateSchema = createUpdateSchema(userTable);

// Mentees
export const menteeInsertSchema = createInsertSchema(menteeTable);
export const menteeUpdateSchema = createUpdateSchema(menteeTable);

// Categories
export const categoryInsertSchema = createInsertSchema(categoryTable);
export const categoryUpdateSchema = createUpdateSchema(categoryTable);
export const replaceOneCategorySchema = z.object({
  successorCategoryId: z.uuid().nonempty(),
});

// Materials
export const materialInsertSchema = createInsertSchema(materialTable);
export const materialUpdateSchema = createUpdateSchema(materialTable);

export const recommendedMaterialDefSchema = materialInsertSchema.extend({
  categoryIds: z.uuid().array(),
});

export const materialDefSchema = materialInsertSchema.extend({
  categoryIds: z.uuid().array(),
  existingRecommendedMaterialIds: z.uuid().array().optional(),
  newRecommendedMaterials: z.lazy(() =>
    recommendedMaterialDefSchema.array().optional()
  ),
});

export const materialUpdateExtendedSchema = materialUpdateSchema.extend({
  categoryIds: z.uuid().array().optional(),
  existingRecommendedMaterialIdsToAdd: z.uuid().array().optional(),
  existingRecommendedMaterialIdsToRemove: z.uuid().array().optional(),
  newRecommendedMaterials: z.lazy(() =>
    recommendedMaterialDefSchema.array().optional()
  ),
});
