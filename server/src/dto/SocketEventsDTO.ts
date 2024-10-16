import { Socket } from "socket.io";

export class UserJoinDTO {
  socket: Socket;
  sessionToken: string;
  username: string;
}

export class CodeChangeDTO {
  socket: Socket;
  sessionToken: string;
  updatedCode: string;
  username: string;
}

export class CodeSubmitDTO {
  socket: Socket;
  sessionToken: string;
  code: string;
  username: string;
}

export class ExecuteCodeDTO {
  socket: Socket;
  sessionToken: string;
  code: string;
}

export class KickUserDTO {
  socket: Socket;
  sessionToken: string;
  username: string;
  actionedBy: string;
}

export class LockSessionDTO {
  socket: Socket;
  sessionToken: string;
  isLocked: boolean;
  actionedBy: string;
}
