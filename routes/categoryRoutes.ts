import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { ZodError } from "zod";
import {
  categoryDefSchema,
  categoryUpdateSchema,
  queryParamsIdSchema,
} from "../validation";
import { db, categoryTable } from "../drizzle";

// Categories endpoints

// Create one category
async function createOneCategory(
  req: Request<{}, {}, unknown, {}>,
  res: Response
): Promise<void> {
  try {
    const body = req.body;
    const parsedBody = categoryDefSchema.parse(body);

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

    res.send(category);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error in delete one category");
  }
}

export const categoryRoutes = {
  createOneCategory,
  getAllCategories,
  getOneCategory,
  updateOneCategory,
  deleteOneCategory,
} as const;
