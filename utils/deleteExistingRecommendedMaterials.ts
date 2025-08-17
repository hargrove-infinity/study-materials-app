import { inArray } from "drizzle-orm";
import { db, materialRecommendationsTable, materialTable } from "../drizzle";
import { TransactionType } from "../types";

export async function deleteExistingRecommendedMaterials(
  existingRecommendedMaterialIdsToRemove: string[],
  tx?: TransactionType
) {
  const dbClient = tx || db;

  const existingRecommendedMaterials =
    await dbClient.query.materialTable.findMany({
      where: inArray(materialTable.id, existingRecommendedMaterialIdsToRemove),
    });

  if (
    existingRecommendedMaterials.length !==
    existingRecommendedMaterialIdsToRemove.length
  ) {
    throw new Error(
      "Some of the provided existing recommended material ids for deleting are invalid"
    );
  }

  await dbClient
    .delete(materialRecommendationsTable)
    .where(
      inArray(
        materialRecommendationsTable.recommendedMaterialId,
        existingRecommendedMaterialIdsToRemove
      )
    );
}
