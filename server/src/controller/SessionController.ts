import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { v4 as uuidv4 } from "uuid";
import { Session } from "../entity/Session";
import { User } from "../entity/User";
import { UserSession } from "../entity/UserSession";
import { CreateSessionDTO } from "../dto/SessionDTO";

export class SessionController {
  static async createSession(
    req: Request<{}, {}, CreateSessionDTO>,
    res: Response
  ) {
    const { username, name, language } = req.body;

    try {
      const sessionRepository = AppDataSource.getRepository(Session);
      const userRepository = AppDataSource.getRepository(User);
      const userSessionRepository = AppDataSource.getRepository(UserSession);

      const user = await userRepository.findOneBy({ username });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const session = sessionRepository.create({
        token: uuidv4(),
        name,
        language,
        isLocked: false,
      });

      await sessionRepository.save(session);

      const userSession = userSessionRepository.create({
        user,
        session,
        hasAccess: true,
        isCreator: true,
      });

      await userSessionRepository.save(userSession);

      return res.status(201).json(session.token);
    } catch (error) {
      console.error({ error });
      return res.status(500).json({ message: "Internal server error", error });
    }
  }
}
