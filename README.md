# I Spy With My Little Pi

_$10 portable intrusion detection system_

Raspberry Pi Zero compatible USB webcam motion detection and WebDAV upload service

## Installation

- Get a Raspberry Pi Zero
- Flash raspian OS Lite + set WiFi credentials
- Plug in a cheap USB webcam
- SSH in to the Pi
- `apt install ffmpeg git`
- Clone and `cd` into this repo
- `./install-node-14.x.sh` (from https://github.com/sdesalas/node-pi-zero)
- `npm i`
- Edit `./credentials.sh` and `source ./credentials.sh`
- `npm start` to try it out
- `./service_manager.sh install` to run on boot

## How does it work?

Due to hardware limitations it required an unusual approach to get this to work on a Pi Zero.

- Spawn an `ffmpeg` process that consumes `/dev/video0` as a stream
- Every 30 seconds writes a high quality 25 fps 'viewing' segment to disk
- Every few seconds writes low quality 1 fps 'detection' segment to disk
- (The above uses hardware accelleration and uses about 30% of CPU)
- Spawn another `ffmpeg` process to re-encode the low quality 'detection' file to PAM and pipe it to `pam-diff` for movement detection
- (The above cannot use hardware accelleration and uses the remaining CPU, but just about keeps up due to the low resolution/framerate)
- If movement is detected, we save/upload the relevant quality videos
- Clean up old videos
