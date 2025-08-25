import { Router } from "express";
import { paths } from "../common";
import { categoryRoutes } from "./categoryRoutes";
import { materialRoutes } from "./materialRoutes";
import { menteeRoutes } from "./menteeRoutes";
import { reportRoutes } from "./reportRoutes";
import { userRoutes } from "./userRoutes";

// User router
const userRouter = Router();
userRouter.post(paths.users.base, userRoutes.createOneUser);
userRouter.post(paths.users.referred, userRoutes.createOneUserReferred);
userRouter.get(paths.users.base, userRoutes.getAllUsers);
userRouter.get(paths.users.id, userRoutes.getOneUser);
userRouter.put(paths.users.id, userRoutes.updateOneUser);
userRouter.delete(paths.users.id, userRoutes.deleteOneUser);

// Mentee router
const menteeRouter = Router();
menteeRouter.post(paths.mentees.base, menteeRoutes.createOneMentee);
menteeRouter.get(paths.mentees.base, menteeRoutes.getAllMentees);
menteeRouter.get(paths.mentees.id, menteeRoutes.getOneMentee);
userRouter.put(paths.mentees.id, menteeRoutes.updateOneMentee);
userRouter.delete(paths.mentees.id, menteeRoutes.deleteOneMentee);

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

// Report router
const reportRouter = Router();
reportRouter.get(
  paths.reports.menteesWithMaterials,
  reportRoutes.getAllMenteesWithMaterials
);
reportRouter.get(
  paths.reports.materialsWithCategories,
  reportRoutes.getAllMaterialsWithCategories
);
reportRouter.get(
  paths.reports.categoriesWithMaterials,
  reportRoutes.getAllCategoriesWithMaterials
);
reportRouter.get(
  paths.reports.usedMaterialsDuplicates,
  reportRoutes.getAllUsedMaterialsDuplicates
);
reportRouter.get(
  paths.reports.usedMaterialsDistinct,
  reportRoutes.getAllUsedMaterialsDistinct
);
reportRouter.get(
  paths.reports.materialTypesByCategory,
  reportRoutes.getAllMaterialTypesByCategory
);
reportRouter.get(
  paths.reports.materialTypesByMentee,
  reportRoutes.getAllMaterialTypesByMentee
);
reportRouter.get(
  paths.reports.materialsCategoriesRecommendations,
  reportRoutes.getAllMaterialsCategoriesRecommendations
);

// Base router
const baseRouter = Router();
baseRouter.use(userRouter);
baseRouter.use(menteeRouter);
baseRouter.use(categoryRouter);
baseRouter.use(materialRouter);
baseRouter.use(paths.reports.base, reportRouter);

export { baseRouter };
