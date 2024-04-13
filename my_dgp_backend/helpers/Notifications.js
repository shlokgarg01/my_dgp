const FCM = require("fcm-node");
const nodemailer = require("nodemailer")

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

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true if port = 465
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_APP_PASSWORD
  }
})

const sendEmail = async (email_ids, subject, message, html) => {
  try {
    const mail_options= {
      from: {
        name:"My DGP",
        address: process.env.NODEMAILER_EMAIL
      },
      to: email_ids.join(","),
      subject,
      text: message,
      html: html
    }
    let mail_sent = await transporter.sendMail(mail_options)
    console.log("Email sent.", mail_sent.envelope)
  } catch (error) {
    console.log("Cannot send email.", error, "Params - ", email_ids, subject)
  }

};

module.exports = { sendRiderPushNotifications, sendEmail };
