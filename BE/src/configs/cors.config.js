const corsOptions = {
  origin: ["http://localhost:3000", "https://it-job-ndv.vercel.app"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

module.exports = { corsOptions };
