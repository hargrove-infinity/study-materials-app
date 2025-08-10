import { inArray } from "drizzle-orm";
import { db, materialTable, materialRecommendationsTable } from "../drizzle";

export async function createExistingRecommendedMaterials(
  materialId: string,
  existingRecommendedMaterialIds: string[]
) {
  const existingRecommendedMaterials = await db.query.materialTable.findMany({
    where: inArray(materialTable.id, existingRecommendedMaterialIds),
  });

  if (existingRecommendedMaterials.length) {
    for (const existingRecommendedMaterial of existingRecommendedMaterials) {
      await db.insert(materialRecommendationsTable).values({
        materialId,
        recommendedMaterialId: existingRecommendedMaterial.id,
      });
    }
  }
}
