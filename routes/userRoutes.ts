import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db, userTable } from "../drizzle";
import {
  queryParamsIdSchema,
  userInsertSchema,
  userUpdateSchema,
} from "../validation";

// Users endpoints

// Create one user
async function createOneUser(
  req: Request<{}, {}, unknown>,
  res: Response
): Promise<void> {
  try {
    const body = req.body;
    const parsedBody = userInsertSchema.parse(body);

    const fetchedUser = await db.query.userTable.findFirst({
      where: eq(userTable.email, parsedBody.email),
    });

    if (fetchedUser) {
      res.status(409).send("User creation failed");
      return;
    }

    const result = await db.insert(userTable).values(parsedBody).returning();
    const createdUser = result[0];

    res.status(201).send(createdUser);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error in create one user");
  }
}

// Create one referred user
async function createOneUserReferred(
  req: Request<unknown, {}, unknown>,
  res: Response
): Promise<void> {
  try {
    const params = req.params;
    const parsedParams = queryParamsIdSchema.parse(params);
    const { id } = parsedParams;

    const body = req.body;
    const parsedBody = userInsertSchema.parse(body);

    const result = await db
      .insert(userTable)
      .values({ ...parsedBody, invitedByUserId: id })
      .returning();

    const user = result[0];

    res.status(201).send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error in create one user referred");
  }
}

// Get all users
async function getAllUsers(req: Request, res: Response): Promise<void> {
  try {
    const users = await db.query.userTable.findMany();
    res.send(users);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error in create get all users");
  }
}

// Get one user
async function getOneUser(req: Request<unknown>, res: Response): Promise<void> {
  try {
    const params = req.params;
    const parsedParams = queryParamsIdSchema.parse(params);
    const { id } = parsedParams;

    const user = await db.query.userTable.findFirst({
      where: eq(userTable.id, id),
    });

    if (!user) {
      res.status(400).send(`User with provided id ${id} is not found`);
      return;
    }

    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error in get one user");
  }
}

// Update one user
async function updateOneUser(
  req: Request<unknown, {}, unknown>,
  res: Response
): Promise<void> {
  try {
    const params = req.params;
    const parsedParams = queryParamsIdSchema.parse(params);
    const { id } = parsedParams;

    const fetchedUserById = await db.query.userTable.findFirst({
      where: eq(userTable.id, id),
    });

    if (!fetchedUserById) {
      res.status(400).send(`User with provided id ${id} is not found`);
      return;
    }

    const body = req.body;
    const parsedBody = userUpdateSchema.parse(body);

    if (parsedBody.email) {
      const fetchedUserByEmail = await db.query.userTable.findFirst({
        where: eq(userTable.email, parsedBody.email),
      });

      if (fetchedUserByEmail) {
        res.status(409).send("User can not update email");
        return;
      }
    }

    const result = await db
      .update(userTable)
      .set(parsedBody)
      .where(eq(userTable.id, id))
      .returning();

    const updatedUser = result[0];

    res.send(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error in updating one user");
  }
}

// Delete one user
async function deleteOneUser(
  req: Request<unknown>,
  res: Response
): Promise<void> {
  try {
    const params = req.params;
    const parsedParams = queryParamsIdSchema.parse(params);
    const { id } = parsedParams;

    const user = await db.query.userTable.findFirst({
      where: eq(userTable.id, id),
    });

    if (!user) {
      res.status(400).send(`User with provided id ${id} is not found`);
      return;
    }

    await db.delete(userTable).where(eq(userTable.id, id)).returning();

    res.send("User successfully deleted");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error in deleting one user");
  }
}

export const userRoutes = {
  createOneUser,
  createOneUserReferred,
  getAllUsers,
  getOneUser,
  updateOneUser,
  deleteOneUser,
} as const;
