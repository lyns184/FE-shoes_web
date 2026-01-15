# 👟 WEBSITE BÁN GIÀY – BACKEND SERVICE


![ExpressJS](https://img.shields.io/badge/ExpressJS-000000?style=for-the-badge&logo=express&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)


---


## 📌 Giới thiệu
Đây là **Backend Service** cho dự án **Website Bán Giày**, được xây dựng theo mô hình **REST API**, sử dụng **Docker** để quản lý database và **Prisma ORM** để thao tác dữ liệu.
---


## 🚀 Công nghệ sử dụng
- **Node.js**
- **ExpressJS**
- **TypeScript**
- **Docker & Docker Compose**
- **Prisma ORM**


---


## 🛠 Hướng dẫn chạy dự án


### 1️⃣ Yêu cầu môi trường
- Đã cài đặt **Docker**
- **Node.js >= 18**


👉 Tải Docker tại:  
https://www.docker.com/


---


### 2️⃣ Khởi động Database bằng Docker


#### Bước 1: Cấu hình môi trường
- Cập nhật file `.env` tại thư mục **root**
- Truy cập file môi trường tại: https://drive.google.com/drive/folders/1MaVa3ayXpoGSizeNqf92aqwuv5HUrtfK?usp=sharing


#### Bước 2: Chạy Docker
Mở Terminal tại thư mục root của project và chạy:


```bash
docker compose up -d
```


#### Bước 3: Kiểm tra database
- Mở trình duyệt và truy cập:
```
http://localhost:8080
```
- Đăng nhập **phpMyAdmin** bằng tài khoản: cloudian, password: cloud.


> ⚠️ **Lưu ý quan trọng**  
> Trước khi chạy Docker, hãy **tắt toàn bộ service đang chiếm port 3306** trên máy (MySQL, MariaDB, SQL Server…) để tránh xung đột.


Nếu gặp lỗi Docker:
```bash
docker compose down -v
docker compose up -d
```
Nếu các máy tính sử dụng Linux thì thêm sudo vào phía trước
---


## ▶️ Chạy Backend


### 🔰 Lần đầu clone project
Chạy lần lượt các lệnh sau:


```bash
npm run install
npx prisma db push
npx prisma generate
```


Lệnh này sẽ:
- Cài đặt dependencies
- Generate Prisma Client
- Chuẩn bị môi trường cho server


---


### ▶️ Chạy server
```bash
npm run start
```


Nếu Terminal hiển thị:
```
Server khoi dong thanh cong o port: 6869
```
→ Backend đã chạy thành công ✅


---
---


### ▶️ Chạy frontend
```bash
npm run dev
```

