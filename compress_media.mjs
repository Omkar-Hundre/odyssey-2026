import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const ASSETS_DIR = path.resolve("./src/assets");
const VIDEO_IN = path.join(ASSETS_DIR, "home_bg2.mp4");
const VIDEO_OUT = path.join(ASSETS_DIR, "home_bg2_compressed.mp4");
const AUDIO_IN = path.join(ASSETS_DIR, "intro.mp3");
const AUDIO_OUT = path.join(ASSETS_DIR, "intro_compressed.mp3");

console.log("Starting media compression...\n");

try {
  // Compress video: scale down to 720p maximum, lower bitrate, fast preset
  // -vf "scale=-2:720" keeps aspect ratio, limits height to 720
  // -crf 28 provides good compression with acceptable quality
  if (fs.existsSync(VIDEO_IN)) {
    console.log(`Compressing video: ${VIDEO_IN}`);
    execSync(`ffmpeg -i "${VIDEO_IN}" -vcodec libx264 -crf 28 -preset fast -vf "scale=-2:720" -y "${VIDEO_OUT}"`, { stdio: "inherit" });
    console.log(`Video compressed successfully: ${VIDEO_OUT}\n`);
  } else {
    console.warn(`Video file not found: ${VIDEO_IN}\n`);
  }

  // Compress audio: lower bitrate
  // -b:a 64k lowers audio bitrate significantly to save space for an intro 
  if (fs.existsSync(AUDIO_IN)) {
    console.log(`Compressing audio: ${AUDIO_IN}`);
    execSync(`ffmpeg -i "${AUDIO_IN}" -map 0:a:0 -b:a 64k -y "${AUDIO_OUT}"`, { stdio: "inherit" });
    console.log(`Audio compressed successfully: ${AUDIO_OUT}\n`);
  } else {
    console.warn(`Audio file not found: ${AUDIO_IN}\n`);
  }
  
  console.log("Media compression completed.");
} catch (error) {
  console.error("An error occurred during compression:", error.message);
  process.exit(1);
}
