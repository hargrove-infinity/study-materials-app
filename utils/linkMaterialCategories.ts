import { db, materialCategoriesTable } from "../drizzle";
import { DatabaseOrTransactionType } from "../types";

export async function linkMaterialCategories(
  materialId: string,
  categoryIds: string[],
  tx?: DatabaseOrTransactionType
) {
  const dbClient = tx || db;

  for (const categoryId of categoryIds) {
    await dbClient
      .insert(materialCategoriesTable)
      .values({ materialId, categoryId });
  }
}
