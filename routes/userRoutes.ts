import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db, userTable } from "../drizzle";
import { queryParamsIdSchema, userDefSchema } from "../validation";

// Users endpoints

// Create one user
async function createOneUser(
  req: Request<{}, {}, unknown>,
  res: Response
): Promise<void> {
  try {
    const body = req.body;
    const parsedBody = userDefSchema.parse(body);

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
    res.send("OK");
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
    const parsedBody = userDefSchema.parse(body);

    const result = await db
      .insert(userTable)
      .values({ ...parsedBody, referredByUserId: id })
      .returning();

    const user = result[0];

    res.status(201).send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error in create one user referred");
  }
}

async function getAllUsers(req: Request, res: Response): Promise<void> {
  try {
    const users = await db.query.userTable.findMany();
    res.send(users);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error in create get all users");
  }
}

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

export const userRoutes = {
  createOneUser,
  createOneUserReferred,
  getAllUsers,
  getOneUser,
} as const;
