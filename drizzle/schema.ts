import { relations } from "drizzle-orm";
import {
  pgTable,
  pgEnum,
  uuid,
  text,
  timestamp,
  AnyPgColumn,
} from "drizzle-orm/pg-core";

export const materialType = pgEnum("materialType", [
  "ARTICLE",
  "VIDEO",
  "COURSE",
  "IMAGE",
  "DOCUMENTATION",
  "BOOK",
  "OTHER",
]);

// Tables
export const userTable = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  referredByUserId: uuid("referred_by_user_id").references(
    (): AnyPgColumn => userTable.id
  ),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const menteeTable = pgTable("mentee", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

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
  menteeId: uuid("mentee_id")
    .notNull()
    .references(() => menteeTable.id),
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

export const materialRecommendationsTable = pgTable(
  "material_recommendations",
  {
    materialId: uuid("material_id")
      .notNull()
      .references(() => materialTable.id, { onDelete: "cascade" }),
    recommendedMaterialId: uuid("recommended_material_id")
      .notNull()
      .references(() => materialTable.id, { onDelete: "cascade" }),
  },
  (table) => {
    return { columns: [table.materialId, table.recommendedMaterialId] };
  }
);

// Relations
export const userReferredUsersRelations = relations(userTable, ({ many }) => ({
  referredUsers: many(userTable, { relationName: "referredUsers" }),
}));

export const referredByUserRelations = relations(userTable, ({ one }) => ({
  referredBy: one(userTable, {
    fields: [userTable.referredByUserId],
    references: [userTable.id],
    relationName: "referredUsers",
  }),
}));

export const userRelations = relations(userTable, ({ one }) => ({
  mentee: one(menteeTable),
}));

export const menteeRelations = relations(menteeTable, ({ one, many }) => ({
  user: one(userTable, {
    fields: [menteeTable.userId],
    references: [userTable.id],
  }),
  materials: many(materialTable),
}));

export const categoryRelations = relations(categoryTable, ({ many }) => ({
  materialCategories: many(materialCategoriesTable),
}));

export const materialRelations = relations(materialTable, ({ one, many }) => ({
  mentee: one(menteeTable, {
    fields: [materialTable.menteeId],
    references: [menteeTable.id],
  }),
  materialCategories: many(materialCategoriesTable),
  recommendedWith: many(materialRecommendationsTable, {
    relationName: "recommendedWith",
  }),
  recommendedFor: many(materialRecommendationsTable, {
    relationName: "recommendedFor",
  }),
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

export const materialRecommendationsRelations = relations(
  materialRecommendationsTable,
  ({ one }) => ({
    material: one(materialTable, {
      fields: [materialRecommendationsTable.materialId],
      references: [materialTable.id],
      relationName: "recommendedWith",
    }),
    recommendedMaterial: one(materialTable, {
      fields: [materialRecommendationsTable.recommendedMaterialId],
      references: [materialTable.id],
      relationName: "recommendedFor",
    }),
  })
);
