const fs = require("fs");
const { exec } = require("child_process");
const { TranscodeModel } = require("../models/index");
const serverConfig = require("../config/serverConfig");

async function subscribeEvent(payload) {
  payload = JSON.parse(payload);
  console.log(payload);
  const { data, action } = payload;

  switch (action) {
    case "TRANSCODE":
      await transcode(data);
      break;
    default:
      break;
  }
}

async function transcode(data) {
  const { videoId, uploadedVideoPath } = data;

  const outputFolderRootPath = `./hls-output/${videoId}`;
  const outputFolderSubDirectoryPath = {
    "360p": `${outputFolderRootPath}/360p`,
    "480p": `${outputFolderRootPath}/480p`,
    "720p": `${outputFolderRootPath}/720p`,
    "1080p": `${outputFolderRootPath}/1080p`,
  };

  if (!fs.existsSync(outputFolderRootPath)) {
    fs.mkdirSync(outputFolderSubDirectoryPath["360p"], { recursive: true });
    fs.mkdirSync(outputFolderSubDirectoryPath["480p"], { recursive: true });
    fs.mkdirSync(outputFolderSubDirectoryPath["720p"], { recursive: true });
    fs.mkdirSync(outputFolderSubDirectoryPath["1080p"], { recursive: true });
  }

  const ffmpegCommands = [
    `ffmpeg -i ${uploadedVideoPath} -vf "scale=w=640:h=360" -c:v libx264 -b:v 800k -c:a aac -b:a 96k -f hls -hls_time 15 -hls_playlist_type vod -hls_segment_filename "${outputFolderSubDirectoryPath["360p"]}/segment%03d.ts" -start_number 0 "${outputFolderSubDirectoryPath["360p"]}/index.m3u8"`,
    `ffmpeg -i ${uploadedVideoPath} -vf "scale=w=854:h=480" -c:v libx264 -b:v 1400k -c:a aac -b:a 128k -f hls -hls_time 15 -hls_playlist_type vod -hls_segment_filename "${outputFolderSubDirectoryPath["480p"]}/segment%03d.ts" -start_number 0 "${outputFolderSubDirectoryPath["480p"]}/index.m3u8"`,
    `ffmpeg -i ${uploadedVideoPath} -vf "scale=w=1280:h=720" -c:v libx264 -b:v 2800k -c:a aac -b:a 128k -f hls -hls_time 15 -hls_playlist_type vod -hls_segment_filename "${outputFolderSubDirectoryPath["720p"]}/segment%03d.ts" -start_number 0 "${outputFolderSubDirectoryPath["720p"]}/index.m3u8"`,
    `ffmpeg -i ${uploadedVideoPath} -vf "scale=w=1920:h=1080" -c:v libx264 -b:v 5000k -c:a aac -b:a 192k -f hls -hls_time 15 -hls_playlist_type vod -hls_segment_filename "${outputFolderSubDirectoryPath["1080p"]}/segment%03d.ts" -start_number 0 "${outputFolderSubDirectoryPath["1080p"]}/index.m3u8"`,
    `ffmpeg -i ${uploadedVideoPath} -ss 1.4 -frames:v 1 ${outputFolderRootPath}/video-poster.png`,
  ];

  const executeCommand = (command) => {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          reject(error);
        } else {
          resolve();
        }
      });
    });
  };

  Promise.all(ffmpegCommands.map((cmd) => executeCommand(cmd)))
    .then(async () => {
      const masterPlaylistPath = `${outputFolderRootPath}/index.m3u8`;
      const masterPlaylistContent = `
                      #EXTM3U
                      #EXT-X-STREAM-INF:BANDWIDTH=800000,RESOLUTION=640x360
                      360p/index.m3u8
                      #EXT-X-STREAM-INF:BANDWIDTH=1400000,RESOLUTION=854x480
                      480p/index.m3u8
                      #EXT-X-STREAM-INF:BANDWIDTH=2800000,RESOLUTION=1280x720
                      720p/index.m3u8
                      #EXT-X-STREAM-INF:BANDWIDTH=5000000,RESOLUTION=1920x1080
                      1080p/index.m3u8
                  `.trim();
      fs.writeFileSync(masterPlaylistPath, masterPlaylistContent);

      const videoUrls = {
        master: `http://localhost:${serverConfig.PORT}/hls-output/${videoId}/index.m3u8`,
        "360p": `http://localhost:${serverConfig.PORT}/hls-output/${videoId}/360p/index.m3u8`,
        "480p": `http://localhost:${serverConfig.PORT}/hls-output/${videoId}/480p/index.m3u8`,
        "720p": `http://localhost:${serverConfig.PORT}/hls-output/${videoId}/720p/index.m3u8`,
        "1080p": `http://localhost:${serverConfig.PORT}/hls-output/${videoId}/1080p/index.m3u8`,
        poster: `http://localhost:${serverConfig.PORT}/hls-output/${videoId}/video-poster.png`,
      };

      try {
        const updatedVideo = await TranscodeModel.updateOne(
          { videoId: videoId },
          { $set: { videoUrls: videoUrls, status: "completed" } }
        );
        console.log("Video updated:", updatedVideo);
      } catch (error) {
        throw new Error(error);
      }
    })
    .catch((error) => {
      console.error(`HLS conversion error: ${error}`);

      try {
        fs.unlinkSync(uploadedVideoPath);
      } catch (err) {
        console.error(`Failed to delete original video file: ${err}`);
      }

      try {
        fs.unlinkSync(outputFolderRootPath);
      } catch (err) {
        console.error(`Failed to delete generated HLS files: ${err}`);
      }
    });
}

module.exports = {
  subscribeEvent,
};
