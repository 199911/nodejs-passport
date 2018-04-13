const {google} = require('googleapis');

const {GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET} = require('./config');
const OAuth2 = google.auth.OAuth2;

// WARNING: Make sure your CLIENT_SECRET is stored in a safe place.
const oauth2Client = new OAuth2({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/callback"
});

let token = '<Put the oauth2 token here>';

// Retrieve tokens via token exchange explained above or set them:
oauth2Client.setCredentials({
  access_token: token,
  refresh_token: undefined,
  // Optional, provide an expiry_date (milliseconds since the Unix Epoch)
  // expiry_date: (new Date()).getTime() + (1000 * 60)
});

const oauth2 = google.oauth2('v2')
oauth2.userinfo.get({
  auth: oauth2Client
}, function (err, response) {
  if( err ) {
    console.log(err.response.data);
  } else {
    console.log(response.data);
  }
});
