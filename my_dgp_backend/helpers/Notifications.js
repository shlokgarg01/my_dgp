const FCM = require("fcm-node");

const sendRiderPushNotifications = async (fcm_tokens, message) => {
  try {
    const SERVER_KEY = process.env.FCM_SERVER_KEY;
    var fcm = new FCM(SERVER_KEY);

    var push_notification = {
      registration_ids: fcm_tokens,
      content_available: true,
      mutable_content: true,
      notification: {
        title: "You have a new booking request.",
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
