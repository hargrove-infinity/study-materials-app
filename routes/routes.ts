import { Router } from "express";
import { paths } from "../common";
import { categoryRoutes } from "./categoryRoutes";
import { materialRoutes } from "./materialRoutes";
import { menteeRoutes } from "./menteeRoutes";
import { userRoutes } from "./userRoutes";

// User router
const userRouter = Router();
userRouter.post(paths.users.base, userRoutes.createOneUser);
userRouter.post(paths.users.referred, userRoutes.createOneUserReferred);
userRouter.get(paths.users.base, userRoutes.getAllUsers);

// Mentee router
const menteeRouter = Router();
menteeRouter.post(paths.mentees.base, menteeRoutes.createOneMentee);

// Category router
const categoryRouter = Router();
categoryRouter.post(paths.categories.base, categoryRoutes.createOneCategory);
categoryRouter.get(paths.categories.base, categoryRoutes.getAllCategories);
categoryRouter.get(paths.categories.id, categoryRoutes.getOneCategory);
categoryRouter.put(paths.categories.id, categoryRoutes.updateOneCategory);
categoryRouter.delete(paths.categories.id, categoryRoutes.deleteOneCategory);

// Material router
const materialRouter = Router();
materialRouter.post(paths.materials.base, materialRoutes.createOneMaterial);
materialRouter.get(paths.materials.base, materialRoutes.getAllMaterials);
materialRouter.get(paths.materials.id, materialRoutes.getOneMaterial);
materialRouter.get(
  paths.materials.byCategory,
  materialRoutes.getAllMaterialsByCategory
);
materialRouter.put(paths.materials.id, materialRoutes.updateOneMaterial);
materialRouter.delete(paths.materials.id, materialRoutes.deleteOneMaterial);

// Base router
const baseRouter = Router();
baseRouter.use(userRouter);
baseRouter.use(menteeRouter);
baseRouter.use(categoryRouter);
baseRouter.use(materialRouter);

export { baseRouter };
