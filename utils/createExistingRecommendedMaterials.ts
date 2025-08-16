import { inArray } from "drizzle-orm";
import { db, materialTable, materialRecommendationsTable } from "../drizzle";
import { TransactionType } from "../types";

export async function createExistingRecommendedMaterials(
  materialId: string,
  existingRecommendedMaterialIds: string[],
  tx?: TransactionType
) {
  const dbClient = tx || db;

  const existingRecommendedMaterials =
    await dbClient.query.materialTable.findMany({
      where: inArray(materialTable.id, existingRecommendedMaterialIds),
    });

  if (
    existingRecommendedMaterials.length !==
    existingRecommendedMaterialIds.length
  ) {
    throw new Error(
      "Some of the provided existing recommended material ids are invalid"
    );
  }

  if (existingRecommendedMaterials.length) {
    for (const existingRecommendedMaterial of existingRecommendedMaterials) {
      await dbClient.insert(materialRecommendationsTable).values({
        materialId,
        recommendedMaterialId: existingRecommendedMaterial.id,
      });
    }
  }
}
