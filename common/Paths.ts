export const Paths = {
  CatchAll: "/{*splat}",
  Categories: {
    Base: "/categories",
    Id: "/categories/:id",
  },
  Materials: {
    Base: "/materials",
    Id: "/materials/:id",
    ByCategory: "/materials/category/:categoryId",
  },
} as const;
