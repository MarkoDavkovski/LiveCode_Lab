import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { UserSession } from "../entity/UserSession";
import { Session } from "../entity/Session";
import { User } from "../entity/User";
import { IsNull, Not } from "typeorm";
import {
  JoinOrCreateUserSessionDTO,
  UserSessionDetailsResponseDTO,
  UserSessionResponseDTO,
} from "../dto/UserSessionDTO";

export class UserSessionController {
  // Create a user session record when a user joins
  static async joinOrCreateUserSession(
    req: Request<{}, {}, JoinOrCreateUserSessionDTO>,
    res: Response<UserSessionResponseDTO | { message: string }>
  ) {
    const { username, token } = req.body;
    try {
      const userRepository = AppDataSource.getRepository(User);
      const sessionRepository = AppDataSource.getRepository(Session);
      const userSessionRepository = AppDataSource.getRepository(UserSession);

      const user = await userRepository.findOneBy({ username });
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      const session = await sessionRepository.findOneBy({ token });
      if (!session) {
        return res.status(404).json({ message: "Session not found." });
      }

      const existingUserSession = await userSessionRepository.findOne({
        where: { user: { username }, session: { token } },
      });

      if (existingUserSession) {
        if (existingUserSession.hasAccess) {
          return res.status(200).json(existingUserSession);
        } else {
          return res
            .status(403)
            .json({ message: "User does not have access." });
        }
      }

      const userSession = userSessionRepository.create({
        user,
        session,
        hasAccess: true,
        isCreator: false,
      });

      await userSessionRepository.save(userSession);

      return res.status(201).json(userSession);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Get all sessions for one user
  static async getAllUserSessions(
    req: Request<{ username: string }>,
    res: Response<UserSessionResponseDTO[] | { message: string }>
  ) {
    const { username } = req.params;
    try {
      const userSessionRepository = AppDataSource.getRepository(UserSession);

      const sessions = await userSessionRepository.find({
        where: { user: { username } },
        relations: ["session"],
      });

      if (!sessions.length) {
        return res
          .status(404)
          .json({ message: "No sessions found for this user." });
      }
      return res.status(200).json(sessions);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Get all details for a user session
  static async getUserSessionDetails(
    req: Request<{ token: string }>,
    res: Response<UserSessionDetailsResponseDTO | { message: string }>
  ) {
    const { token } = req.params;

    try {
      const userSessionRepository = AppDataSource.getRepository(UserSession);
      const sessionRepository = AppDataSource.getRepository(Session);

      const session = await sessionRepository.findOneBy({ token });

      const userSessions = await userSessionRepository.find({
        where: { session: { token } },
        relations: ["user", "codeSnippet"],
      });

      if (!userSessions.length) {
        return res
          .status(404)
          .json({ message: "No user sessions found for this token." });
      }

      const latestCodeSnippet = await userSessionRepository.findOne({
        where: {
          session: { token },
          codeSnippet: { id: Not(IsNull()) },
        },
        relations: ["codeSnippet"],
        order: { codeSnippet: { createdAt: "DESC" } },
      });

      userSessions.map((session) => delete session.user.password);

      return res.status(200).json({
        session,
        userSessions,
        codeSnippet: latestCodeSnippet?.codeSnippet,
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
