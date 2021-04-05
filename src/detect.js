import { spawn } from "child_process";

import P2P from "pipe2pam";
import PamDiff from "pam-diff";

import { DETECTED_KEY, DIFFERENCE, PERCENT, SMALL_KEY } from "./constants.js";
import { move, remove } from "./utils.js";

export default function detect(smallFileName) {
  const p2p = new P2P();
  const pamDiff = new PamDiff({
    difference: DIFFERENCE,
    percent: PERCENT,
  });

  let detected = false;

  const detection = spawn(
    "ffmpeg",
    [
      "-loglevel",
      "quiet",
      "-hwaccel",
      "auto",
      "-i",
      smallFileName,
      "-an",
      "-c:v",
      "pam",
      "-framerate",
      "1",
      "-pix_fmt",
      "gray",
      "-f",
      "image2pipe",
      "pipe:1",
    ],
    {
      stdio: ["ignore", "pipe", "ignore"],
    }
  ); // remove file on exit

  // if there's movement detected
  pamDiff.on("diff", () => {
    if (!detected) {
      detected = true;
      detection.kill();
    }
  });

  // flag or remove the file when detection complete
  detection.on("exit", () => {
    if (detected) {
      const detectedFileName = smallFileName.replace(
        `-${SMALL_KEY}--`,
        `-${DETECTED_KEY}--`
      );
      move(smallFileName, detectedFileName);
      console.log("🔴 movement detected @", detectedFileName);
    } else {
      remove(smallFileName);
    }
  });

  detection.stdout.pipe(p2p).pipe(pamDiff);
}
