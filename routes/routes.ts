import { Router } from "express";
import { CategoryRoutes } from "./CategoryRoutes";
import { MaterialRoutes } from "./MaterialRoutes";

// Category router
const CategoryRouter = Router();

CategoryRouter.post("/categories", CategoryRoutes.createOneCategory);

CategoryRouter.get("/categories", CategoryRoutes.getAllCategories);

CategoryRouter.get("/categories/:id", CategoryRoutes.getOneCategory);

CategoryRouter.put("/categories/:id", CategoryRoutes.updateOneCategory);

CategoryRouter.delete("/categories/:id", CategoryRoutes.deleteOneCategory);

// Material router
const MaterialRouter = Router();

MaterialRouter.post("/materials", MaterialRoutes.createOneMaterial);

MaterialRouter.get("/materials", MaterialRoutes.getAllMaterials);

MaterialRouter.get("/materials/:id", MaterialRoutes.getOneMaterial);

MaterialRouter.get(
  "/materials/category/:categoryId",
  MaterialRoutes.getAllMaterialsByCategory
);

MaterialRouter.put("/materials/:id", MaterialRoutes.updateOneMaterial);

MaterialRouter.delete("/materials/:id", MaterialRoutes.deleteOneMaterial);

// Base router
const BaseRouter = Router();

BaseRouter.use(CategoryRouter);
BaseRouter.use(MaterialRouter);

export { BaseRouter };
