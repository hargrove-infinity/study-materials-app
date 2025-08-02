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
export const materialDefSchema = materialBaseSchema.extend({
  categoryIds: z.string().array(),
});

// Material request body for put
export const materialUpdateSchema = z.object({
  url: z.url().optional(),
  type: materialTypeSchema.optional(),
  categoryIds: z.string().array().optional(),
});
