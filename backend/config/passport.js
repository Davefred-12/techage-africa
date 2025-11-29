// ============================================
// FILE: backend/config/passport.js
// ============================================
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as AppleStrategy } from 'passport-apple';
import User from '../models/User.js';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || 'dummy',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy',
      callbackURL: `${process.env.API_URL || 'http://localhost:5000'}/api/auth/google/callback`,
      scope: ['profile', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await User.findOne({
          $or: [
            { providerId: profile.id, provider: 'google' },
            { email: profile.emails[0].value }
          ]
        });

        if (user) {
          // User exists - update their info if needed
          if (user.provider !== 'google') {
            // User registered with email, now linking Google
            user.provider = 'google';
            user.providerId = profile.id;
            await user.save();
          }

          return done(null, user);
        }

        // Create new user
        user = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          avatar: profile.photos[0]?.value || '',
          provider: 'google',
          providerId: profile.id,
        });

        return done(null, user);
      } catch (error) {
        console.error('Google OAuth error:', error);
        return done(error, null);
      }
    }
  )
);


if (process.env.APPLE_CLIENT_ID && process.env.APPLE_TEAM_ID && process.env.APPLE_KEY_ID && process.env.APPLE_PRIVATE_KEY) {
  passport.use(
    new AppleStrategy(
      {
        clientID: process.env.APPLE_CLIENT_ID,
        teamID: process.env.APPLE_TEAM_ID,
        keyID: process.env.APPLE_KEY_ID,
        privateKeyString: process.env.APPLE_PRIVATE_KEY,
        callbackURL: `${process.env.API_URL || 'http://localhost:5000'}/api/auth/apple/callback`,
        scope: ['name', 'email'],
      },
      async (accessToken, refreshToken, idToken, profile, done) => {
        try {
          // Apple provides less info than Google
          const email = profile.email;
          const name = profile.name ? `${profile.name.firstName} ${profile.name.lastName}` : 'Apple User';

          // Check if user already exists
          let user = await User.findOne({
            $or: [
              { providerId: profile.id, provider: 'apple' },
              { email: email }
            ]
          });

          if (user) {
            // User exists - update their info if needed
            if (user.provider !== 'apple') {
              // User registered with email, now linking Apple
              user.provider = 'apple';
              user.providerId = profile.id;
              await user.save();
            }

            return done(null, user);
          }

          // Create new user
          user = await User.create({
            name: name,
            email: email,
            provider: 'apple',
            providerId: profile.id,
          });

          return done(null, user);
        } catch (error) {
          console.error('Apple OAuth error:', error);
          return done(error, null);
        }
      }
    )
  );
} else {
  console.log('Apple OAuth not configured - skipping Apple strategy');
}

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;