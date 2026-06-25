const corsOptions = {
  origin: ["http://localhost:3000", "https://it-job-ndv.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Set-Cookie"],
};

module.exports = { corsOptions };
