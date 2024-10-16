"use client";

import Image from "next/image";
import Link from "next/link";
import Footer from "./Footer";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import socket from "@/socket";
import ShareSessionButton from "./ShareSessionButton";
import { useUserSession } from "@/context/useSessionContext";
import { useEffect, useState } from "react";
import useSidebarSocket from "@/hooks/user-sidebar-socket";

const Sidebar = () => {
  const { userSession, session, currentUsername } = useUserSession();
  const sessionToken = session?.token || "";
  const router = useRouter();
  const [connectedUsers, setConnectedUsers] = useState<string[]>([]);

  useEffect(() => {
    const jwtFromSession = sessionStorage.getItem("jwt");
    if (jwtFromSession) {
    } else {
      router.push("/sign-in");
    }
  }, [router]);

  useEffect(() => {
    const users = userSession?.map((us) => us.user.username) || [];
    setConnectedUsers(users);
  }, [userSession]);

  const updateConnectedUsers = (action: "join" | "kick", username: string) => {
    if (action === "join") {
      setConnectedUsers((prev) => {
        if (!prev.includes(username)) {
          return [...prev, username];
        }
        return prev;
      });
    } else if (action === "kick") {
      setConnectedUsers((prev) => prev.filter((user) => user !== username));
    }
  };

  useSidebarSocket({
    sessionToken: sessionToken || "",
    currentUser: currentUsername || "",
    router: router,
    updateConnectedUsers,
  });

  const isCurrentUserCreator = userSession?.some(
    (us) => us.isCreator && us.user.username === currentUsername
  );

  const handleKick = async (username: string) => {
    socket.emit("KICK_USER", {
      username,
      sessionToken,
      actionedBy: currentUsername,
    });
  };

  return (
    <section className="sidebar border-r-black-1">
      <nav className="flex items-center gap-2">
        <Link href="/" className="cursor-pointer">
          <Image
            src="https://mozok.de/_next/static/media/mozok-logo-with-background.37b86805.svg"
            width={34}
            height={34}
            alt="Mozok Logo"
            className="size-[24px] max-xl:size-14"
          />
        </Link>
        <h1 className="sidebar-logo">LiveCode Lab</h1>
      </nav>
      <main>
        {connectedUsers && connectedUsers.length > 0 && (
          <div>
            <span className="text-md">Users with access:</span>

            <ul>
              {connectedUsers.map((sessionUser, index) => (
                <li key={index} className="flex justify-between items-center ">
                  {sessionUser}
                  {isCurrentUserCreator && sessionUser !== currentUsername && (
                    <Button
                      onClick={() => handleKick(sessionUser)}
                      variant="ghost"
                      className="text-red-600"
                      size="sm">
                      Kick user
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="bg-dark-100 h-[1px] w-100 my-10" />
        <ShareSessionButton sessionToken={sessionToken} />
      </main>

      <Footer
        user={
          userSession?.find((us) => us.user.username === currentUsername)
            ?.user ?? null
        }
      />
    </section>
  );
};

export default Sidebar;
