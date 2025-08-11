import { z } from "zod";
import { MaterialTypeEnum } from "../types";

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
export const userDefSchema = z.object({
  email: z.email().nonempty(),
});

// Mentees
export const menteeDefSchema = z.object({
  firstName: z.string().nonempty(),
  lastName: z.string().nonempty(),
  userId: z.uuid().nonempty(),
});

export const menteeUpdateSchema = z.object({
  firstName: z.string().nonempty().optional(),
  lastName: z.string().nonempty().optional(),
});

// MaterialType
const materialTypeSchema = z.enum(MaterialTypeEnum);

// Categories

// Category request body
export const categoryDefSchema = z.object({
  name: z.string(),
  description: z.string(),
});

// Category request body for put
export const categoryUpdateSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
});

// Materials

// Material base schema
const materialBaseSchema = z.object({
  url: z.url(),
  type: materialTypeSchema,
});

// Material request body
export const recommendedMaterialDefSchema = materialBaseSchema.extend({
  menteeId: z.uuid(),
  categoryIds: z.uuid().array(),
});

export const materialDefSchema = materialBaseSchema.extend({
  menteeId: z.uuid(),
  categoryIds: z.uuid().array(),
  existingRecommendedMaterialIds: z.uuid().array().optional(),
  newRecommendedMaterials: z.lazy(() =>
    recommendedMaterialDefSchema.array().optional()
  ),
});

// Material request body for put
export const materialUpdateSchema = z.object({
  url: z.url().optional(),
  type: materialTypeSchema.optional(),
  categoryIds: z.uuid().array().optional(),
  existingRecommendedMaterialIds: z.uuid().array().optional(),
  newRecommendedMaterials: z.lazy(() =>
    recommendedMaterialDefSchema.array().optional()
  ),
});
