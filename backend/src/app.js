import express from "express";

const app = express();

app.use(express.json({ limit: "16kb" }));

//import routes
import userRouter from "./routes/user.routes.js";

//routes declaration
app.use("/api/v1/users", userRouter);

export { app };
