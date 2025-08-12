import { z } from "zod";
import { recommendedMaterialDefSchema } from "./schemas";

/* TYPES FROM VALIDATION SCHEMAS */

// Materials

export type RecommendedMaterialDef = z.infer<
  typeof recommendedMaterialDefSchema
>;
