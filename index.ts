import express, { Request } from "express";
import { z, ZodError } from "zod";
import { db as drizzle } from "./db";
import {
  categoryTable,
  materialCategoriesTable,
  materialTable,
} from "./schema";
import { eq } from "drizzle-orm";

enum MaterialTypeEnum {
  ARTICLE = "ARTICLE",
  VIDEO = "VIDEO",
  COURSE = "COURSE",
  IMAGE = "IMAGE",
  DOCUMENTATION = "DOCUMENTATION",
  OTHER = "OTHER",
}

/* SCHEMAS */

// MaterialType
const materialTypeSchema = z.enum(MaterialTypeEnum);

// Categories

// Category request body
const categoryDefSchema = z.object({
  name: z.string(),
  description: z.string(),
});

// Category entity in DB
const categorySchema = categoryDefSchema.extend({
  id: z.string(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

// Category request body for put
const categoryUpdateSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
});

// Materials

// Material base schema
const materialBaseSchema = z.object({
  url: z.url(),
  type: materialTypeSchema,
});

// Material request body
const materialDefSchema = materialBaseSchema.extend({
  categoryIds: z.string().array(),
});

// Material entity in DB
const materialSchema = materialBaseSchema.extend({
  id: z.string(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

// Material request body for put
const materialUpdateSchema = z.object({
  url: z.url().optional(),
  type: materialTypeSchema.optional(),
  categoryIds: z.string().array().optional(),
});

// MaterialCategory
const materialCategorySchema = z.object({
  categoryId: z.string(),
  materialId: z.string(),
});

/* TYPES FROM SCHEMAS */

// Categories
type CategoryDef = z.infer<typeof categoryDefSchema>;

type Category = z.infer<typeof categorySchema>;

type CategoryUpdate = z.infer<typeof categoryUpdateSchema>;

// Materials
type MaterialDef = z.infer<typeof materialDefSchema>;

type Material = z.infer<typeof materialSchema>;

type MaterialUpdate = z.infer<typeof materialUpdateSchema>;

// MaterialCategory
type MaterialCategory = z.infer<typeof materialCategorySchema>;

/* DATABASE */
interface DB {
  categories: Category[];
  materials: Material[];
  materialCategories: MaterialCategory[];
}

const db: DB = {
  categories: [],
  materials: [],
  materialCategories: [],
};

/* SETUP APP */
const app = express();
const jsonMiddleware = express.json();
app.use(jsonMiddleware);
const PORT = 4000;

/* ENDPOINTS */

// Categories endpoints

// Create one category
app.post("/categories", async (req: Request<{}, {}, CategoryDef, {}>, res) => {
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
});

// Get all categories
app.get("/categories", async (req, res) => {
  try {
    const categories = await drizzle.query.categoryTable.findMany({
      with: { materialCategories: { with: { material: true } } },
    });
    res.send(categories);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error in get all categories");
  }
});

// Get one category
app.get("/categories/:id", async (req, res) => {
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
});

// Update one category
app.put(
  "/categories/:id",
  async (req: Request<{ id: string }, {}, CategoryUpdate>, res) => {
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
);

// Delete one category
app.delete("/categories/:id", (req, res) => {
  try {
    const { id } = req.params;

    const foundCategory = db.categories.find((category) => category.id === id);

    if (!foundCategory) {
      res.status(404).send(`Category with provided ${id} is not found`);
      return;
    }

    const updatedCategories = db.categories.filter(
      (category) => category.id !== id
    );

    db.categories = updatedCategories;

    const updatedMaterialCategories = db.materialCategories.filter(
      (materialCategory) => materialCategory.categoryId !== id
    );

    db.materialCategories = updatedMaterialCategories;

    console.log("DELETE /categories/{id} DB:", db);

    res.send("Category deleted successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error in delete one category");
  }
});

// Materials endpoints
// Create one material
app.post("/materials", async (req: Request<{}, {}, MaterialDef, {}>, res) => {
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
});

// Get all materials
app.get("/materials", async (req, res) => {
  try {
    const materials = await drizzle.query.materialTable.findMany({
      with: { materialCategories: { with: { category: true } } },
    });
    res.send(materials);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error in get all materials");
  }
});

// Get one material
app.get("/materials/:id", (req, res) => {
  try {
    const { id } = req.params;
    const foundMaterial = db.materials.find((material) => material.id === id);

    if (foundMaterial) {
      res.send(foundMaterial);
      return;
    }

    res.status(404).send(`Material with provided ${id} is not found`);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error in get one material");
  }
});

// Get all materials by one category
app.get("/materials/category/:categoryId", (req, res) => {
  try {
    const { categoryId } = req.params;

    const filteredMaterialIdsByCategory = db.materialCategories
      .filter((materialCategory) => materialCategory.categoryId === categoryId)
      .map((materialCategory) => materialCategory.materialId);

    const filteredMaterials = db.materials.filter((material) =>
      filteredMaterialIdsByCategory.includes(material.id)
    );

    res.send(filteredMaterials);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error in get one material by category");
  }
});

// Update one material
app.put(
  "/materials/:id",
  (req: Request<{ id: string }, {}, MaterialUpdate, {}>, res) => {
    try {
      const body: unknown = req.body;
      const { id } = req.params;
      const parsedBody = materialUpdateSchema.parse(body);

      const foundMaterial = db.materials.find((material) => material.id === id);

      if (!foundMaterial) {
        res.status(404).send(`Material with provided ${id} is not found`);
        return;
      }

      const { categoryIds, ...restParsedBody } = parsedBody;

      let key: keyof Omit<MaterialUpdate, "categoryIds">;

      for (key in restParsedBody) {
        const value = restParsedBody[key];
        if (!value) {
          continue;
        }

        if (key === "url") {
          foundMaterial[key] = value;
        }

        foundMaterial[key] = value as MaterialTypeEnum;
      }

      foundMaterial.updatedAt = Date.now();

      if (categoryIds) {
        const materialCategoriesNotCurrentMaterial =
          db.materialCategories.filter(
            (materialCategory) => materialCategory.materialId !== id
          );

        const updatedMaterialCategoriesOfCurrentMaterial = categoryIds.map(
          (categoryId) => {
            return { categoryId, materialId: id };
          }
        );

        const updatedMaterialCategories = [
          ...materialCategoriesNotCurrentMaterial,
          ...updatedMaterialCategoriesOfCurrentMaterial,
        ];

        db.materialCategories = updatedMaterialCategories;
      }

      console.log("PUT /materials/{id} DB:", db);
      res.send("Material updated successfully");
    } catch (error) {
      console.log(error);
      res.status(500).send("Error in update material");
    }
  }
);

// Delete one material
app.delete("/materials/:id", (req, res) => {
  try {
    const { id } = req.params;

    const foundMaterial = db.materials.find((material) => material.id === id);

    if (!foundMaterial) {
      res.send(`Material with provided ${id} is not found`);
      return;
    }

    const updatedMaterials = db.materials.filter(
      (material) => material.id !== id
    );

    db.materials = updatedMaterials;

    const updatedMaterialCategories = db.materialCategories.filter(
      (materialCategory) => materialCategory.materialId !== id
    );

    db.materialCategories = updatedMaterialCategories;

    console.log("DELETE /materials/{id} DB:", db);
    res.send("Material deleted successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error in delete material");
  }
});

/* RUN APP */
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
