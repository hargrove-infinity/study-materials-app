export const paths = {
  catchAll: "/{*splat}",
  users: {
    base: "/users",
    referred: "/users/referred/:id",
    id: "/users/:id",
  },
  mentees: { base: "/mentees", id: "/mentees/:id" },
  categories: {
    base: "/categories",
    id: "/categories/:id",
    replace: "/categories/:id/replace",
    replaceById: "/categories/:oldCategoryId/replace/:newCategoryId",
  },
  materials: {
    base: "/materials",
    id: "/materials/:id",
    byCategory: "/materials/category/:id",
  },
  reports: {
    base: "/reports",
    menteesWithMaterials: "/mentees-with-materials",
    materialsWithCategories: "/materials-with-categories",
    categoriesWithMaterials: "/categories-with-materials",
    usedMaterialsDistinct: "/used-materials/distinct",
    usedMaterialsDuplicates: "/used-materials/duplicates",
    categoriesWithMaterialCategories: "/categories-with-material-categories",
    materialTypesByMentee: "/material-types-by-mentee",
    materialsCategoriesRecommendations: "/materials-categories-recommendations",
  },
} as const;
