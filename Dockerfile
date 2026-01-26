FROM node:22-alpine
# chuẩn bị môi trường node.js, version 22

WORKDIR /dangviet/itjob-backend
# thư mục lưu trữ code backend trong linux docker

COPY package*.json ./
# copy thư viện sử dụng

RUN npm ci --omit=dev
# tải thư viện production từ package-lock.json (nhanh hơn npm install)

COPY . .
# copy tất cả các file hiện tại trong dự án BE

EXPOSE 8081
# mở port 8081 cho container (hoặc port bạn dùng trong .env)

ENV NODE_ENV=production
# set môi trường production

CMD ["node", "./src/server.js"]
# lệnh chạy server khi container start


