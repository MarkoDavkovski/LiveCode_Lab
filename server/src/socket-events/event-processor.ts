import * as fs from "fs";
import * as path from "path";

export const EVENT_NAMES = [
  "USER_JOIN",
  "CODE_SUBMIT",
  "CODE_CHANGE",
  "EXECUTE_CODE",
  "KICK_USER",
  "LOCK_SESSION",
];

export async function processEvents(eventName: string, eventData: any) {
  try {
    const eventFile = path.resolve(`src/socket-events/${eventName}_EVENT.ts`);

    if (fs.existsSync(eventFile)) {
      const { eventHandler } = await import(eventFile);
      eventHandler(eventData);
    } else {
      console.warn(`Event handler for ${eventName} not found.`);
    }
  } catch (error) {
    console.error(`Error processing event: ${eventName}`, error);
  }
}
