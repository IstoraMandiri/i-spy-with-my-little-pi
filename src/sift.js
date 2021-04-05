import {
  DETECTED_KEY,
  DETECT_TIME,
  FULL_KEY,
  FULL_TIME,
  TEMP_DIR,
} from "./constants.js";
import save from "./save.js";
import { parseFileTimestamp, parseFileType, readDir, remove } from "./utils.js";

// This script is a little bit more involved than it could be in order to make it fault-tolerant
// E.g. if power is lost it will resume uploads on reboot

async function readClips() {
  const clips = { all: [], [DETECTED_KEY]: [], [FULL_KEY]: [] };
  (await readDir(TEMP_DIR)).forEach((fileName) => {
    const clip = {
      fileName,
      timestamp: parseFileTimestamp(fileName),
      type: parseFileType(fileName),
    };
    clips.all.push(clip);
    if (clips[clip.type]) {
      clips[clip.type].push(clip);
    }
  });
  return clips;
}

const fL = FULL_TIME * 1000;
const dL = DETECT_TIME * 1000;

export default async function sift(fullFileName) {
  // ignore anything that's later than our latst confirmed timestamp
  const latestTime = parseFileTimestamp(fullFileName);
  const oldestTime = new Date(latestTime.getTime() - fL * 4);
  // console.log("🔵", { fullFileName, timestamp });
  // get all files filter by full
  const clips = await readClips();
  const clipsToSave = {};

  clips[DETECTED_KEY].forEach((detected) => {
    clips[FULL_KEY].forEach((full) => {
      const fT = full.timestamp.getTime();
      const dT = detected.timestamp.getTime();
      // is within the correct timeframe
      if (full.timestamp <= latestTime && fT < dT + dL + fL && fT + fL > dT) {
        clipsToSave[full.fileName] = full;
      }
    });
  });

  // now save those clips!
  await save(Object.values(clipsToSave));

  // now we've done one sweep (in case of restarts) we can remove all the old clips...
  const { all } = await readClips();
  await Promise.all(
    all
      .filter(({ timestamp }) => timestamp < oldestTime)
      .map(async ({ fileName }) => {
        // console.log("🗑 removing", fileName);
        remove(`${TEMP_DIR}/${fileName}`);
      })
  );
  // donenies
}
