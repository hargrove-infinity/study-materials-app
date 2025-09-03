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
export const userInsertSchema = createInsertSchema(userTable)
  .extend({
    email: z.email().nonempty(),
  })
  .omit({ id: true, invitedByUserId: true, createdAt: true, updatedAt: true });

export const userUpdateSchema = createUpdateSchema(userTable)
  .extend({
    email: z.email().nonempty(),
  })
  .omit({ id: true, invitedByUserId: true, createdAt: true, updatedAt: true });

// Mentees
export const menteeInsertSchema = createInsertSchema(menteeTable)
  .extend({
    firstName: z.string().nonempty(),
    lastName: z.string().nonempty(),
    userId: z.uuid().nonempty(),
  })
  .omit({ id: true, createdAt: true, updatedAt: true });

export const menteeUpdateSchema = createUpdateSchema(menteeTable)
  .extend({
    firstName: z.string().nonempty().optional(),
    lastName: z.string().nonempty().optional(),
  })
  .omit({ id: true, userId: true, createdAt: true, updatedAt: true });

// Categories
export const categoryInsertSchema = createInsertSchema(categoryTable)
  .extend({
    name: z.string().nonempty(),
    description: z.string().nonempty(),
  })
  .omit({
    id: true,
    predecessorCategoryId: true,
    successorCategoryId: true,
    createdAt: true,
    updatedAt: true,
  });

export const categoryUpdateSchema = createUpdateSchema(categoryTable)
  .extend({
    name: z.string().nonempty().optional(),
    description: z.string().nonempty().optional(),
  })
  .omit({
    id: true,
    predecessorCategoryId: true,
    successorCategoryId: true,
    createdAt: true,
    updatedAt: true,
  });

const withSuccessorCategoryId = z.object({
  type: z.literal("byId"),
  successorCategoryId: z.uuid().nonempty(),
});

const withSuccessorCategory = z.object({
  type: z.literal("byModel"),
  successorCategory: categoryInsertSchema,
});

export const replaceOneCategorySchema = z.union([
  withSuccessorCategoryId,
  withSuccessorCategory,
]);

// Materials
const materialInsertSchema = createInsertSchema(materialTable)
  .extend({
    url: z.url().nonempty(),
  })
  .omit({ id: true, createdAt: true, updatedAt: true });

const materialUpdateSchema = createUpdateSchema(materialTable)
  .extend({
    url: z.url().nonempty(),
  })
  .omit({ id: true, createdAt: true, updatedAt: true });

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
