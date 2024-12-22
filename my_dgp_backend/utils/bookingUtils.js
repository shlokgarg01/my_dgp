const https = require("https");

function updateBookingPayment({ bookingId, paymentAmount, transactionId,status }) {
  const hostname = req.hostname;
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      bookingId,
      paymentAmount,
      transactionId,
      status,
    });

    const options = {
    hostname: hostname,
    port: 443,
    path: '/api/v1/bookings/payment/update',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
    },
  };

    const req = https.request(options, (res) => {
      let responseData = "";

      res.on("data", (chunk) => {
        responseData += chunk;
      });

      res.on("end", () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(responseData));
        } else {
          reject(new Error(`Request failed with status code ${res.statusCode}`));
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

module.exports = { updateBookingPayment };
