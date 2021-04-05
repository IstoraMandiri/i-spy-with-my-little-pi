import { resolve } from "path";

export const TEMP_DIR = resolve("temp");
export const SAVE_DIR = resolve("recordings");

export const DEVICE = "/dev/video0";
export const FPS = 25;
export const WIDTH = 640;
export const HEIGHT = 480;
export const FULL_TIME = 30;
export const DETECT_TIME = 5;
export const BITRATE = "800K";
export const DIFFERENCE = 15;
export const PERCENT = 10;
export const FULL_KEY = "full";
export const SMALL_KEY = "small";
export const DETECTED_KEY = "detected";
export const DATE_FORMAT = "%Y-%m-%d_%H-%M-%S";
export const VIDEO_FORMAT = "mp4";
export const SEGMENT_PREFIX = "pispy";
export const REMOTE_FOLDER = "/capture";
