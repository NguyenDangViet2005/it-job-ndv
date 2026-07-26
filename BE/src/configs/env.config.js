// src/configs/env.js
module.exports = {
  app: {
    name: process.env.APP_NAME,
    env: process.env.NODE_ENV,
    port: Number(process.env.PORT),
    backendUrl:
      process.env.BACKEND_URL ||
      (process.env.NODE_ENV === "production"
        ? "https://it-job-ndv-express.onrender.com"
        : "http://localhost:8081"),
  },

  client: {
    url: process.env.CLIENT_URL,
  },

  facebook: {
    appId: process.env.APP_ID,
    appSecret: process.env.APP_SECRET,
  },

  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || process.env.CUSTOMER_ID || "598416758150-6uvtssg87ei6c2asfpunqiq4p9eiubc1.apps.googleusercontent.com",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || process.env.CLIENT_SECRET || process.env.CUSTOMER_SECRET,
  },

  db: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: process.env.DB_SSL === "true", // true for production (Render, etc.)
  },

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  },

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
    cloudFolder: process.env.CLOUDINARY_CLOUD_FOLDER,
  },
};
