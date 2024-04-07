const FCM = require("fcm-node");

const sendRiderPushNotifications = async (fcm_tokens, message) => {
  try {
    const SERVER_KEY = process.env.FCM_SERVER_KEY;
    var fcm = new FCM(SERVER_KEY);

    var push_notification = {
      registration_ids: ["fmY-a15CTcahuGg8xHbP7q:APA91bF3YwO0B-Pi4ti5pP30d-XtPpaWeAAH9s0SOcWkpDm5n8E8H0NgDDAwN8anCX0bM3ONBIGN_hanJQorexSAb-IJizwVV6G5Ws1T93IZR4gWXKeyAxjShc03_jiyTTB04E-e5P0H"],
      content_available: true,
      mutable_content: true,
      notification: {
        body: message,
      },
    };

    fcm.send(push_notification, (error, response) => {
      if (error) {
        console.error("Error while sending push notification to rider", error);
      } else {
        console.log("Push Notification Sent", response);
      }
    });
  } catch (error) {
    console.error("Could not send push notification to rider", error);
  }
};

const sendEmail = (email_ids, subject, message) => {};

module.exports = { sendRiderPushNotifications, sendEmail };
