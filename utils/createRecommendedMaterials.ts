import { recommendedMaterialDefSchema } from "../validation";
import {
  db,
  materialTable,
  materialCategoriesTable,
  materialRecommendationsTable,
} from "../drizzle";

export async function createRecommendedMaterials(
  materialId: string,
  recommendedMaterials: unknown[]
): Promise<void> {
  for (const recommendedMaterial of recommendedMaterials) {
    const parsedRecommendedMaterial =
      recommendedMaterialDefSchema.parse(recommendedMaterial);

    const result = await db
      .insert(materialTable)
      .values(parsedRecommendedMaterial)
      .returning();

    const createdRecommendedMaterial = result[0];

    for (const categoryId of parsedRecommendedMaterial.categoryIds) {
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
