const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TranscodeSchema = new Schema(
  {
    title: { type: String, required: true },
    videoId: { type: String, required: true },
    videoUrls: {
      master: { type: String },
      "360p": { type: String },
      "480p": { type: String },
      "720p": { type: String },
      "1080p": { type: String },
      poster: { type: String },
    },
    status: {
      type: String,
      enums: ["pending", "completed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("transcode", TranscodeSchema);
