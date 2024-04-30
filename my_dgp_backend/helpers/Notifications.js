const https = require("https");
const nodemailer = require("nodemailer");

const sendRiderPushNotifications = async (fcm_tokens, message) => {
  try {
    const SERVER_KEY = process.env.FCM_SERVER_KEY;

    for (index in fcm_tokens) {
      const body = JSON.stringify({
        to: x[index],
        notification: {
          title: "You have a new test booking request.",
          body: message,
          sound: "gio_resotone.mp3",
          android_channel_id: "callNotificationChannel",
        },
        content_available: true,
        priority: "high",
      });
  
      const options = {
        hostname: "fcm.googleapis.com",
        path: "/fcm/send",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `key=${SERVER_KEY}`,
        },
      };
  
      const api = https.request(options, (response) => {
        response.on('end', () => {
          console.log("Push Notification Sent", response);
        });
      });
  
      api.on('error', (error) => {
        console.error("Error while sending push notification to rider", error)
      });
  
      api.write(body);
      api.end()
    }

  } catch (error) {
    console.error("Could not send push notification to rider", error);
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
  try {
    const mail_options = {
      from: {
        name: "My DGP",
        address: process.env.NODEMAILER_EMAIL,
      },
      to: email_ids.join(","),
      subject,
      text: message,
      html: html,
    };
    let mail_sent = await transporter.sendMail(mail_options);
    console.log("Email sent.", mail_sent.envelope);
  } catch (error) {
    console.log("Cannot send email.", error, "Params - ", email_ids, subject);
  }
};

module.exports = { sendRiderPushNotifications, sendEmail };
