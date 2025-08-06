export const paths = {
  catchAll: "/{*splat}",
  users: { base: "/users" },
  mentees: { base: "/mentees" },
  categories: {
    base: "/categories",
    id: "/categories/:id",
  },
  materials: {
    base: "/materials",
    id: "/materials/:id",
    byCategory: "/materials/category/:id",
  },
} as const;
