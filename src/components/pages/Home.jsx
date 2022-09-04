import { Stack } from '@mui/system'
import { collection } from 'firebase/firestore'
import React, { memo, useEffect, useState } from 'react'
import { auth, db } from '../../firebase'
import { Header } from '../organisms/Header'
import { VideoList } from '../organisms/VideoList'
import { VideoSet } from '../organisms/VideoSet'
import { VideoUpload } from '../organisms/VideoUpload'
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from 'react-firebase-hooks/firestore';


export const Home = memo(() => {
    const [user] = useAuthState(auth);
    const [value] = useCollection(collection(db, `users/${user?.uid}/videos`));
    const [videos, setVideos] = useState(null);
    const [video01, setVideo01] = useState(null);
    const [video02, setVideo02] = useState(null);

    console.log(video01,video02);

    useEffect(() => {
        const data = value?.docs.map((doc => doc.data()));
        setVideos(data);
    }, [value]);
 
   return (
       <>
        <Header />
        <Stack direction="row" spacing={2}>
            <Stack spacing={2}>   
                <VideoUpload />
                   <VideoList
                       videos={videos}
                       setVideo01={setVideo01}
                       setVideo02={setVideo02} />
            </Stack>
            <Stack spacing={2} direction="row" >
                <VideoSet videoURL={video01} />
                <VideoSet videoURL={video02} />
            </Stack> 
        </Stack>
    </>
  )
})
