"use client";

import { useEffect, useState } from "react";
import Navbar from "./components/navbar";
import VideoPlayer from "./components/video-player";
import axios from "./axios/axios";
import VideoList from "./components/video-list";

export default function Home() {
  const [videos, setvideos] = useState();
  const [selectedVideo, setselectedVideo] = useState();

  const handleVideo = (video) => {
    setselectedVideo(video);
  };

  const getAllVideos = async () => {
    await axios
      .get("/")
      .then((response) => {
        setvideos(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getAllVideos();
  }, []);

  return (
    <div className="w-full h-screen bg-black">
      <Navbar />
      {selectedVideo && <VideoPlayer videoId={selectedVideo.videoId} />}
      {videos && <VideoList videos={videos} handleVideo={handleVideo} />}
    </div>
  );
}
