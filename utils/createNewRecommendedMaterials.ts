import { db, materialTable, materialRecommendationsTable } from "../drizzle";
import { RecommendedMaterialDef } from "../validation";
import { TransactionType } from "../types";
import { linkMaterialCategories } from "./linkMaterialCategories";

export async function createNewRecommendedMaterials(
  materialId: string,
  recommendedMaterials: RecommendedMaterialDef[],
  tx?: TransactionType
): Promise<void> {
  const dbClient = tx || db;

  for (const recommendedMaterial of recommendedMaterials) {
    const result = await dbClient
      .insert(materialTable)
      .values(recommendedMaterial)
      .returning();

    const createdRecommendedMaterial = result[0];

    await linkMaterialCategories(
      createdRecommendedMaterial.id,
      recommendedMaterial.categoryIds,
      dbClient
    );

    await dbClient.insert(materialRecommendationsTable).values({
      materialId,
      recommendedMaterialId: createdRecommendedMaterial.id,
    });
  }
}
