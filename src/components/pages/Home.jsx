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
import { poseSimilarity } from 'posenet-similarity'
import { Similarity } from '../atoms/Similarity'


export const Home = memo(() => {
    const [user] = useAuthState(auth);
    const [value] = useCollection(collection(db, `users/${user?.uid}/videos`));
    const [videos, setVideos] = useState(null);
    const [video01, setVideo01] = useState(null);
    const [video02, setVideo02] = useState(null);
    const [pose01, setPose01] = useState(null);
    const [pose02, setPose02] = useState(null);
    const [similarity, setSimilarity] = useState(null);

    // console.log(video01,video02);
    // console.log(pose01);
    // console.log(pose02);
    useEffect(() => {
        if (pose01 !== null && pose02 !== null) {
        
        // Use weightedDistance
        const weightedDistance = poseSimilarity(pose01, pose02, { strategy: 'weightedDistance' });

        // Use cosineDistance
        const cosineDistance = poseSimilarity(pose01, pose02, { strategy: 'cosineDistance' });

        // Use cosineSimilarity
        const cosineSimilarity = poseSimilarity(pose01, pose02, { strategy: 'cosineSimilarity' });

        console.log(cosineSimilarity);
        console.log(cosineDistance);
        console.log(weightedDistance);
        setSimilarity(cosineDistance);
    }     
    },[pose01,pose02])

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
                       setVideo02={setVideo02}
                   />
            </Stack>
            <Stack spacing={2} direction="row" >    
                   <VideoSet  
                    videoURL={video01}
                    setPose={setPose01}
                    /> 
                   <VideoSet
                    videoURL={video02}
                    setPose={setPose02}
                   />
            </Stack> 
            <Stack direction='column'> 
            <Similarity similarity={similarity} />     
            </Stack>
        </Stack>
    </>
  )
})
