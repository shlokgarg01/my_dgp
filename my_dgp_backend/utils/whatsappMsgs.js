const axios = require('axios'); // Import axios

// Function to send WhatsApp message
const sendWhatsAppBalanceMessage = async (contactNumber, balAmount, bookingId) => {
    balAmount = parseFloat(balAmount).toFixed(2);

    const messageData = {
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
                            text: `₹${balAmount}`
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

    try {
        const response = await axios.post('https://graph.facebook.com/v19.0/365577786631719/messages', messageData, {
            headers: {
                'accept': 'application/json, text/plain, /',
                'authorization': 'Bearer EAAaO7W1PA5ABO1sjb0y9IkZBk1nfxhNH2H2sxkF8ps9AHHAWOj96MODmLPYjbFrov0ht8fsJZAjSdNgZC765dwZCKZAgWvNZBICeNVFviO7GEE1ZAvJWDaKajQeGDBjoWFUc5iAdrNQhEeWhQTyO19sefTShOfPitB4rACuzKnmpLVHZBM64uJ7Cv4YFHPI3uzU06wZDZD',
                'content-type': 'application/json',
            }
        });
        console.log('WhatsApp message sent successfully:', response.data);
    } catch (error) {
        console.error('Error sending WhatsApp message:', error.message);
    }
};

module.exports = { sendWhatsAppBalanceMessage };
