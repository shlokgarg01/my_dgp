const { google } = require("googleapis");
const api_keys = require('../google_api_key.js')
const stream = require("stream");

const SCOPE = ["https://www.googleapis.com/auth/drive"];

const authorize = async () => {
  try {
    const jwtClient = new google.auth.JWT(
      api_keys.client_email,
      null,
      api_keys.private_key,
      SCOPE
    );
    await jwtClient.authorize();
    return jwtClient;
  } catch (error) {
    console.error('Error during authorization:', error);
    throw new Error('Failed to authorize with Google API');
  }
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

exports.createPublicFolder = async (folderName) => {
  const auth = await authorize();
  
  let folderId;
  try {
    // Create the folder
    const { data } = await google
      .drive({
        version: "v3",
        auth,
      })
      .files.create({
        resource: {
          name: folderName,
          mimeType: 'application/vnd.google-apps.folder',
          parents: ['1W34XkIMjFlNU9A0cX2yCIL5qJTQBQqQC'] //creating folders inside mydgp1@gmail.com drive
        },
        fields: 'id',
      });
    
    folderId = data.id;
  } catch (error) {
    console.error('Error creating folder:', error);
    throw new Error('Failed to create folder');
  }

  try {
    // Set the folder's permissions to be public
    await google.drive({ version: 'v3', auth }).permissions.create({
      fileId: folderId,
      resource: {
        role: 'writer',
        type: 'anyone',
      },
    });
  } catch (error) {
    console.error('Error setting folder permissions:', error);
    throw new Error('Failed to set folder permissions');
  }
  return {
    folderId: folderId,
    fileUrl: `https://drive.google.com/drive/folders/${folderId}`,
  };
};