import express from "express";
import { z } from "zod";
import { BaseRouter } from "./routes";

enum MaterialTypeEnum {
  ARTICLE = "ARTICLE",
  VIDEO = "VIDEO",
  COURSE = "COURSE",
  IMAGE = "IMAGE",
  DOCUMENTATION = "DOCUMENTATION",
  OTHER = "OTHER",
}

/* SCHEMAS */

// MaterialType
const materialTypeSchema = z.enum(MaterialTypeEnum);

// Categories

// Category request body
export const categoryDefSchema = z.object({
  name: z.string(),
  description: z.string(),
});

// Category entity in DB
const categorySchema = categoryDefSchema.extend({
  id: z.string(),
  createdAt: z.number(),
  updatedAt: z.number(),
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

// Material entity in DB
const materialSchema = materialBaseSchema.extend({
  id: z.string(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

// Material request body for put
export const materialUpdateSchema = z.object({
  url: z.url().optional(),
  type: materialTypeSchema.optional(),
  categoryIds: z.string().array().optional(),
});

// MaterialCategory
const materialCategorySchema = z.object({
  categoryId: z.string(),
  materialId: z.string(),
});

/* TYPES FROM SCHEMAS */

// Categories
export type CategoryDef = z.infer<typeof categoryDefSchema>;

type Category = z.infer<typeof categorySchema>;

export type CategoryUpdate = z.infer<typeof categoryUpdateSchema>;

// Materials
export type MaterialDef = z.infer<typeof materialDefSchema>;

type Material = z.infer<typeof materialSchema>;

export type MaterialUpdate = z.infer<typeof materialUpdateSchema>;

// MaterialCategory
type MaterialCategory = z.infer<typeof materialCategorySchema>;

/* DATABASE */
interface DB {
  categories: Category[];
  materials: Material[];
  materialCategories: MaterialCategory[];
}

const db: DB = {
  categories: [],
  materials: [],
  materialCategories: [],
};

/* SETUP APP */
const app = express();
const jsonMiddleware = express.json();
app.use(jsonMiddleware);
const PORT = 4000;

// API router
app.use(BaseRouter);

/* RUN APP */
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
