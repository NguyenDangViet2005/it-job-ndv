const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/user.model");
const env = require("./env.config");

if (env.facebook.appId && env.facebook.appSecret) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: env.facebook.appId,
        clientSecret: env.facebook.appSecret,
        callbackURL: `${env.app.backendUrl}/api/auth/facebook/callback`,
        profileFields: ["id", "displayName", "emails", "photos"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email =
            profile.emails && profile.emails[0]
              ? profile.emails[0].value
              : null;
          const providerId = profile.id;
          const fullname = profile.displayName;
          
          let avatar =
            profile.photos && profile.photos[0]
              ? profile.photos[0].value
              : "https://res.cloudinary.com/duc6z828y/image/upload/c_crop,w_650,h_650,ar_1:1/v1768581047/avatar_nbspgd.avif";
          let coverimage = null;

          // Fetch high-quality avatar and cover from Facebook Graph API
          try {
            const graphRes = await fetch(
              `https://graph.facebook.com/v19.0/me?fields=cover,picture.width(500).height(500)&access_token=${accessToken}`
            );
            if (graphRes.ok) {
              const graphData = await graphRes.json();
              if (graphData.picture && graphData.picture.data && graphData.picture.data.url) {
                avatar = graphData.picture.data.url;
              }
              if (graphData.cover && graphData.cover.source) {
                coverimage = graphData.cover.source;
              }
            }
          } catch (fetchError) {
            console.error("Error fetching Facebook avatar/cover:", fetchError.message);
          }

          // 1. Find user by provider and providerId
          let user = await User.findOne({
            where: { provider: "facebook", providerId: providerId },
          });

          if (user) {
            let hasChanged = false;
            if (avatar && user.avatar !== avatar) {
              user.avatar = avatar;
              hasChanged = true;
            }
            if (coverimage && user.coverimage !== coverimage) {
              user.coverimage = coverimage;
              hasChanged = true;
            }
            if (hasChanged) {
              await user.save();
            }
            return done(null, user);
          }

          // 2. If not found by provider/providerId, search by email
          if (email) {
            user = await User.findOne({ where: { email } });
            if (user) {
              // Update user with provider info
              user.provider = "facebook";
              user.providerId = providerId;
              if (avatar) {
                user.avatar = avatar;
              }
              if (coverimage) {
                user.coverimage = coverimage;
              }
              await user.save();
              return done(null, user);
            }
          }

          // 3. If still not found, create new user
          user = await User.create({
            email: email || `${providerId}@facebook.com`,
            fullname: fullname || "Facebook User",
            provider: "facebook",
            providerId: providerId,
            password: null,
            avatar: avatar,
            coverimage: coverimage,
            role: "user",
          });

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
} else {
  console.warn("⚠️ Facebook App ID or Secret missing, Facebook Strategy not loaded");
}

module.exports = passport;
