var Passport = require( 'passport' );
var LocalStrategy = require( 'passport-local' ).Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var Express = require( 'express' );
var BodyParser = require( 'body-parser' );

const {GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET} = require('./config');

var users = {
  zack: {
    username: 'zack',
    password: '1234',
    id: 1,
  },
  node: {
    username: 'node',
    password: '5678',
    id: 2,
  },
}

var localStrategy = new LocalStrategy({
      usernameField: 'username',
      passwordField: 'password',
    },
    function(username, password, done) {
      user = users[ username ];

      if ( user == null ) {
        return done( null, false, { message: 'Invalid user' } );
      };

      if ( user.password !== password ) {
        return done( null, false, { message: 'Invalid password' } );
      };

      done( null, user );
    }
  )

Passport.use( 'local', localStrategy );

Passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(`accessToken: ${accessToken}`);
    console.log(`refreshToken: ${refreshToken}`);
    return done(null, { 'yo': 'hi' });
  }
));

var app = Express();
app.use( BodyParser.urlencoded( { extended: false } ) );
app.use( BodyParser.json() );
app.use( Passport.initialize() );

app.post(
  '/login',
  Passport.authenticate( 'local', { session: false } ),
  function( req, res ) {
    res.send( 'User ID ' + req.user.id );
  }
);

app.get('/auth/google',
  Passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.email'] }));

app.get('/auth/google/callback',
  Passport.authenticate('google', { failureRedirect: '/login', session: false }),
  function(req, res) {
    console.log('callback');
    console.log(req.query);
    res.send('OK')
  });

app.listen( 3000, function() {
  console.log( 'Listening on 3000' );
});
