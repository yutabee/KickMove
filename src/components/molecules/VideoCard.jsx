import React from 'react'
import { memo } from 'react'

export const VideoCard = memo(({videoSrc}) => {
  return (
    <div>
    <div className="App">
      <video
        controls
        muted
        width='300px'
        height='300px'
    >
        <source src={videoSrc}></source>
      </video>
    </div>     
    </div>
  )
})
