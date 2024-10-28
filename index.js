  import express from "express";
  import cors from "cors";
  import cookieParser from "cookie-parser";
  import mongoose from "mongoose";
  import dotenv from "dotenv";
  dotenv.config();

  import { createServer } from "node:http";
  import { Server } from "socket.io";

  const app = express();
  const server = createServer(app);
  const io = new Server(server, { 
    cors: {
      origin: process.env.WEB_ORIGIN,
    },
  });

  import { errorHandler, NotFound } from "./middleware/error-handler.js";

  app.use(
    cors({
      origin: process.env.WEB_ORIGIN,
      methods: ["POST", "GET", "DELETE", "PUT"],
      credentials: true,
    })
  );
  const mongoUrl = process.env.DATABASE_URL;
  if (!mongoUrl) {
    throw new Error("MongoDB connection string is not defined.");
  }

  mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  mongoose.connection.on("error", (error) =>
    console.error("MongoDB connection error:", error)
  );

  // middlewares  
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(cookieParser());

    import Auth from "./routes/authRoute.js";
  import userAuth from "./routes/userRoute.js";

  app.use("/api/v1/auth", Auth);
  app.use("/api/v1/user", userAuth);

  // // Middlewares
  app.use(NotFound);  
  app.use(errorHandler);

  app.listen(process.env.PORT, () => {
    console.log( `server is listening on port ${process.env.PORT}`);
  });
