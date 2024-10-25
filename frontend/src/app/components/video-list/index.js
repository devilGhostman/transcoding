import Link from "next/link";
import React from "react";

const VideoList = ({ videos, handleVideo }) => {
  console.log("videos", videos);
  const handleOnClick = (video) => {
    if (video.status === "completed") {
      handleVideo(video);
    }
  };
  return (
    <>
      <h2 className="mt-10 text-[18px] font-bold mx-[2%]">Transcoded Videos</h2>
      {videos.length > 0 ? (
        <div className="w-auto space-x-3 space-y-5 flex flex-wrap justify-start items-center">
          {videos.map((video, i) => (
            <div
              key={i}
              className="w-80 h-44 cursor-pointer"
              onClick={() => handleOnClick(video)}
            >
              {video.status === "pending" ? (
                <div className="w-full h-full bg-[#3d3d3d] flex justify-center items-center">
                  <p>In Queue</p>
                </div>
              ) : (
                <img src={video.videoUrls.poster} />
              )}
              <p className="w-full text-sm text-wrap my-10">{video.title}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full h-3/4 flex justify-center items-center">
          <p className="text-sm text-wrap my-10">No videos found</p>
        </div>
      )}
    </>
  );
};

export default VideoList;
