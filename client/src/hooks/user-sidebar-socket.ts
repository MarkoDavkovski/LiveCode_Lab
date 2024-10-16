import { useEffect } from "react";
import socket from "../socket";
import { SIDEBAR_EVENT_NAMES } from "@/constants";
import { useToast } from "@/hooks/use-toast";

type EventNames = (typeof SIDEBAR_EVENT_NAMES)[number];

interface EventData {
  username: string;
}

interface UseSidebarSocketProps {
  sessionToken: string;
  currentUser: string;
  router: any;
  updateConnectedUsers: (action: "join" | "kick", username: string) => void;
}

const useSidebarSocket = ({
  sessionToken,
  currentUser,
  router,
  updateConnectedUsers,
}: UseSidebarSocketProps) => {
  const { toast } = useToast();
  useEffect(() => {
    const eventHandlers: Record<EventNames, (data: EventData) => void> = {
      USER_JOIN: (data) => {
        updateConnectedUsers("join", data.username);
        toast({
          variant: "default",
          title: "New user joined",
          description: `${data.username} joined this session.`,
        });
      },
      KICK_USER: (data) => {
        if (currentUser === data.username) {
          toast({
            variant: "destructive",
            title: "You were kicked",
            description: "You were kicked from this coding session.",
          });
          router.push("/");
        } else {
          updateConnectedUsers("kick", data.username);

          toast({
            variant: "default",
            title: "User Kicked",
            description: `${data.username} was kicked from this Coding Session.`,
          });
        }
      },
    };

    if (sessionToken) {
      SIDEBAR_EVENT_NAMES.forEach((event) => {
        socket.on(`${event}_${sessionToken}`, eventHandlers[event]);
      });
    }

    return () => {
      if (sessionToken) {
        SIDEBAR_EVENT_NAMES.forEach((event) => {
          socket.off(`${event}_${sessionToken}`, eventHandlers[event]);
        });
      }
    };
  }, [sessionToken, currentUser, router]);
};

export default useSidebarSocket;
