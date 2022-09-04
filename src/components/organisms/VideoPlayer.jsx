import React, { memo } from 'react'

export const VideoPlayer = memo(({ videoRef, videoSrc }) => {
  return (
      <div className="App">
      <video
        ref={videoRef}
            controls
            muted
            width={300}
            height={300}
            crossOrigin="anonymous"   //<<<なんかこいつないとエラー出る...セキュリティの問題っぽい
            src={videoSrc}     
          >
            {/* <source src={videoSrc}></source> */}
      </video>
    </div>
  )
})

 