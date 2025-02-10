import express, { urlencoded } from "express";
import { PORT } from "./config/env.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import connectToDatabase from "./database/mongodb.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";

// -------------- instantiating the server -----------------

const app = express();

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// -------------- common builtin middlewares ---------------

// allows us to handle JSON data sent through the body of a request
app.use(express.json());
// allows us to process the formdata in simple format
app.use(urlencoded({ extended: false }));
// used to read cookies from an incoming request, so that we can store/process that data
app.use(cookieParser());

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// -------------- custom middlewares -----------------------
// error middleware
app.use(errorMiddleware);

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// -------------- routes setup --------------

// adding our all the different routes here
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/subscription", subscriptionRouter);

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// ------- listening the server to a particular port -------

app.listen(PORT, async () => {
  console.log(`Server running on: http://localhost:${PORT}`);

  await connectToDatabase();
});

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------

export default app;
