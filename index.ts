import express from "express";
import { BaseRouter } from "./routes";
import { ENV } from "./common";

/* SETUP APP */
const app = express();
const jsonMiddleware = express.json();
app.use(jsonMiddleware);

// API router
app.use(BaseRouter);

// Catch all routes, not found route error
app.all("/{*splat}", (req, res) => {
  res.status(404).send("Route not found");
});

/* RUN APP */
app.listen(ENV.Port, () => {
  console.log(`Server is running on ${ENV.Port}`);
});
