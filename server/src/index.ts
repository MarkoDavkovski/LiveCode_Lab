import * as express from "express";
import { Request, Response } from "express";
import { AppDataSource } from "./data-source";
import { Routes } from "./routes";
import * as dotenv from "dotenv";
import * as cors from "cors";
import initSocket from "./socket";

const http = require("http");

dotenv.config();

AppDataSource.initialize()
  .then(async () => {
    const app = express();
    app.use(express.json());

    app.use(
      cors({
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
      })
    );

    const server = http.createServer(app);
    initSocket(server);

    Routes.forEach((route) => {
      (app as any)[route.method](
        route.route,
        async (req: Request, res: Response, next: Function) => {
          try {
            const result = await (route.controller as any)[route.action](
              req,
              res,
              next
            );

            if (result !== undefined) {
              res.json(result);
            }
          } catch (error) {
            next(error);
          }
        }
      );
    });

    const PORT = process.env.PORT || 5000;

    server.listen(PORT, () => {
      console.log(
        `Server has started on port ${PORT}. Open http://localhost:${PORT}/users to see results`
      );
    });
  })
  .catch((error) => {
    console.error("Error during Data Source initialization:", error);
  });
