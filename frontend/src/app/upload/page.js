"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { MdDelete, MdEdit } from "react-icons/md";

import axios from "../axios/axios";
import Navbar from "../components/navbar";

function Upload() {
  const [video, setvideo] = useState();
  const [error, seterror] = useState("");
  const [onSuccess, setonSuccess] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && file.type === "video/mp4") {
      seterror("");
      setvideo(file);
    } else {
      seterror("Please select a MP4 file");
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "video/mp4",
    maxFiles: 1,
  });

  const handlePost = async () => {
    if (onSuccess) return;
    const form = new FormData();

    if (video) {
      form.append("video", video);
      form.append("videoPath", video.name);

      await axios
        .post("/upload/", form, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(() => {
          console.log("video uploaded");
          setonSuccess(true);
        })
        .catch((error) => {
          console.log(error);
          seterror(error.response.data.message);
        });
    } else {
      seterror("No video selected");
    }
  };

  return (
    <>
      <Navbar />
      <div className="w-full h-screen flex justify-center items-center flex-col">
        <div className="p-4 mt-4 rounded-[5px] border-4 border-white w-3/4 lg:w-1/2 flex justify-between items-center">
          <div className="w-full flex justify-between items-center">
            <div
              {...getRootProps()}
              className="p-4 w-full h-20 hover:cursor-pointer border-dotted border-2 border-white flex justify-center items-center"
            >
              <input {...getInputProps()} />
              {!video ? (
                <p className="text-white ">
                  Drag 'n' drop some video here, or click to select video
                </p>
              ) : (
                <div className="w-full flex justify-between items-center">
                  <h3 className="text-wrap">{video.name}</h3>
                  <MdEdit className="hover:cursor-pointer hover:text-red-500 text-[20px]" />
                </div>
              )}
            </div>
            {video && (
              <div
                onClick={() => {
                  setvideo(null);
                  setonSuccess(false);
                }}
                className="hover:cursor-pointer hover:text-red-500 text-[20px] mx-4"
              >
                <MdDelete />
              </div>
            )}
          </div>
        </div>
        {error && <p className="text-red-500 mt-10">{error}</p>}
        <button
          onClick={handlePost}
          type="submit"
          className="mt-10 text-[18px] font-bold hover:cursor-pointer hover:text-red-500 w-1/6"
        >
          {onSuccess ? "VIDEO UPLOADED" : "UPLOAD"}
        </button>
      </div>
    </>
  );
}

export default Upload;
