import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { ZodError } from "zod";
import {
  CategoryDef,
  categoryDefSchema,
  CategoryUpdate,
  categoryUpdateSchema,
} from "..";
import { db as drizzle } from "../db";
import { categoryTable } from "../schema";

// Categories endpoints

// Create one category
async function createOneCategory(
  req: Request<{}, {}, CategoryDef, {}>,
  res: Response
): Promise<void> {
  try {
    const body: unknown = req.body;
    const parsedBody = categoryDefSchema.parse(body);

    const result = await drizzle
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
    const categories = await drizzle.query.categoryTable.findMany({
      with: { materialCategories: { with: { material: true } } },
    });
    res.send(categories);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error in get all categories");
  }
}

// Get one category
async function getOneCategory(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const foundCategory = await drizzle.query.categoryTable.findFirst({
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
  req: Request<{ id: string }, {}, CategoryUpdate>,
  res: Response
): Promise<void> {
  try {
    const body: unknown = req.body;
    const { id } = req.params;
    const parsedBody = categoryUpdateSchema.parse(body);

    const result = await drizzle
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
async function deleteOneCategory(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const result = await drizzle
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

export const CategoryRoutes = {
  createOneCategory,
  getAllCategories,
  getOneCategory,
  updateOneCategory,
  deleteOneCategory,
} as const;
