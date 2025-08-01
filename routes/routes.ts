import { Router } from "express";
import { CategoryRoutes } from "./CategoryRoutes";

// Category router
const CategoryRouter = Router();

CategoryRouter.post("/categories", CategoryRoutes.createOneCategory);

CategoryRouter.get("/categories", CategoryRoutes.getAllCategories);

CategoryRouter.get("/categories/:id", CategoryRoutes.getOneCategory);

CategoryRouter.put("/categories/:id", CategoryRoutes.updateOneCategory);

CategoryRouter.delete("/categories/:id", CategoryRoutes.deleteOneCategory);

// Base router
const BaseRouter = Router();

BaseRouter.use(CategoryRouter);

export { BaseRouter };
