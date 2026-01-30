const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const User = require('../../models/user.model');

// OAuth Google 
passport.use('google', new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/v1/auth/google/callback',
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      let user = await User.findOne({ email });
  
      if (!user) {
        user = await User.create({
          name: profile.displayName,
          email: email,
          photo: profile.photos?.[0]?.value,
          password: undefined, 
          passwordConfirm: undefined,
          provider: 'google',
          googleId: profile.id,
        })

        done(null, user);
      }

      done(null, user);
    } catch (err) {
        done(err, null);
      }
    }
));

