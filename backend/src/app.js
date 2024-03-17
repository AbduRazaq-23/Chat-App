import express from "express";
import cookieParser from "cookie-parser";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());

//import routes
import userRouter from "./routes/user.routes.js";
import chatRouter from "./routes/chat.routes.js";
import bodyParser from "body-parser";

//routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/chats", chatRouter);

export { app };
