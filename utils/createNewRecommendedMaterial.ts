import {
  db,
  materialTable,
  materialCategoriesTable,
  materialRecommendationsTable,
} from "../drizzle";
import { RecommendedMaterialDef } from "../validation";

export async function createNewRecommendedMaterial(
  materialId: string,
  parsedRecommendedMaterial: RecommendedMaterialDef
): Promise<void> {
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
