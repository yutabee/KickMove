import { CircularProgress } from '@mui/material';
import { Stack } from '@mui/system';
import React, { memo } from 'react'
import styled from 'styled-components';
// import { VideoCard } from '../molecules/VideoCard';

export const VideoList = memo(({ videos, setVideo01, setVideo02 }) => {
  return (
      <div>
          {videos ?(
              videos.map((video) => (
                <Stack key={video.uid}>
                    <SVideoCard>
                    <SContainer>
                        <p>{video.timeCreated.split('T')[0]}</p>
                        <p>{video.techniche}</p>
                        <button onClick={() => setVideo01(video.downloadURL)}>left</button>
                        <button onClick={() => setVideo02(video.downloadURL)}>right</button>
                    </SContainer>
                    </SVideoCard>
                </Stack>
              ))
          ) : (
                <SLoadingBox>
                    <CircularProgress/>
                    <p>Now loading...</p>
                </SLoadingBox>
            )}      
    </div>
  )
})

const SLoadingBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`

const SVideoCard = styled.div`
    background-color: white;
    margin: 5px;
    box-shadow: 5px 10px 10px -4px rgba(0, 0, 0, 0.73);
    border-radius: 8px;
    width: 200px;
`

const SContainer = styled.div`
 padding-left: 20px;
`
