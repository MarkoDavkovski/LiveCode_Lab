"use client";

import { DialogButton } from "@/components/DialogButton";
import LanguageSelector from "@/components/LanguageSelector";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { createSession } from "@/lib/actions/session.actions";
import { useRouter } from "next/navigation";
import { CLIENT_API_URL } from "../../config";
import { joinOrCreateUserSession } from "@/lib/actions/user-session.actions";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import LogoutButton from "./LogoutButton";

const HomePageButtons: React.FC<HomePageButtonsProps> = ({
  username,
  userSessions,
}) => {
  const [language, setLanguage] = useState<string>("javascript");
  const [sessionName, setSessionName] = useState<string>("");
  const [inviteLink, setInviteLink] = useState<string>("");
  const router = useRouter();

  const onSelect = (language: string) => {
    setLanguage(language);
  };

  const handleCreateSession = async () => {
    if (!sessionName.trim()) {
      alert("Please enter a valid session name.");
      return;
    }
    try {
      const response = await createSession(username, sessionName, language);
      router.push(CLIENT_API_URL + `/session/${response}`);
    } catch (error) {
      console.error("Error creating session:", error);
      alert("Failed to create session. Please try again.");
    }
  };

  const handleJoinSession = async (sessionToken: string) => {
    try {
      const userSession = await joinOrCreateUserSession(username, sessionToken);
      if (userSession) {
        router.push(`/session/${sessionToken}`);
      } else {
        alert(
          "Failed to join session. Please check the invite link or your access rights."
        );
      }
    } catch (error) {
      alert("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <>
      <DialogButton
        title="Create session"
        description="Provide the session details below to create a new session."
        buttonText="Create"
        fields={[
          {
            id: "session-name",
            label: "Session Name",
            placeholder: "Enter session name",
            type: "custom",
            component: (
              <Input
                type="text"
                id="session-name"
                className="col-span-3"
                value={sessionName}
                onChange={(e) => {
                  setSessionName(e.target.value);
                }}
              />
            ),
          },
          {
            id: "session-language",
            label: "Session Language",
            defaultValue: language,
            type: "custom",
            component: (
              <LanguageSelector language={language} onSelect={onSelect} />
            ),
          },
        ]}
        onSubmit={handleCreateSession}
      />
      <DialogButton
        title="Join session"
        description="Paste the invite link below to join an existing session."
        buttonText="Join Session"
        fields={[
          {
            id: "session-token",
            label: "Invite link",
            placeholder: "Paste Session Token here",
            type: "custom",
            defaultValue: inviteLink,
            component: (
              <Input
                type="text"
                id="session-token"
                className="col-span-3"
                value={inviteLink}
                onChange={(e) => {
                  setInviteLink(e.target.value);
                }}
              />
            ),
          },
        ]}
        onSubmit={() => handleJoinSession(inviteLink?.split("/").pop() || "")}
      />

      <div className="mt-10">
        <Table>
          <TableCaption>A list of your sessions.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Session Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userSessions && userSessions.length > 0 ? (
              userSessions.map((sessionData) => (
                <TableRow key={sessionData.id}>
                  <TableCell className="font-medium">
                    {sessionData.session.name}
                  </TableCell>
                  <TableCell>
                    {sessionData.hasAccess ? "Available" : "Access Denied"}
                  </TableCell>
                  <TableCell className="text-right">
                    <button
                      onClick={() =>
                        handleJoinSession(sessionData.session.token)
                      }
                      disabled={!sessionData.hasAccess}
                      className={`${
                        sessionData.hasAccess
                          ? "bg-blue-500 text-white hover:bg-blue-600 text-xs"
                          : "bg-gray-400 text-gray-200 cursor-not-allowed"
                      } p-2 rounded`}>
                      {sessionData.hasAccess ? "Join" : "Access Denied"}
                    </button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  No sessions available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <LogoutButton />
    </>
  );
};

export default HomePageButtons;
