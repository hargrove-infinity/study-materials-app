import { inArray } from "drizzle-orm";
import { categoryTable, db, materialCategoriesTable } from "../drizzle";
import { DatabaseOrTransactionType } from "../types";

export async function linkMaterialCategories(
  materialId: string,
  categoryIds: string[],
  tx?: DatabaseOrTransactionType
) {
  const dbClient = tx || db;

  const existingCategoryIds = await dbClient.query.categoryTable.findMany({
    where: inArray(categoryTable.id, categoryIds),
  });

  if (existingCategoryIds.length !== categoryIds.length) {
    throw new Error("Some of the provided category ids are invalid");
  }

  for (const categoryId of categoryIds) {
    await dbClient
      .insert(materialCategoriesTable)
      .values({ materialId, categoryId });
  }
}
