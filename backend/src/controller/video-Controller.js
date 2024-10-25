const { v4: uuid } = require("uuid");
const fs = require("fs");
const { exec } = require("child_process");
const { ServerConfig, RabbitMqConfig } = require("../config/index");
const { TranscodeModel } = require("../models/index");

async function upload(req, res, next) {
  if (!req.file) {
    return res.status(400).send("Video not sent!");
  }

  const videoId = uuid();
  const uploadedVideoPath = req.file.path;

  try {
    const createdVideo = new TranscodeModel({
      title: req.file.originalname,
      videoId,
    });
    const video = await createdVideo.save();
    const toTranscodeData = {
      data: {
        videoId: videoId,
        uploadedVideoPath: uploadedVideoPath,
      },
      action: "TRANSCODE",
    };

    RabbitMqConfig.sendData(toTranscodeData);

    return res.status(200).json({ video });
  } catch (error) {
    console.log(error);
    try {
      fs.unlinkSync(uploadedVideoPath);
    } catch (err) {
      console.error(`Failed to delete original video file: ${err}`);
    }
    return res.status(500).send(error);
  }
}

async function getAllVideos(req, res) {
  try {
    const allVideos = await TranscodeModel.find().lean();
    return res.status(200).json(allVideos);
  } catch (error) {
    return res.status(500).send(error);
  }
}

async function getVideo(req, res) {
  try {
    const { id } = req.params;
    const video = await TranscodeModel.findById(id).lean();
    return res.status(200).json(video);
  } catch (error) {
    return res.status(500).send(error);
  }
}

module.exports = {
  upload,
  getAllVideos,
  getVideo,
};
