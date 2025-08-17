import { and, eq, inArray } from "drizzle-orm";
import { categoryTable, db, materialCategoriesTable } from "../drizzle";
import { TransactionType } from "../types";

export async function updateMaterialCategories(
  materialId: string,
  categoryIds: string[],
  tx?: TransactionType
): Promise<void> {
  const dbClient = tx || db;

  const checkedCategoryIds = await dbClient.query.categoryTable.findMany({
    where: inArray(categoryTable.id, categoryIds),
  });

  if (checkedCategoryIds.length !== categoryIds.length) {
    throw new Error("Some of the provided category ids are invalid");
  }

  const existingCategories = await dbClient
    .select({ categoryId: materialCategoriesTable.categoryId })
    .from(materialCategoriesTable)
    .where(eq(materialCategoriesTable.materialId, materialId));

  const existingCategoryIds = existingCategories.map(
    (category) => category.categoryId
  );

  const outdatedCategoryIds = existingCategoryIds.filter(
    (categoryId) => !categoryIds.includes(categoryId)
  );

  if (outdatedCategoryIds.length) {
    await dbClient
      .delete(materialCategoriesTable)
      .where(
        and(
          eq(materialCategoriesTable.materialId, materialId),
          inArray(materialCategoriesTable.categoryId, outdatedCategoryIds)
        )
      );
  }

  const newCategoryIds = categoryIds
    .filter((categoryId) => !existingCategoryIds.includes(categoryId))
    .map((categoryId) => ({ materialId, categoryId }));

  if (newCategoryIds.length) {
    await dbClient.insert(materialCategoriesTable).values(newCategoryIds);
  }
}
