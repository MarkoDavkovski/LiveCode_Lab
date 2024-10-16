import { AppDataSource } from "../data-source";
import { LockSessionDTO } from "../dto/SocketEventsDTO";
import { Session } from "../entity/Session";
import { UserSession } from "../entity/UserSession";

export const eventHandler = async (eventData: LockSessionDTO) => {
  const { socket, sessionToken, isLocked, actionedBy } = eventData;
  const sessionRepository = AppDataSource.getRepository(Session);
  const userSessionRepository = AppDataSource.getRepository(UserSession);

  const session = await sessionRepository.findOne({
    where: { token: sessionToken },
  });

  const actionedBySession = await userSessionRepository.findOne({
    where: { session: { token: sessionToken }, user: { username: actionedBy } },
  });

  if (session && actionedBySession) {
    if (actionedBySession.isCreator) {
      session.isLocked = isLocked;
      await sessionRepository.save(session);
      socket.broadcast.emit(`LOCK_SESSION_${sessionToken}`, { isLocked });
    }
  } else {
    console.error(`Session with token ${sessionToken} not found.`);
  }
};
