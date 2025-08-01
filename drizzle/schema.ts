import { relations } from "drizzle-orm";
import { pgTable, pgEnum, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const materialType = pgEnum("materialType", [
  "ARTICLE",
  "VIDEO",
  "COURSE",
  "IMAGE",
  "DOCUMENTATION",
  "OTHER",
]);

export const categoryTable = pgTable("category", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const materialTable = pgTable("material", {
  id: uuid("id").primaryKey().defaultRandom(),
  url: text("url").notNull(),
  type: materialType().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const materialCategoriesTable = pgTable(
  "material_categories",
  {
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categoryTable.id, { onDelete: "cascade" }),
    materialId: uuid("material_id")
      .notNull()
      .references(() => materialTable.id, { onDelete: "cascade" }),
  },
  (table) => {
    return { columns: [table.categoryId, table.materialId] };
  }
);

export const categoryRelations = relations(categoryTable, ({ many }) => ({
  materialCategories: many(materialCategoriesTable),
}));

export const materialRelations = relations(materialTable, ({ many }) => ({
  materialCategories: many(materialCategoriesTable),
}));

export const materialCategoriesRelations = relations(
  materialCategoriesTable,
  ({ one }) => ({
    category: one(categoryTable, {
      fields: [materialCategoriesTable.categoryId],
      references: [categoryTable.id],
    }),
    material: one(materialTable, {
      fields: [materialCategoriesTable.materialId],
      references: [materialTable.id],
    }),
  })
);
