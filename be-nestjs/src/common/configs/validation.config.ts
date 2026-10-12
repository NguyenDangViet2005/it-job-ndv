import type { ValidationPipeOptions } from '@nestjs/common';

export const validationPipeOptions: ValidationPipeOptions = {
  whitelist: true,
  forbidNonWhitelisted: true, // Chặn Mass Assignment: Báo lỗi 400 Bad Request nếu client gửi thuộc tính không khai báo trong DTO
  transform: true,
  transformOptions: {
    enableImplicitConversion: true,
  },
};
