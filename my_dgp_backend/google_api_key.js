const ENV = process.env;

module.exports = {
  type: "service_account",
  project_id: ENV.GOOGLE_DRIVE_PROJECT_ID,
  private_key_id: ENV.GOOGLE_DRIVE_PRIVATE_KEY_ID,
  private_key: ENV.GOOGLE_DRIVE_PRIVATE_KEY,
  client_email: ENV.GOOGLE_DRIVE_CLIENT_EMAIL,
  client_id: ENV.GOOGLE_DRIVE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: ENV.GOOGLE_DRIVE_CLIENT_CERT_URL,
  universe_domain: "googleapis.com",
};
