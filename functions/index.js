const functions = require('firebase-functions');
const path = require('path');
const os = require('os');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const ffmpeg_static = require('ffmpeg-static');
const UUID = require('uuid-v4');
const serviceAccount = requre('./config/service_account.json');  //key

const { Storage } = require('@google-cloud/storage');
const gcs = new Storage({ keyFilename: './config/service_account.json' });

//admin initialize
const admin = require("firebase-admin");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://kickmove-3dd9a-default-rtdb.firebaseio.com",
});
admin.firestore().settings({ timesStampsInSnapshots: true });

//firestoreのtimeスタンプがmicroSec、javascriptのDateはmsecであるためバグを防止する
function promisifyCommand(command) {
  return new Promise((resolve, reject) => {
    command.on('end', resolve).on('error', reject).run();
  });
}

 async function saveVideoMetadata(userToken, metadata) {
   const decodedToken = await admin.auth().verifyIdToken(userToken);
   const userUid = decodedToken.uid;
   const videoRef = admin.firestore()
                      .doc(`users/${userUid}`)
                      .collection('videos')
                      .doc();
   metadata = Object.assign(metadata, { uid: videoRef.id });
 
   await videoRef.set(metadata, { merge: true });
 }

exports.transcodeVideo = functions.storage.object().onFinalize(
  async (object) => {
    try {
      const contentType = object.contentType;
      if (!contentType.includes('video') || contentType.endsWith('mp4')) {
        console.log('quit execution!!!');
        return;
      }
      const bucketName = object.bucket;
      const bucket = gcs.bucket(bucketName);
      const filePath = object.name;
      const fileName = filePath.split('/').pop();
      const tempFilePath = path.join(os.tmpdir(), fileName);
      const videoFile = bucket.file(filePath);

      const targetTempFileName = `${fileName.replace(/\.[^/.]+ $/, '')}_output.mp4`;
      const targetTempFilePath = path.join(os.tmpdir(), targetTempFileName);
      const targetTranscodedFilePath =
        path.join(path.dirname(targetTranscodedFilePath), targetTempFileName);
      
      await videoFile.download({ destination: tempFilePath });

      const command = ffmpeg(tempFilePath)
        .setFfmpegPath(ffmpeg_static.path)
        .format('mp4')
        .output(targetTempFilePath);
      
      await promisifyCommand(command);
      const token = UUID();
      await bucket.upload(targetTempFilePath, {
        destination: targetStorageFilePath,
        metadata: {
          contentType: 'video/mp4',
          metadata: {
            firebaseStorageDownloadTokens: token
          }
        }
      });

      let transcodedVideoFile = await bucket.file(targetStorageFilePath);
      let metadata = await transcodedVideoFile.getMetadata();
      const downloadURL = `https://firebasestorage.googleapis.com/v0/b${bucketName}/o/${encodeURIComponent(targetTranscodedFilePath)}?alt=media&token=${token}`;
      metadata = Object.assign(metadata[0], { downloadURL: downloadURL });
      const userToken = object.metadata.idToken;
      await saveVideoMetadata(userToken, metadata);

      fs.unlinkSync(tempFilePath);
      fs.unlinkSync(targetTempFilePath);

      console.log('Transcode execution was finished!!!');

    } catch (error) {
      console.log(error);
      return;
    }
  });


const defaultUserIcon = 'http://randomuser.me/api/portraits/med/men/1.jpg';

exports.saveUser = functions.auth.user().onCreate(
  async (user) => {
    try {
      const result = await admin.firestore()
        .doc(`users/${user.uid}`)
        .create({
          uid: user.uid,
          displayName: user.displayName || 'no name',
          email: user.email,
          emailVerified: user.emailVerified,
          photoURL: user.photoURL || defaultUserIcon,
          phoneNumber: user.phoneNumber,
          providerData: {
            providerId: user.providerData.length
              === 0 ? user.email : user.providerData[0].uid
          },
          disabled: user.disabled
        });
      
      console.log(`Save User Info!  Document written at : ${result.writeTime().toData()}`);
      
    } catch (error) {
      console.log(error);
    }
  });

