import { and, eq, inArray } from "drizzle-orm";
import { categoryTable, db, materialCategoriesTable } from "../drizzle";

export async function updateMaterialCategories(
  materialId: string,
  categoryIds: string[]
): Promise<void> {
  const checkedCategoryIds = await db.query.categoryTable.findMany({
    where: inArray(categoryTable.id, categoryIds),
  });

  if (checkedCategoryIds.length !== categoryIds.length) {
    throw new Error("Some of the provided category ids are invalid");
  }

  const existingCategories = await db
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
    await db
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
    await db.insert(materialCategoriesTable).values(newCategoryIds);
  }
}
