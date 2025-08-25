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
    materialTypesByCategory: "/material-types-by-category",
    materialsCategoriesRecommendations: "/materials-categories-recommendations",
  },
} as const;
