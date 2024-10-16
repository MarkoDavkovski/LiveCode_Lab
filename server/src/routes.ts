import { UserController } from "./controller/UserController";
import { SessionController } from "./controller/SessionController";
import { UserSessionController } from "./controller/UserSessionController";

export const Routes = [
  //#region USER_CONTROLLER
  {
    method: "post",
    route: "/users/register",
    controller: UserController,
    action: "registerUser", // Action for handling user registration
  },
  {
    method: "post",
    route: "/users/login",
    controller: UserController,
    action: "loginUser", //Action for handling user login
  },
  //#endregion
  //#region  SESSION_CONTROLLER
  {
    method: "post",
    route: "/sessions",
    controller: SessionController,
    action: "createSession", // Action for creating session
  },
  //#endregion
  //#region USER_SESSION_CONTROLLER
  {
    method: "post",
    route: "/user-sessions",
    controller: UserSessionController,
    action: "joinOrCreateUserSession", // Action for creating a user session record or joining a user session
  },
  {
    method: "get",
    route: "/user-sessions/user/:username",
    controller: UserSessionController,
    action: "getAllUserSessions", // Action for getting all sessions for a user
  },
  {
    method: "get",
    route: "/user-sessions/:token",
    controller: UserSessionController,
    action: "getUserSessionDetails", // Action for getting details of a user session
  },
  //#endregion
];
