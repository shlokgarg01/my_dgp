
//sends booking cancellation message to customer
const sendWhatsAppCancellationMessage = async (phoneNumber,bookingDetails) => {
    try {
      const response = await fetch('https://graph.facebook.com/v19.0/365577786631719/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer EAAaO7W1PA5ABO1sjb0y9IkZBk1nfxhNH2H2sxkF8ps9AHHAWOj96MODmLPYjbFrov0ht8fsJZAjSdNgZC765dwZCKZAgWvNZBICeNVFviO7GEE1ZAvJWDaKajQeGDBjoWFUc5iAdrNQhEeWhQTyO19sefTShOfPitB4rACuzKnmpLVHZBM64uJ7Cv4YFHPI3uzU06wZDZD`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: phoneNumber,
          type: "template",
          template: {
            name: "booking_cancel_msg_to_customer",
            language: {
              code: "en"
            },
            components: [
              {
                type: "body",
                parameters: [
                  {
                    type: "text",
                    text: bookingDetails
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
                    text: "https://example.com/dynamic-url"
                  }
                ]
              }
            ]
          }
        })
      });
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('WhatsApp API Error:', error);
      throw error;
    }
  };

  module.exports = {
    sendWhatsAppCancellationMessage
  };