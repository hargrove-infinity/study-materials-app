import { Router } from "express";
import { CategoryRoutes } from "./CategoryRoutes";
import { MaterialRoutes } from "./MaterialRoutes";
import { Paths } from "../common";

// Category router
const CategoryRouter = Router();

CategoryRouter.post(Paths.Categories.Base, CategoryRoutes.createOneCategory);

CategoryRouter.get(Paths.Categories.Base, CategoryRoutes.getAllCategories);

CategoryRouter.get(Paths.Categories.Id, CategoryRoutes.getOneCategory);

CategoryRouter.put(Paths.Categories.Id, CategoryRoutes.updateOneCategory);

CategoryRouter.delete(Paths.Categories.Id, CategoryRoutes.deleteOneCategory);

// Material router
const MaterialRouter = Router();

MaterialRouter.post(Paths.Materials.Base, MaterialRoutes.createOneMaterial);

MaterialRouter.get(Paths.Materials.Base, MaterialRoutes.getAllMaterials);

MaterialRouter.get(Paths.Materials.Id, MaterialRoutes.getOneMaterial);

MaterialRouter.get(
  Paths.Materials.ByCategory,
  MaterialRoutes.getAllMaterialsByCategory
);

MaterialRouter.put(Paths.Materials.Id, MaterialRoutes.updateOneMaterial);

MaterialRouter.delete(Paths.Materials.Id, MaterialRoutes.deleteOneMaterial);

// Base router
const BaseRouter = Router();

BaseRouter.use(CategoryRouter);
BaseRouter.use(MaterialRouter);

export { BaseRouter };
