import { useEffect } from "react";
import socket from "../socket";
import { SESSION_EVENT_NAMES } from "@/constants";
import { useToast } from "@/hooks/use-toast";

type EventNames = (typeof SESSION_EVENT_NAMES)[number];

interface EventData {
  username: string;
  updatedCode: string;
  isLocked: boolean;
  code: string;
}

interface UseSessionSocketProps {
  sessionToken: string;
  currentUser: string;
  router: any;
  updateCurrentCode: (actionedBy: string, code: string) => void;
  updateSession: (isLocked: boolean) => void;
  updateSessionCode: (code: string) => void;
}

const useSessionSocket = ({
  sessionToken,
  currentUser,
  router,
  updateCurrentCode,
  updateSession,
  updateSessionCode,
}: UseSessionSocketProps) => {
  const { toast } = useToast();
  useEffect(() => {
    const eventHandlers: Record<EventNames, (data: EventData) => void> = {
      CODE_CHANGE: (data) => {
        updateCurrentCode(data.username, data.updatedCode);
      },
      LOCK_SESSION: (data) => {
        updateSession(data.isLocked);
        toast({
          variant: "default",
          title: `${data.isLocked ? "Session locked" : "Session unlocked"}`,
          description: `${
            data.isLocked
              ? "You are not allowed to code in this session"
              : "The session is unlocked, you can start coding again."
          }`,
        });
      },
      CODE_SUBMIT: (data) => {
        updateSessionCode(data.code);
        toast({
          variant: "default",
          title: `Code saved`,
          description: `Code saved by ${data.username}`,
        });
      },
    };

    if (sessionToken) {
      SESSION_EVENT_NAMES.forEach((event) => {
        socket.on(`${event}_${sessionToken}`, eventHandlers[event]);
      });
    }

    return () => {
      if (sessionToken) {
        SESSION_EVENT_NAMES.forEach((event) => {
          socket.off(`${event}_${sessionToken}`, eventHandlers[event]);
        });
      }
    };
  }, [sessionToken, currentUser, router]);
};

export default useSessionSocket;
