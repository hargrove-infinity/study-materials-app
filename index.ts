import express from "express";
import { baseRouter } from "./routes";
import { envVariables } from "./common";

/* SETUP APP */
const app = express();
const jsonMiddleware = express.json();
app.use(jsonMiddleware);

// API router
app.use(baseRouter);

// Catch all routes, not found route error
app.all("/{*splat}", (req, res) => {
  res.status(404).send("Route not found");
});

/* RUN APP */
app.listen(envVariables.port, () => {
  console.log(`Server is running on ${envVariables.port}`);
});
