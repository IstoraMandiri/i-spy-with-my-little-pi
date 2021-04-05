import { spawn } from "child_process";

import {
  TEMP_DIR,
  SEGMENT_PREFIX,
  WIDTH,
  HEIGHT,
  FPS,
  DEVICE,
  BITRATE,
  VIDEO_FORMAT,
  SMALL_KEY,
  DATE_FORMAT,
  FULL_KEY,
  FULL_TIME,
  DETECT_TIME,
} from "./constants.js";

import detect from "./detect.js";
import sift from "./sift.js";

export default function record() {
  console.log("⚪ start recording... ", new Date());

  const id = new Date().getTime();
  const filePrefix = `${TEMP_DIR}/${SEGMENT_PREFIX}-${id}`;
  const smallFileName = `${filePrefix}-${SMALL_KEY}--${DATE_FORMAT}.${VIDEO_FORMAT}`;
  const fullFileName = `${filePrefix}-${FULL_KEY}--${DATE_FORMAT}.${VIDEO_FORMAT}`;

  const recording = spawn("ffmpeg", [
    "-loglevel",
    "verbose",
    "-s",
    `${WIDTH}x${HEIGHT}`,
    "-re",
    "-hwaccel",
    "auto",
    "-framerate",
    `${FPS}`,
    "-i",
    DEVICE,
    // detector output
    "-c:v",
    "h264_omx",
    "-vf",
    "fps=1,scale=128:96",
    "-f",
    "segment",
    "-segment_time",
    DETECT_TIME,
    // "-segment_atclocktime",
    // "1",
    "-reset_timestamps",
    "1",
    "-segment_format",
    VIDEO_FORMAT,
    "-strftime",
    "1",
    smallFileName,
    // main output
    "-c:v",
    "h264_omx",
    "-b:v",
    BITRATE,
    "-vf",
    "drawtext='fontfile=FreeSans.ttf:text=%{localtime}':fontsize=30:fontcolor=white@1:box=1:boxcolor=black@0.9:x=(w-tw)/2:y=0",
    "-f",
    "segment",
    "-segment_time",
    FULL_TIME,
    "-segment_atclocktime",
    "1",
    "-reset_timestamps",
    "1",
    "-segment_format",
    VIDEO_FORMAT,
    "-strftime",
    "1",
    fullFileName,
  ]);

  // trigger detection relevant files created
  recording.stderr.on("data", (data) => {
    const d = data.toString();
    if (d.indexOf(" ended") > -1) {
      const [, fileName] = d.split("'");
      // console.log("created", fileName);
      if (fileName.indexOf(`-${SMALL_KEY}--`) > -1) {
        // TODO option to ignore first one (camera adjusting to light)
        detect(fileName);
      } else if (fileName.indexOf(`-${FULL_KEY}--`) > -1) {
        // trigger the sift processe to match detection with full clips
        sift(fileName);
      }
    }
  });

  recording.on("exit", (data) => {
    if (data === 0) {
      console.log(`FFMPEG clean exit`);
    } else {
      throw new Error("FFMPEG is not working with current parameters");
    }
  });
}
