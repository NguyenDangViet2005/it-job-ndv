export const corsOptions = {
  origin: ["http://localhost:3000", "https://it-job-ndv-d1zf.vercel.app"], // Các domain được phép
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Các phương thức được phép
  credentials: true, // Cho phép gửi cookie/header xác thực nếu cần
  optionsSuccessStatus: 204,
};
