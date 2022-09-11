import React, { memo, useEffect, useRef} from 'react';

import * as poseDetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-backend-webgl';

import { VideoPlayer } from './VideoPlayer';
import { drawKeypoints, drawSkeleton } from '../../utilities';


export const VideoSet = memo(({videoURL ,setPose}) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  //detectの作成
  const detect = async ( detector ) => {
    if (typeof videoRef.current !== 'undefined' && videoRef.current !== null ) {
      const video = videoRef.current;
      console.log(video);
      // console.log(canvasRef);
      let poses = await detector.estimatePoses(video);
    
    //Posenetのオブジェクト形式に変換
      const keypoinsArr = poses[0].keypoints.map((keypoint) => (
        {
          "position": {
            "y": keypoint.y,
            "x": keypoint.x,
          },
          "part": keypoint.name,
          "score": keypoint.score,
        }
      ));
      const setObj = {
        "score":poses[0].score,
        "keypoints":keypoinsArr,
      }
      // console.log(poses[0]);

    
      // setPose(poses[0]);
      setPose(setObj);

      const videoWidth = video.width;
      const videoHeight = video.height;
      // console.log(video);

      drawCanvas(poses[0], video, videoWidth, videoHeight, canvasRef);    
    }
  }

  //movenet読み込み
  const runMovenet = async () => {
    const model =  poseDetection.SupportedModels.MoveNet;
    const detector = await poseDetection.createDetector(model);
    setInterval(() => {
      detect(detector);
    }, 3000)
  };

  const drawCanvas = (poses, video, videoWidth, videoHeight, canvas) => {
    const ctx = canvas.current.getContext("2d");

    canvas.current.width = videoWidth;
    canvas.current.height = videoHeight;

    // console.log(video);
    // console.log(poses.keypoints);
  
    drawKeypoints(poses.keypoints, 0.5, ctx);
    drawSkeleton(poses.keypoints, 0.5, ctx);
  }

  useEffect(() => {
    if (videoURL) {
      runMovenet();
    } else {
      return;
    }
  // eslint-disable-next-line
  }, [videoURL]);
  
  return (
  <>
      {
        videoURL ? (
          <div>
              <VideoPlayer
                videoRef={ videoRef }
                videoSrc={ videoURL }
              />
              <canvas
              ref={canvasRef}
              >キャンバス</canvas>  
          </div>
        ) : (
        <div>
          <img
            src="noimage.png"
            alt="noimage"
            width='300px'
            heigt='300px'
              />
        </div>
      )
    }
  </>  
  );
})

