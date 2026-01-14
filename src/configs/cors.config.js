export const corsOptions = {
  origin: "http://localhost:3000", // Chỉ cho phép domain này
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Các phương thức được phép
  credentials: true, // Cho phép gửi cookie/header xác thực nếu cần
  optionsSuccessStatus: 204,
};
