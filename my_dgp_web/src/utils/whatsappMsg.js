import axios from "axios";


// common function to send whatsapp message
const sendWhatsAppMessage = async (requestBody) => {
  const TOKEN = 'EAAaO7W1PA5ABO1sjb0y9IkZBk1nfxhNH2H2sxkF8ps9AHHAWOj96MODmLPYjbFrov0ht8fsJZAjSdNgZC765dwZCKZAgWvNZBICeNVFviO7GEE1ZAvJWDaKajQeGDBjoWFUc5iAdrNQhEeWhQTyO19sefTShOfPitB4rACuzKnmpLVHZBM64uJ7Cv4YFHPI3uzU06wZDZD';
  const URL = 'https://graph.facebook.com/v19.0/365577786631719/messages';
  try {
    const response = await axios.post(URL, requestBody, {
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    throw error;
  }
};

export const sendAdvanceMsg = async ({
  advanceAmount,
  riderName,
  bookingId,
  date,
  duration,
  serviceName,
  amount,
  contactNumber
}) => {
  const requestBody = {
    messaging_product: "whatsapp",
    to: contactNumber,
    type: "template",
    template: {
      name: "new_booking_details_with_no_cash_",
      language: {
        code: "en"
      },
      components: [
        {
          type: "body",
          parameters: [
            {
              type: "text",
              text: `Rs. ${advanceAmount}`
            },
            {
              type: "text",
              text: riderName
            },
            {
              type: "text",
              text: bookingId
            },
            {
              type: "text",
              text: date
            },
            {
              type: "text",
              text: duration
            },
            {
              type: "text",
              text: serviceName
            },
            {
              type: "text",
              text: ' '
            },
            {
              type: "text",
              text: `Rs ${amount}`
            },

          ]
        },
        {
          type: "button",
          sub_type: "url",
          index: "0",
          parameters: [
            {
              type: "text",
              text: bookingId
            }
          ]
        }
      ]
    }
  };
  return sendWhatsAppMessage(requestBody);
};

export const sendBalanceMsg = async ({pendingAmount, bookingId, contactNumber}) => {
  const requestBody = {
    messaging_product: "whatsapp",
    to: contactNumber,
    type: "template",
    template: {
      name: "final_balance_due_complete",
      language: {
        code: "en"
      },
      components: [
        {
          type: "body",
          parameters: [
            {
              type: "text",
              text: pendingAmount
            }
          ]
        },
        {
          type: "button",
          sub_type: "url",
          index: "0",
          parameters: [
            {
              type: "text",
              text: bookingId
            }
          ]
        }
      ]
    }
  };
  return sendWhatsAppMessage(requestBody);
};

export const sendAdvanceStartOtpMsg = async ({contactNumber, otp}) => {
  const requestBody = {
    messaging_product: "whatsapp",
    to: contactNumber,
    type: "template",
    template: {
      name: "final_booking_start_otp_send",
      language: {
        code: "en"
      },
      components: [
        {
          type: "body",
          parameters: [
            {
              type: "text",
              text: otp
            }
          ]
        }
      ]
    }
  };
  return sendWhatsAppMessage(requestBody);
};