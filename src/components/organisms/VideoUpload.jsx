import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React, { memo, useState } from 'react'
import { auth, db, storage } from '../../firebase';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import { CircularProgress } from '@mui/material';
import styled from 'styled-components';
import { collection, doc, setDoc } from 'firebase/firestore';
import { Stack } from '@mui/system';

export const VideoUpload = memo(() => {
    const [video, setVideo] = useState(null);
    const [upLoading, setUpLoading] = useState(false);
    const [techniche, setTechniche] = useState('');


    const handleOnchange = (e) => {
        e.preventDefault();
        // console.log(e.target.files[0]);
        setVideo(e.target.files[0]);
    }

    const handleTech = (e) => {
        e.preventDefault();
        setTechniche(e.target.value);
    }

    const fileUpload = async (e) => {
        e.preventDefault();
        //バリデーション
        const sizeLimit = 1024 * 1024 * 3; //制限サイズ3MG 
        if (video === null) {
            alert('ファイルが選択されていません。');
            return;
        } else if (video.size > sizeLimit) {
            alert('ファイルサイズを3MB以下に設定してください。');
            return;
        }

        //アップロードState
        setUpLoading(true);
        // console.log(video);

        const videoUid = uuidv4();

        //Create Firestorage Ref
        const userUid = auth.currentUser.uid;
        const filePath = `videos/${userUid}/${videoUid}`;
        const videoStorageRef = ref( storage , filePath );

        //custom metaData
        const idToken = await auth.currentUser.getIdToken(true);
        const metaDataForStorage = {
            customMetaData: {
                idToken: idToken,
            }
        };
        // console.log(metaDataForStorage);

        //upload function
        const fileSnapshot = await uploadBytes(videoStorageRef, video, metaDataForStorage)
            .then((snapshot) => {
                console.log("upload success");
                console.log(snapshot.metadata);
                setUpLoading(false);
                setVideo(null);
                return snapshot;
            })
            .catch((error) => {
                console.log(error);
            });
        
        //mp4以外のデータはCloud Functionsでトランスコードした後保存
        //メタデータをFireStoreに保存
        if (video.type === 'video/mp4') {
            const downloadURL = await getDownloadURL(videoStorageRef);
            console.log(downloadURL);
            console.log(fileSnapshot);
            let metadataForFirestore = _.omitBy(fileSnapshot.metadata, _.isEmpty);  //metadataが空の物を取り除く
            metadataForFirestore = Object.assign(metadataForFirestore, { downloadURL: downloadURL });
            seveVideoMetadata(metadataForFirestore ,videoUid);
        }
        
    }

    //videoのメタデータをfirestoreに保存
    const seveVideoMetadata = (metadata, videoUid) => {
        const userUid = auth.currentUser.uid;
        // const videoRef = doc(`users/${userUid}`).collection('videos').doc();
        const videoRef = collection(db, `users/${userUid}/videos`);
        metadata = Object.assign(metadata, { uid: videoUid , techniche:techniche});
        setDoc(doc(videoRef), metadata);
    }

  return (
      <div>
          {upLoading ? (
            <SUploadingBox>
                <CircularProgress />
                <p>Now Uploading...</p>
            </SUploadingBox>
          ) : (  
            <form onSubmit={e => fileUpload(e)}>
            <SBox>
            <Stack spacing={2} m={2}>              
            <h2>Video Upload</h2>
              <input
                  type="file"
                  accept='video/*'
                  onChange={e =>handleOnchange(e)}
              />
            <input
                type='text'
                placeholder='技(ジャブ、ストレート...etc)'
                onChange={e=>handleTech(e)}
            />                
            <button type='submit'>Upload</button>
            </Stack>
            </SBox>
          </form>
        )}  
    </div>
  )
})

const SUploadingBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`

const SBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: center;
`