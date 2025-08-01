import { z } from "zod";
import {
  categoryDefSchema,
  categoryUpdateSchema,
  materialDefSchema,
  materialUpdateSchema,
} from "./schemas";

/* TYPES FROM VALIDATION SCHEMAS */

// Categories
export type CategoryDef = z.infer<typeof categoryDefSchema>;

export type CategoryUpdate = z.infer<typeof categoryUpdateSchema>;

// Materials
export type MaterialDef = z.infer<typeof materialDefSchema>;

export type MaterialUpdate = z.infer<typeof materialUpdateSchema>;
