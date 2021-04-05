import { existsSync, mkdirSync } from "fs";

import { SAVE_DIR, TEMP_DIR } from "./constants.js";
import record from "./record.js";

[SAVE_DIR, TEMP_DIR].forEach((dir) => {
  if (!existsSync(dir)) {
    mkdirSync(dir);
  }
});

record();
