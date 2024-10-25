const express = require("express");
const { MulterConfig } = require("../config/index");
const { VideoController } = require("../controller/index");

const router = express.Router();

router.post("/upload", MulterConfig.single("video"), VideoController.upload);

router.get("/", VideoController.getAllVideos);

router.get("/:id", VideoController.getVideo);

module.exports = router;
