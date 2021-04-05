import { SAVE_DIR, TEMP_DIR } from "./constants.js";
import upload from "./upload.js";
import { move } from "./utils.js";

export default async function save(files) {
  await Promise.all(
    files.map(async ({ fileName }) => {
      const saved = `${SAVE_DIR}/${fileName}`;
      // blocking
      try {
        await move(`${TEMP_DIR}/${fileName}`, `${SAVE_DIR}/${fileName}`);
        console.log("🔶 saved", saved);
        // not blocking
        upload(saved);
      } catch (e) {
        // in this case probably just a race condition
        console.log("⚠ problem saving", saved, e);
      }
    })
  );
  // TODO post process shiz such as uploading to webdav...
}
