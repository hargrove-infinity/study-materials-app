import { Request, Response } from "express";
import { eq, isNotNull } from "drizzle-orm";
import {
  categoryTable,
  db,
  materialCategoriesTable,
  materialRecommendationsTable,
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
    const result = await db
      .select({
        categoryName: categoryTable.name,
        categoryDescription: categoryTable.description,
        materialUrl: materialTable.url,
        materialType: materialTable.type,
      })
      .from(materialTable)
      .rightJoin(
        materialCategoriesTable,
        eq(materialTable.id, materialCategoriesTable.materialId)
      )
      .rightJoin(
        categoryTable,
        eq(categoryTable.id, materialCategoriesTable.categoryId)
      );

    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error in get all categories with materials");
  }
}

// Get all materials with categories or recommendations (distinct)
async function getAllUsedMaterialsDistinct(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const result = await db
      .selectDistinctOn([materialTable.id], {
        materialId: materialTable.id,
        materialUrl: materialTable.url,
        materialType: materialTable.type,
        categoryName: categoryTable.name,
        recommendedMaterialId:
          materialRecommendationsTable.recommendedMaterialId,
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
      .innerJoin(
        materialRecommendationsTable,
        eq(materialTable.id, materialRecommendationsTable.recommendedMaterialId)
      );

    res.send(result);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send(
        "Error in get all materials with categories or recommendations (distinct)"
      );
  }
}

// Get all materials with categories or recommendations (duplicates)
async function getAllUsedMaterialsDuplicates(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const result = await db
      .select({
        materialId: materialTable.id,
        materialUrl: materialTable.url,
        materialType: materialTable.type,
        categoryName: categoryTable.name,
        recommendedMaterialId:
          materialRecommendationsTable.recommendedMaterialId,
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
      .innerJoin(
        materialRecommendationsTable,
        eq(materialTable.id, materialRecommendationsTable.recommendedMaterialId)
      );

    res.send(result);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send(
        "Error in get all materials with categories or recommendations (distinct)"
      );
  }
}

// Get all materials with related categories and recommendations
async function getAllMaterialsCategoriesRecommendations(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const result = await db
      .select({
        materialUrl: materialTable.url,
        materialType: materialTable.type,
        categoryName: categoryTable.name,
        isRecommended: isNotNull(
          materialRecommendationsTable.recommendedMaterialId
        ),
      })
      .from(materialTable)
      .fullJoin(
        materialCategoriesTable,
        eq(materialTable.id, materialCategoriesTable.materialId)
      )
      .fullJoin(
        categoryTable,
        eq(categoryTable.id, materialCategoriesTable.categoryId)
      )
      .fullJoin(
        materialRecommendationsTable,
        eq(materialTable.id, materialRecommendationsTable.recommendedMaterialId)
      );

    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error in get all categories with materials");
  }
}

export const reportRoutes = {
  getAllMenteesWithMaterials,
  getAllMaterialsWithCategories,
  getAllCategoriesWithMaterials,
  getAllUsedMaterialsDuplicates,
  getAllUsedMaterialsDistinct,
  getAllMaterialsCategoriesRecommendations,
};
