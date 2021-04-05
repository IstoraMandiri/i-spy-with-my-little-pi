import { createClient } from "webdav";
import { REMOTE_FOLDER } from "./constants.js";
import { readFile } from "./utils.js";

const { WEBDAV_URL, WEBDAV_USERNAME, WEBDAV_PASSWORD } = process.env;

let client;

if (!WEBDAV_URL || !WEBDAV_USERNAME || !WEBDAV_PASSWORD) {
  console("!!! WebDAV credentials not in in environment, will not upload");
} else {
  console.log("WebDAV uploading to", WEBDAV_URL);
  client = createClient(WEBDAV_URL, {
    username: WEBDAV_USERNAME,
    password: WEBDAV_PASSWORD,
  });
}

let isSetup = false;

async function setup() {
  if (!isSetup) {
    // create remote dir
    try {
      await client.createDirectory(REMOTE_FOLDER, { recusrive: true });
    } catch (e) {
      if (e.status === 405) {
        console.log("Directory already created");
      } else {
        throw e;
      }
    }
    isSetup = true;
  }
}

export default async function upload(fileName) {
  if (!client) {
    return;
  }
  console.log("☁ uploading...", fileName);
  await setup();
  // TODO use streams after https://github.com/perry-mitchell/webdav-client/issues/181
  const data = await readFile(fileName);
  const targetFile = `${REMOTE_FOLDER}/${fileName.split("/").pop()}`;
  await client.putFileContents(targetFile, data, { overwrite: true });
  console.log("✅ uploaded!", targetFile);
}
