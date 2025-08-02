export const paths = {
  catchAll: "/{*splat}",
  categories: {
    base: "/categories",
    id: "/categories/:id",
  },
  materials: {
    base: "/materials",
    id: "/materials/:id",
    byCategory: "/materials/category/:categoryId",
  },
} as const;
