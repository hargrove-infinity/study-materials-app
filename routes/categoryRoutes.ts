import { Request, Response } from "express";
import { eq, inArray } from "drizzle-orm";
import { ZodError } from "zod";
import { db, categoryTable, materialCategoriesTable } from "../drizzle";
import {
  categoryInsertSchema,
  categoryUpdateSchema,
  queryParamsIdSchema,
  replaceCategoryByExistingSchema,
} from "../validation";

// Categories endpoints

// Create one category
async function createOneCategory(
  req: Request<{}, {}, unknown, {}>,
  res: Response
): Promise<void> {
  try {
    const body = req.body;
    const parsedBody = categoryInsertSchema.parse(body);

    const result = await db
      .insert(categoryTable)
      .values(parsedBody)
      .returning();

    const category = result[0];

    res.status(201).send(category);
  } catch (error) {
    console.error(error);
    if (error instanceof ZodError) {
      res.status(422).send("Error creating category");
      return;
    }

    res.status(500).send("Unknown error");
  }
}

// Get all categories
async function getAllCategories(req: Request, res: Response): Promise<void> {
  try {
    const categories = await db.query.categoryTable.findMany();
    res.send(categories);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error in get all categories");
  }
}

// Get one category
async function getOneCategory(
  req: Request<unknown>,
  res: Response
): Promise<void> {
  try {
    const params = req.params;
    const parsedParams = queryParamsIdSchema.parse(params);
    const { id } = parsedParams;

    const foundCategory = await db.query.categoryTable.findFirst({
      where: eq(categoryTable.id, id),
    });

    if (foundCategory) {
      res.send(foundCategory);
      return;
    }

    res.status(404).send(`Category with provided ${id} is not found`);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error in get one category");
  }
}

// Update one category
async function updateOneCategory(
  req: Request<unknown, {}, unknown>,
  res: Response
): Promise<void> {
  try {
    const params = req.params;
    const parsedParams = queryParamsIdSchema.parse(params);
    const { id } = parsedParams;

    const body = req.body;
    const parsedBody = categoryUpdateSchema.parse(body);

    const result = await db
      .update(categoryTable)
      .set(parsedBody)
      .where(eq(categoryTable.id, id))
      .returning();

    const category = result[0];

    if (!category) {
      res.status(404).send(`Category with provided ${id} is not found`);
      return;
    }

    res.send(category);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error in update one category");
  }
}

// Delete one category
async function deleteOneCategory(
  req: Request<unknown>,
  res: Response
): Promise<void> {
  try {
    const params = req.params;
    const parsedParams = queryParamsIdSchema.parse(params);
    const { id } = parsedParams;

    const result = await db
      .delete(categoryTable)
      .where(eq(categoryTable.id, id))
      .returning();

    const category = result[0];

    if (!category) {
      res.status(404).send(`Category with provided ${id} is not found`);
      return;
    }

    res.send("Category successfully deleted");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error in delete one category");
  }
}

// Replace one category by existing
async function replaceOneCategoryByExisting(
  req: Request<unknown>,
  res: Response
): Promise<void> {
  try {
    const params = req.params;
    const parsedParams = replaceCategoryByExistingSchema.parse(params);
    const { oldCategoryId, newCategoryId } = parsedParams;

    const foundCategories = await db.query.categoryTable.findMany({
      where: inArray(categoryTable.id, [oldCategoryId, newCategoryId]),
    });

    if (foundCategories.length < 2) {
      res.status(404).send("Some category with provided id is not found");
      return;
    }

    const updatedCategory = await db.transaction(async (tx) => {
      const resultOldCategory = await tx
        .update(categoryTable)
        .set({ successorCategoryId: newCategoryId })
        .where(eq(categoryTable.id, oldCategoryId))
        .returning();

      const oldCategory = resultOldCategory[0];

      await tx
        .update(categoryTable)
        .set({ predecessorCategoryId: oldCategoryId })
        .where(eq(categoryTable.id, newCategoryId));

      await tx
        .update(materialCategoriesTable)
        .set({ categoryId: newCategoryId })
        .where(eq(materialCategoriesTable.categoryId, oldCategoryId));

      return oldCategory;
    });

    res.send(updatedCategory);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error in replace one category by existing");
  }
}

// Replace one category by new
async function replaceOneCategoryByNew(
  req: Request<unknown, {}, unknown>,
  res: Response
): Promise<void> {
  try {
    const params = req.params;
    const parsedParams = queryParamsIdSchema.parse(params);
    const { id } = parsedParams;

    const foundCategory = await db.query.categoryTable.findFirst({
      where: eq(categoryTable.id, id),
    });

    if (!foundCategory) {
      res.status(404).send(`Category with provided ${id} is not found`);
      return;
    }

    const body = req.body;
    const parsedBody = categoryInsertSchema.parse(body);

    const updatedCategory = await db.transaction(async (tx) => {
      const resultNewCategory = await tx
        .insert(categoryTable)
        .values({ ...parsedBody, predecessorCategoryId: id })
        .returning();

      const newCategory = resultNewCategory[0];

      const resultOldCategory = await tx
        .update(categoryTable)
        .set({ successorCategoryId: newCategory.id })
        .where(eq(categoryTable.id, id))
        .returning();

      const oldCategory = resultOldCategory[0];

      await tx
        .update(materialCategoriesTable)
        .set({ categoryId: newCategory.id })
        .where(eq(materialCategoriesTable.categoryId, id))
        .returning();

      return oldCategory;
    });

    res.send(updatedCategory);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error in replace one category by new");
  }
}

export const categoryRoutes = {
  createOneCategory,
  getAllCategories,
  getOneCategory,
  updateOneCategory,
  deleteOneCategory,
  replaceOneCategoryByExisting,
  replaceOneCategoryByNew,
} as const;
