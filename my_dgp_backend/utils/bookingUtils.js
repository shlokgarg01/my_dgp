const axios = require("axios"); // Import Axios

function updateBookingPayment({ bookingId, paymentAmount, transactionId, status }) {
  return new Promise((resolve, reject) => {
    const data = {
      bookingId,
      paymentAmount,
      transactionId,
      status,
    };

    // Use Axios to make the POST request
    axios.post('https://mydgp.in/api/v1/bookings/payment/update', data)
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(new Error(`Request failed: ${error.message}`));
      });
  });
}

module.exports = { updateBookingPayment };