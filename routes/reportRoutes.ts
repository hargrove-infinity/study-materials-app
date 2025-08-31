import { Request, Response } from "express";
import { asc, eq, inArray, isNotNull, sql } from "drizzle-orm";
import {
  categoryTable,
  db,
  materialCategoriesTable,
  materialRecommendationsTable,
  materialTable,
  menteeTable,
} from "../drizzle";
import { union, unionAll } from "drizzle-orm/pg-core";

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
    const materialCategoriesQuery = db
      .select({ materialId: materialCategoriesTable.materialId })
      .from(materialCategoriesTable);

    const materialRecommendationsQuery = db
      .select({
        materialId: materialRecommendationsTable.materialId,
      })
      .from(materialRecommendationsTable);

    const materialCategoriesAndRecommendations = await union(
      materialCategoriesQuery,
      materialRecommendationsQuery
    );

    const materialCategoriesAndRecommendationsIds =
      materialCategoriesAndRecommendations.map((item) => item.materialId);

    const result = await db.query.materialTable.findMany({
      where: inArray(materialTable.id, materialCategoriesAndRecommendationsIds),
    });

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
    const materialCategoriesQuery = db
      .select({ materialId: materialCategoriesTable.materialId })
      .from(materialCategoriesTable);

    const materialRecommendationsQuery = db
      .select({
        materialId: materialRecommendationsTable.materialId,
      })
      .from(materialRecommendationsTable);

    const materialCategoriesAndRecommendations = unionAll(
      materialCategoriesQuery,
      materialRecommendationsQuery
    ).as("materialCategoriesAndRecommendationsQuery");

    const result = await db
      .select({
        id: materialTable.id,
        url: materialTable.url,
        type: materialTable.type,
      })
      .from(materialCategoriesAndRecommendations)
      .innerJoin(
        materialTable,
        eq(materialTable.id, materialCategoriesAndRecommendations.materialId)
      );

    res.send(result);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send(
        "Error in get all materials with categories or recommendations (duplicates)"
      );
  }
}

// Get all categories with material categories
async function getAllCategoriesWithMaterialCategories(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const result = await db
      .select({
        categoryId: categoryTable.id,
        name: categoryTable.name,
        description: categoryTable.description,
        materialCategoriesCategoryId: materialCategoriesTable.categoryId,
        materialCategoriesMaterialId: materialCategoriesTable.materialId,
      })
      .from(categoryTable)
      .crossJoin(materialCategoriesTable);

    res.send(result);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("Error in get all categories with material categories");
  }
}

// Get all material types by mentee
async function getAllMaterialTypesByMentee(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const result = await db
      .select({
        materialType: materialTable.type,
        menteeFirstName: menteeTable.firstName,
        menteeLastName: menteeTable.lastName,
      })
      .from(materialTable)
      .innerJoin(menteeTable, eq(materialTable.menteeId, menteeTable.id))
      .groupBy(materialTable.type, menteeTable.firstName, menteeTable.lastName)
      .orderBy(
        asc(menteeTable.firstName),
        asc(menteeTable.lastName),
        asc(sql`${materialTable.type}::text`)
      );

    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error in get all material types by mentee");
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
  getAllCategoriesWithMaterialCategories,
  getAllMaterialTypesByMentee,
  getAllMaterialsCategoriesRecommendations,
};
