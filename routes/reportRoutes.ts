import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import {
  categoryTable,
  db,
  materialCategoriesTable,
  materialTable,
  menteeTable,
} from "../drizzle";

// Reports endpoints

// Get all mentees with related materials
async function getAllMenteesWithMaterials(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const result = await db
      .select({
        menteeId: menteeTable.id,
        firstName: menteeTable.firstName,
        lastName: menteeTable.lastName,
        url: materialTable.url,
        type: materialTable.type,
      })
      .from(menteeTable)
      .innerJoin(materialTable, eq(menteeTable.id, materialTable.menteeId));

    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error in get all mentees with materials");
  }
}

// Get all materials with related categories
async function getAllMaterialsWithCategories(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const result = await db
      .select({
        materialUrl: materialTable.url,
        materialType: materialTable.type,
        categoryName: categoryTable.name,
        categoryDescription: categoryTable.description,
      })
      .from(materialTable)
      .leftJoin(
        materialCategoriesTable,
        eq(materialTable.id, materialCategoriesTable.materialId)
      )
      .leftJoin(
        categoryTable,
        eq(categoryTable.id, materialCategoriesTable.categoryId)
      );

    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error in get all materials with categories");
  }
}

// Get all categories with related materials
async function getAllCategoriesWithMaterials(
  req: Request,
  res: Response
): Promise<void> {
  try {
  } catch (error) {
    console.error(error);
    res.status(500).send("Error in get all categories  with materials");
  }
}

export const reportRoutes = {
  getAllMenteesWithMaterials,
  getAllMaterialsWithCategories,
  getAllCategoriesWithMaterials,
};
