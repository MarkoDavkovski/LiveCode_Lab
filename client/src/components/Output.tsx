import { executeCode } from "@/api";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import socket from "@/socket";
import { useState } from "react";
import { useUserSession } from "@/context/useSessionContext";
import useOutputSocket from "@/hooks/use-ouput-socket";

import * as monaco from "monaco-editor";

interface OutputProps {
  language: string;
  editorRef: React.RefObject<monaco.editor.IStandaloneCodeEditor>;
}

const Output: React.FC<OutputProps> = ({ language, editorRef }) => {
  const [output, setOutput] = useState<string | string[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const { session, currentUsername } = useUserSession();
  const { toast } = useToast();

  useOutputSocket({
    sessionToken: session?.token || "",
    currentUser: currentUsername || "",
    updateOutputValue: setOutput,
  });

  const runCode = async () => {
    const sourceCode = editorRef.current?.getValue();
    if (!sourceCode) return;
    try {
      setIsLoading(true);
      const { run: result } = await executeCode(language, sourceCode);

      if (result.stderr) {
        setOutput(result.stderr);
        setIsError(true);

        toast({
          variant: "destructive",
          title: "Invalid input",
          description: "Code cannot be executed.",
        });
      } else {
        setIsError(false);

        setOutput(result.output.split("\n"));
        socket.emit("EXECUTE_CODE", {
          sessionToken: session?.token,
          code: result.output.split("\n"),
        });

        toast({
          variant: "default",
          title: "Code executed successfully",
          description: "Your code executed successfully.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "There was a problem with your request.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const errorStyling = isError
    ? "border-red-100 text-red-100"
    : "border-dark-100 ";

  return (
    <>
      <Button
        disabled={isLoading}
        onClick={runCode}
        variant="outline"
        className="mb-2 bg-green-700 text-light-200 font-bold">
        {isLoading ? "Loading" : "Execute Code"}
      </Button>
      <div className={`h-[75vh] w-100 border p-2 ${errorStyling} rounded`}>
        {output && isError ? (
          output
        ) : output && !isError ? (
          Array.isArray(output) ? (
            output.map((line, i) => <div key={i}>{line}</div>)
          ) : (
            <div>{output}</div>
          )
        ) : (
          'Click "Execute" to see the code output here.'
        )}
      </div>
    </>
  );
};

export default Output;
