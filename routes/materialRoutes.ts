import { Request, Response } from "express";
import { and, eq } from "drizzle-orm";
import { ZodError } from "zod";
import {
  materialDefSchema,
  materialUpdateSchema,
  queryParamsIdSchema,
} from "../validation";
import { db, materialTable, materialCategoriesTable } from "../drizzle";
import {
  createExistingRecommendedMaterials,
  createNewRecommendedMaterials,
  deleteExistingRecommendedMaterials,
  linkMaterialCategories,
  updateMaterialCategories,
} from "../utils";

// Materials endpoints

// Create one material
async function createOneMaterial(
  req: Request<{}, {}, unknown, {}>,
  res: Response
): Promise<void> {
  try {
    const body = req.body;
    const parsedBody = materialDefSchema.parse(body);

    const createdMaterial = await db.transaction(async (tx) => {
      const result = await tx
        .insert(materialTable)
        .values(parsedBody)
        .returning();

      const material = result[0];

      await linkMaterialCategories(material.id, parsedBody.categoryIds, tx);

      if (parsedBody.newRecommendedMaterials?.length) {
        await createNewRecommendedMaterials(
          material.id,
          parsedBody.newRecommendedMaterials,
          tx
        );
      }

      if (parsedBody.existingRecommendedMaterialIds?.length) {
        await createExistingRecommendedMaterials(
          material.id,
          parsedBody.existingRecommendedMaterialIds,
          tx
        );
      }

      return material;
    });

    res.status(201).send(createdMaterial);
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
    const materials = await db.query.materialTable.findMany();
    res.send(materials);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error in get all materials");
  }
}

// Get one material
async function getOneMaterial(
  req: Request<unknown>,
  res: Response
): Promise<void> {
  try {
    const params = req.params;
    const parsedParams = queryParamsIdSchema.parse(params);
    const { id } = parsedParams;

    const foundMaterial = await db.query.materialTable.findFirst({
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
  req: Request<unknown>,
  res: Response
): Promise<void> {
  try {
    const params = req.params;
    const parsedParams = queryParamsIdSchema.parse(params);
    const { id } = parsedParams;

    const materials = await db.query.materialTable.findMany({
      where: (material, { exists }) => {
        return exists(
          db
            .select()
            .from(materialCategoriesTable)
            .where(
              and(
                eq(materialCategoriesTable.materialId, material.id),
                eq(materialCategoriesTable.categoryId, id)
              )
            )
        );
      },
      with: {
        materialCategories: {
          columns: { materialId: false, categoryId: false },
          with: { category: { columns: { name: true } } },
        },
      },
    });

    const formattedMaterials = materials.map(
      ({ materialCategories, ...material }) => {
        return {
          ...material,
          categories: materialCategories.map((materialCategory) => {
            return materialCategory.category.name;
          }),
        };
      }
    );

    res.send(formattedMaterials);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error in get one material by category");
  }
}

// Update one material
async function updateOneMaterial(
  req: Request<unknown, {}, unknown, {}>,
  res: Response
): Promise<void> {
  try {
    const params = req.params;
    const parsedParams = queryParamsIdSchema.parse(params);
    const { id } = parsedParams;

    const body = req.body;
    const parsedBody = materialUpdateSchema.parse(body);

    const {
      categoryIds,
      existingRecommendedMaterialIdsToAdd,
      existingRecommendedMaterialIdsToRemove,
      newRecommendedMaterials,
      ...restParsedBody
    } = parsedBody;

    const updatedMaterial = await db.transaction(async (tx) => {
      const result = await tx
        .update(materialTable)
        .set(restParsedBody)
        .where(eq(materialTable.id, id))
        .returning();

      const material = result[0];

      if (!material) {
        res.status(404).send(`Material with provided ${id} is not found`);
        return;
      }

      if (categoryIds) {
        await updateMaterialCategories(id, categoryIds, tx);
      }

      if (existingRecommendedMaterialIdsToAdd?.length) {
        await createExistingRecommendedMaterials(
          id,
          existingRecommendedMaterialIdsToAdd,
          tx
        );
      }

      if (existingRecommendedMaterialIdsToRemove?.length) {
        await deleteExistingRecommendedMaterials(
          existingRecommendedMaterialIdsToRemove,
          tx
        );
      }

      if (newRecommendedMaterials?.length) {
        await createNewRecommendedMaterials(id, newRecommendedMaterials, tx);
      }

      return material;
    });

    res.send(updatedMaterial);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error in update material");
  }
}

// Delete one material
async function deleteOneMaterial(
  req: Request<unknown>,
  res: Response
): Promise<void> {
  try {
    const params = req.params;
    const parsedParams = queryParamsIdSchema.parse(params);
    const { id } = parsedParams;

    const result = await db
      .delete(materialTable)
      .where(eq(materialTable.id, id))
      .returning();

    const material = result[0];

    if (!material) {
      res.send(`Material with provided ${id} is not found`);
      return;
    }

    res.send("Material successfully deleted");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error in delete material");
  }
}

export const materialRoutes = {
  createOneMaterial,
  getAllMaterials,
  getOneMaterial,
  getAllMaterialsByCategory,
  updateOneMaterial,
  deleteOneMaterial,
} as const;
