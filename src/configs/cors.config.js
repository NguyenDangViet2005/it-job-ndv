export const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://it-job-ndv.vercel.app"  // Xóa dấu / ở cuối
  ],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};
