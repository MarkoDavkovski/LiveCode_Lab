"use client";

import Editor from "@monaco-editor/react";
import { useEffect, useRef, useState } from "react";
import Output from "./Output";
import useSessionSocket from "@/hooks/use-session-socket";
import socket from "@/socket";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { useUserSession } from "@/context/useSessionContext";

import * as monaco from "monaco-editor";

interface SessionData {
  isLocked: boolean;
  language: string;
}

const CodeEditor: React.FC = () => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [value, setValue] = useState<string>("");
  const [sessionData, setSessionData] = useState<SessionData>({
    isLocked: false,
    language: "javascript",
  });
  const [actionedBy, setActionedBy] = useState<string>("");
  const { userSession, session, currentUsername, codeSnippet } =
    useUserSession();
  const router = useRouter();
  const sessionToken = session?.token || "";

  useEffect(() => {
    if (session)
      setSessionData({
        isLocked: session.isLocked,
        language: session.language,
      });
  }, [session]);

  useEffect(() => {
    if (userSession && currentUsername) {
      const userHasAccess = userSession?.some(
        (user) => user.user.username === currentUsername && user.hasAccess
      );
      if (!userHasAccess) {
        router.push("/");
      } else {
        setValue(codeSnippet?.content || "");
        socket.emit("USER_JOIN", {
          sessionToken,
          username: currentUsername,
        });
      }
    } else if (currentUsername && !userSession) {
      router.push("/");
    }
  }, [userSession, currentUsername, router]);

  const handleCodeChange = (newCode: string) => {
    socket.emit("CODE_CHANGE", {
      updatedCode: newCode,
      sessionToken,
      username: currentUsername,
    });
  };

  const updateCurrentCode = (actionedBy: string, code: string) => {
    setValue(code);
    setActionedBy(actionedBy);
  };

  const updateSession = (isLocked: boolean) => {
    setSessionData((prevState) => ({ ...prevState, isLocked }));
  };

  const lockSession = (isLocked: boolean) => {
    socket.emit("LOCK_SESSION", {
      sessionToken,
      isLocked,
      actionedBy: currentUsername,
    });
    setSessionData((prevState) => ({ ...prevState, isLocked }));
  };

  const handleCodeSubmit = () => {
    socket.emit("CODE_SUBMIT", {
      code: value,
      sessionToken,
      username: currentUsername,
    });
  };

  useSessionSocket({
    sessionToken: sessionToken || "",
    currentUser: currentUsername || "",
    router: router,
    updateCurrentCode,
    updateSession,
    updateSessionCode: setValue,
  });

  const isCurrentUserCreator = userSession?.some(
    (us) => us.isCreator && us.user.username === currentUsername
  );

  const onMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
    editor.focus();
  };

  return (
    <>
      <h1 className="w-100 text-center text-xl">
        <strong> {session?.name}</strong>
      </h1>
      <div className="flex gap-2">
        <div className="w-[50%]">
          <div className="w-100 flex justify-between">
            <Button
              disabled={true}
              variant="default"
              className="mb-2 bg-transparent text-purple-700 font-bold">
              {session?.language}
            </Button>
            {actionedBy && (
              <span className="text-xs my-auto">
                [Currently Typing :
                <strong>
                  {actionedBy === currentUsername ? "You" : actionedBy}{" "}
                </strong>
                ]
              </span>
            )}
          </div>
          <Editor
            options={{ readOnly: sessionData?.isLocked }}
            height="75vh"
            theme="vs-dark"
            language={sessionData.language}
            value={value}
            onMount={onMount}
            onChange={(val: string | undefined) => {
              if (val !== undefined) {
                handleCodeChange(val);
                setValue(val);
              }
            }}
          />
        </div>
        <div className="w-[50%]">
          <Output language={sessionData.language} editorRef={editorRef} />
        </div>
      </div>
      <div className="w-[50%] flex justify-between mt-3">
        {isCurrentUserCreator && (
          <Button
            variant={sessionData.isLocked ? "outline" : "destructive"}
            onClick={() => lockSession(!sessionData.isLocked)}>
            {sessionData.isLocked ? "Unlock Session" : "Lock Session"}
          </Button>
        )}
        <Button
          variant="default"
          onClick={() => handleCodeSubmit()}
          className="ml-2">
          Save Code
        </Button>
      </div>
    </>
  );
};

export default CodeEditor;
