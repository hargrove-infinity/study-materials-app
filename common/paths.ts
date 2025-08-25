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
  },
  materials: {
    base: "/materials",
    id: "/materials/:id",
    byCategory: "/materials/category/:id",
  },
} as const;
