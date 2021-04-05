import { readdir, rm, rename, readFile as rf } from "fs";
import { promisify } from "util";

export const readDir = promisify(readdir);
export const remove = promisify(rm);
export const move = promisify(rename);
export const readFile = promisify(rf);

export function pluckRawTimestamp(str) {
  const [rawTimestamp] = str.split("--").pop().split(".");
  return rawTimestamp;
}

export function parseRawTimestamp(str) {
  const [date, time] = str.split("_");
  const timestamp = new Date(`${date}T${time.replace(/-/g, ":")}`);
  return timestamp;
}

export function parseFileTimestamp(filePath) {
  return parseRawTimestamp(pluckRawTimestamp(filePath));
}

export function parseFileType(filePath) {
  return filePath.split("/").pop().split("--")[0].split("-").pop();
}
