# Bước 1: Build ứng dụng React với Node.js
FROM node:20-alpine AS build
WORKDIR /app

# Copy file package.json và install dependencies trước để cache
COPY package*.json ./
RUN npm install

# Copy toàn bộ code và build
COPY . .
RUN npm run build

# Bước 2: Dùng Nginx để phục vụ các file tĩnh đã build
FROM nginx:stable-alpine

# Copy các file từ bước build sang thư mục mặc định của Nginx
# Lưu ý: Vite mặc định build ra thư mục 'dist'
COPY --from=build /app/dist /usr/share/nginx/html

# Mở cổng 80 cho Nginx
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]