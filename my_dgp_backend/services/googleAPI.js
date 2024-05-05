const { google } = require("googleapis");
const api_keys = require('../google_api_key.js')
const stream = require("stream");

const SCOPE = ["https://www.googleapis.com/auth/drive"];

const authorize = async () => {
  const jwtClient = new google.auth.JWT(
    api_keys.client_email,
    null,
    api_keys.private_key,
    SCOPE
  );
  
  await jwtClient.authorize();
  return jwtClient;
};

exports.uploadFile = async (fileObject, driveFolderName) => {
  const auth = await authorize();
  const bufferStream = new stream.PassThrough();
  bufferStream.end(fileObject.buffer);

  const { data } = await google
    .drive({
      version: "v3",
      auth,
    })
    .files.create({
      media: {
        mimeType: fileObject.mimeType,
        body: bufferStream,
      },
      requestBody: {
        name: fileObject.originalname,
        parents: [`${driveFolderName}`],
      },
      fields: "id, name",
    });

  return {
    fileId: data.id,
    fileName: data.name,
    fileUrl: `https://drive.google.com/file/d/${data.id}`,
  };
};

exports.deleteFile = async (file_id) => {
  const auth = await authorize();
  await google
    .drive({
      version: "v3",
      auth,
    })
    .files.delete({ fileId: file_id });

  return true;
};