import { Router } from "express";
import { CategoryRoutes } from "./CategoryRoutes";
import { MaterialRoutes } from "./MaterialRoutes";
import { paths } from "../common";

// Category router
const CategoryRouter = Router();

CategoryRouter.post(paths.categories.base, CategoryRoutes.createOneCategory);

CategoryRouter.get(paths.categories.base, CategoryRoutes.getAllCategories);

CategoryRouter.get(paths.categories.id, CategoryRoutes.getOneCategory);

CategoryRouter.put(paths.categories.id, CategoryRoutes.updateOneCategory);

CategoryRouter.delete(paths.categories.id, CategoryRoutes.deleteOneCategory);

// Material router
const MaterialRouter = Router();

MaterialRouter.post(paths.materials.base, MaterialRoutes.createOneMaterial);

MaterialRouter.get(paths.materials.base, MaterialRoutes.getAllMaterials);

MaterialRouter.get(paths.materials.id, MaterialRoutes.getOneMaterial);

MaterialRouter.get(
  paths.materials.byCategory,
  MaterialRoutes.getAllMaterialsByCategory
);

MaterialRouter.put(paths.materials.id, MaterialRoutes.updateOneMaterial);

MaterialRouter.delete(paths.materials.id, MaterialRoutes.deleteOneMaterial);

// Base router
const BaseRouter = Router();

BaseRouter.use(CategoryRouter);
BaseRouter.use(MaterialRouter);

export { BaseRouter };
