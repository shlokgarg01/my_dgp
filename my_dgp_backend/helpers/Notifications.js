const https = require("https");
const nodemailer = require("nodemailer");
const admin = require('firebase-admin');
const serviceAccount = require('../config/firebase-service.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const sendRiderPushNotifications = async (fcm_tokens, message) => {
  try {
    // Create message payload
    const messages = fcm_tokens.map(token => ({
      notification: {
        title: "You have a new booking request.",
        body: message
      },
      android: {
        notification: {
          sound: "gio_resotone.mp3",
          channelId: "callNotificationChannel"
        }
      },
      apns: {
        payload: {
          aps: {
            sound: "gio_resotone.mp3"
          }
        }
      },
      token: token
    }));

    // Send messages in batches of 500
    const chunks = [];
    for (let i = 0; i < messages.length; i += 500) {
      chunks.push(messages.slice(i, i + 500));
    }

    for (const chunk of chunks) {
      const responses = await Promise.all(
        chunk.map(message => 
          admin.messaging().send(message)
        )
      );
      
      console.log('Successfully sent messages:', responses.length);
    }

  } catch (error) {
    console.error("Could not send push notification to rider", error);
    throw error; // Re-throw to handle it in the calling function if needed
  }
};


const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true if port = 465
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_APP_PASSWORD,
  },
});

const sendEmail = async (email_ids, subject, message, html) => {
  // try {
  //   const mail_options = {
  //     from: {
  //       name: "My DGP",
  //       address: process.env.NODEMAILER_EMAIL,
  //     },
  //     to: email_ids.join(","),
  //     subject,
  //     text: message,
  //     html: html,
  //   };
  //   let mail_sent = await transporter.sendMail(mail_options);
  //   console.log("Email sent.", mail_sent.envelope);
  // } catch (error) {
  //   console.log("Cannot send email.", error, "Params - ", email_ids, subject);
  // }
};

module.exports = { sendRiderPushNotifications, sendEmail };
