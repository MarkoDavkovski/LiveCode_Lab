import { LANGUAGE_VERSIONS } from "./constants";

const BASE_URL = "https://emkc.org/api/v2/piston";

export const executeCode = async (language: Language, sourceCode: string) => {
  const response = await fetch(`${BASE_URL}/execute`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      language: language,
      version: LANGUAGE_VERSIONS[language],
      files: [
        {
          content: sourceCode,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  const data = await response.json();
  return data;
};
