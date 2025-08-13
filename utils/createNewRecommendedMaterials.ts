import {
  db,
  materialTable,
  materialCategoriesTable,
  materialRecommendationsTable,
} from "../drizzle";
import { RecommendedMaterialDef } from "../validation";

export async function createNewRecommendedMaterials(
  materialId: string,
  recommendedMaterials: RecommendedMaterialDef[]
): Promise<void> {
  for (const recommendedMaterial of recommendedMaterials) {
    const result = await db
      .insert(materialTable)
      .values(recommendedMaterial)
      .returning();

    const createdRecommendedMaterial = result[0];

    for (const categoryId of recommendedMaterial.categoryIds) {
      await db
        .insert(materialCategoriesTable)
        .values({ materialId: createdRecommendedMaterial.id, categoryId });
    }

    await db.insert(materialRecommendationsTable).values({
      materialId,
      recommendedMaterialId: createdRecommendedMaterial.id,
    });
  }
}
