import dotenv from "dotenv";
import { app } from "./app.js";
import { connectDB } from "./db/db.js";

dotenv.config();

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`app running on ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("mongoDB connection failed!");
  });
