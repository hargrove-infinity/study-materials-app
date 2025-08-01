import { Request, Response } from "express";
import { and, eq, inArray } from "drizzle-orm";
import { ZodError } from "zod";
import {
  MaterialDef,
  materialDefSchema,
  MaterialUpdate,
  materialUpdateSchema,
} from "..";
import { db as drizzle } from "../db";
import {
  categoryTable,
  materialTable,
  materialCategoriesTable,
} from "../schema";

// Materials endpoints

// Create one material
async function createOneMaterial(
  req: Request<{}, {}, MaterialDef, {}>,
  res: Response
): Promise<void> {
  try {
    const body: unknown = req.body;
    const parsedBody = materialDefSchema.parse(body);

    const result = await drizzle
      .insert(materialTable)
      .values(parsedBody)
      .returning();

    const material = result[0];

    for (const categoryId of parsedBody.categoryIds) {
      await drizzle
        .insert(materialCategoriesTable)
        .values({ materialId: material.id, categoryId });
    }

    res.send(material);
  } catch (error) {
    console.error(error);

    if (error instanceof ZodError) {
      res.status(422).send("Error creating material");
      return;
    }

    res.status(500).send("Unknown error");
  }
}

// Get all materials
async function getAllMaterials(req: Request, res: Response): Promise<void> {
  try {
    const materials = await drizzle.query.materialTable.findMany({
      with: { materialCategories: { with: { category: true } } },
    });
    res.send(materials);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error in get all materials");
  }
}

// Get one material
async function getOneMaterial(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const foundMaterial = await drizzle.query.materialTable.findFirst({
      where: eq(materialTable.id, id),
    });

    if (foundMaterial) {
      res.send(foundMaterial);
      return;
    }

    res.status(404).send(`Material with provided ${id} is not found`);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error in get one material");
  }
}

// Get all materials by one category
async function getAllMaterialsByCategory(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { categoryId } = req.params;

    const materials = await drizzle
      .select({
        id: materialTable.id,
        url: materialTable.url,
        type: materialTable.type,
        createdAt: materialTable.createdAt,
        updatedAt: materialTable.updatedAt,
        category: categoryTable.name,
      })
      .from(materialTable)
      .innerJoin(
        materialCategoriesTable,
        eq(materialTable.id, materialCategoriesTable.materialId)
      )
      .innerJoin(
        categoryTable,
        eq(categoryTable.id, materialCategoriesTable.categoryId)
      )
      .where(eq(categoryTable.id, categoryId));

    res.send(materials);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error in get one material by category");
  }
}

// Update one material
async function updateOneMaterial(
  req: Request<{ id: string }, {}, MaterialUpdate, {}>,
  res: Response
): Promise<void> {
  try {
    const body: unknown = req.body;
    const { id } = req.params;
    const parsedBody = materialUpdateSchema.parse(body);
    const { categoryIds, ...restParsedBody } = parsedBody;

    const result = await drizzle
      .update(materialTable)
      .set(restParsedBody)
      .where(eq(materialTable.id, id))
      .returning();

    const updatedMaterial = result[0];

    if (!updatedMaterial) {
      res.status(404).send(`Material with provided ${id} is not found`);
      return;
    }

    if (categoryIds) {
      const existingCategories = await drizzle
        .select({ categoryId: materialCategoriesTable.categoryId })
        .from(materialCategoriesTable)
        .where(eq(materialCategoriesTable.materialId, id));

      const existingCategoryIds = existingCategories.map(
        (category) => category.categoryId
      );

      const outdatedCategoryIds = existingCategoryIds.filter(
        (categoryId) => !categoryIds.includes(categoryId)
      );

      if (outdatedCategoryIds.length) {
        await drizzle
          .delete(materialCategoriesTable)
          .where(
            and(
              eq(materialCategoriesTable.materialId, id),
              inArray(materialCategoriesTable.categoryId, outdatedCategoryIds)
            )
          );
      }

      const newCategoryIds = categoryIds
        .filter((categoryId) => !existingCategoryIds.includes(categoryId))
        .map((categoryId) => ({ materialId: id, categoryId }));

      if (newCategoryIds.length) {
        await drizzle.insert(materialCategoriesTable).values(newCategoryIds);
      }
    }

    res.send(updatedMaterial);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error in update material");
  }
}

// Delete one material
async function deleteOneMaterial(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const result = await drizzle
      .delete(materialTable)
      .where(eq(materialTable.id, id))
      .returning();

    const material = result[0];

    if (!material) {
      res.send(`Material with provided ${id} is not found`);
      return;
    }

    res.send(material);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error in delete material");
  }
}

export const MaterialRoutes = {
  createOneMaterial,
  getAllMaterials,
  getOneMaterial,
  getAllMaterialsByCategory,
  updateOneMaterial,
  deleteOneMaterial,
} as const;
