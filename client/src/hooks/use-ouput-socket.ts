import { useEffect } from "react";
import socket from "../socket";
import { OUTPUT_EVENT_NAMES } from "@/constants";
import { useToast } from "@/hooks/use-toast";

type EventNames = (typeof OUTPUT_EVENT_NAMES)[number];

interface EventData {
  code: string;
}

interface UseOutputSocketProps {
  sessionToken: string;
  currentUser: string;
  updateOutputValue: (code: string) => void;
}

const useOutputSocket = ({
  sessionToken,
  currentUser,
  updateOutputValue,
}: UseOutputSocketProps) => {
  const { toast } = useToast();
  useEffect(() => {
    const eventHandlers: Record<EventNames, (data: EventData) => void> = {
      EXECUTE_CODE: (data) => {
        updateOutputValue(data.code);
      },
    };
    if (sessionToken) {
      OUTPUT_EVENT_NAMES.forEach((event) => {
        socket.on(`${event}_${sessionToken}`, eventHandlers[event]);
      });
    }

    return () => {
      if (sessionToken) {
        OUTPUT_EVENT_NAMES.forEach((event) => {
          socket.off(`${event}_${sessionToken}`, eventHandlers[event]);
        });
      }
    };
  }, [sessionToken, currentUser]);
};

export default useOutputSocket;
