import {
  db,
  materialTable,
  materialCategoriesTable,
  materialRecommendationsTable,
} from "../drizzle";
import { RecommendedMaterialDef } from "../validation";
import { TransactionType } from "../types";

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

    for (const categoryId of recommendedMaterial.categoryIds) {
      await dbClient
        .insert(materialCategoriesTable)
        .values({ materialId: createdRecommendedMaterial.id, categoryId });
    }

    await dbClient.insert(materialRecommendationsTable).values({
      materialId,
      recommendedMaterialId: createdRecommendedMaterial.id,
    });
  }
}
