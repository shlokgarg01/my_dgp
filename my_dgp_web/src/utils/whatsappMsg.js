import axios from "axios";

export const sendAdvanceMsg = async (customerName, amount, paymentLink,contactNumber) => {
    const url = 'https://graph.facebook.com/v19.0/365577786631719/messages';
    const token = 'EAAaO7W1PA5ABO1sjb0y9IkZBk1nfxhNH2H2sxkF8ps9AHHAWOj96MODmLPYjbFrov0ht8fsJZAjSdNgZC765dwZCKZAgWvNZBICeNVFviO7GEE1ZAvJWDaKajQeGDBjoWFUc5iAdrNQhEeWhQTyO19sefTShOfPitB4rACuzKnmpLVHZBM64uJ7Cv4YFHPI3uzU06wZDZD';
    const requestBody = {
      messaging_product: "whatsapp",
      to: contactNumber,
      type: "template",
      template: {
        name: "advance_msg_no_cash",
        language: {
          code: "en"
        },
        components: [
          {
            type: "body",
            parameters: [
              {
                type: "text",
                text: customerName
              },
              {
                type: "text",
                text: `Rs ${amount}`
              },
              {
                type: "text",
                text: paymentLink
              }
            ]
          }
        ]
      }
    };
  
    try {
      const response = await axios.post(url, requestBody, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      throw error;
    }
  };
  
  export const sendBalanceMsg = async (paymentLink,contactNumber) => {
    const url = 'https://graph.facebook.com/v19.0/365577786631719/messages';
    const token = 'EAAaO7W1PA5ABO1sjb0y9IkZBk1nfxhNH2H2sxkF8ps9AHHAWOj96MODmLPYjbFrov0ht8fsJZAjSdNgZC765dwZCKZAgWvNZBICeNVFviO7GEE1ZAvJWDaKajQeGDBjoWFUc5iAdrNQhEeWhQTyO19sefTShOfPitB4rACuzKnmpLVHZBM64uJ7Cv4YFHPI3uzU06wZDZD';
    const requestBody = {
      messaging_product: "whatsapp",
      to: contactNumber,
      type: "template",
      template: {
        name: "booking_success_balance_short",
        language: {
          code: "en"
        },
        components: [
          {
            type: "body",
            parameters: [
              {
                type: "text",
                text: paymentLink
              }
            ]
          }
        ]
      }
    };
  
    try {
      const response = await axios.post(url, requestBody, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      throw error;
    }
  };

  export const sendAdvanceStartOtpMsg = async (contactNumber,otp) => {
    const url = 'https://graph.facebook.com/v19.0/365577786631719/messages';
    const token = 'EAAaO7W1PA5ABO1sjb0y9IkZBk1nfxhNH2H2sxkF8ps9AHHAWOj96MODmLPYjbFrov0ht8fsJZAjSdNgZC765dwZCKZAgWvNZBICeNVFviO7GEE1ZAvJWDaKajQeGDBjoWFUc5iAdrNQhEeWhQTyO19sefTShOfPitB4rACuzKnmpLVHZBM64uJ7Cv4YFHPI3uzU06wZDZD';
    const requestBody = {
      messaging_product: "whatsapp",
      to: contactNumber,
      type: "template",
      template: {
        name: "start_otp",
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
  
    try {
      const response = await axios.post(url, requestBody, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      throw error;
    }
  };