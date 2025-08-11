import { inArray } from "drizzle-orm";
import { db, materialRecommendationsTable } from "../drizzle";

export async function deleteExistingRecommendedMaterials(
  existingRecommendedMaterialIdsToRemove: string[]
) {
  await db
    .delete(materialRecommendationsTable)
    .where(
      inArray(
        materialRecommendationsTable.recommendedMaterialId,
        existingRecommendedMaterialIdsToRemove
      )
    );
}
