# Docuno – Full Stack Doctor Appointment Booking System

Docuno is a scalable, production-ready full-stack appointment booking system built using the **MERN Stack** (MongoDB, Express.js, React.js, Node.js). This application is designed for doctors, hospitals, and clinics to manage patient appointments seamlessly. It supports **three levels of user authentication** and integrates **online payment processing**.

---

## 🔧 Tech Stack

| Technology        | Description                        |
|------------------|------------------------------------|
| ![React](https://img.shields.io/badge/Frontend-React.js-61DAFB?style=flat&logo=react&logoColor=white) | Frontend framework |
| ![Node](https://img.shields.io/badge/Backend-Node.js-339933?style=flat&logo=nodedotjs&logoColor=white) | Backend runtime |
| ![Express](https://img.shields.io/badge/API-Express.js-000000?style=flat&logo=express&logoColor=white) | Backend web framework |
| ![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=flat&logo=mongodb&logoColor=white) | NoSQL Database |
| ![Razorpay](https://img.shields.io/badge/Payment-Razorpay-02042B?style=flat&logo=razorpay&logoColor=white) | Payment Gateway |
| ![Cloudinary](https://img.shields.io/badge/Image%20Hosting-Cloudinary-3448C5?style=flat&logo=cloudinary&logoColor=white) | Media Management |

---

## 🔐 User Roles & Features

### 🩺 Patient Portal
- Register / Login
- Search and book appointments with doctors
- Pay fees online via Razorpay
- View and manage bookings

### 👨‍⚕️ Doctor Dashboard
- Login & profile management
- View appointments and earnings
- Profile update functionality

### 🛠 Admin Panel
- Secure admin authentication
- View and manage all appointments
- Add / edit / delete doctor profiles

---

## 🌐 Live Demo

> [**You can deploy it on platforms like Vercel (frontend/admin)** and **Render or Railway (backend)**. Once deployed, replace the environment variables with production keys.]

---

## 📁 Project Structure

```bash
Docuno/
├── backend/           # Express.js API with MongoDB
├── frontend/          # React.js frontend for patients & doctors
└── admin-panel/       # Separate React.js frontend for admin


⚙️ Installation Instructions
1. Clone the Repository
bash
Copy
Edit
git clone https://github.com/your-username/Docuno.git
cd Docuno
2. Backend Setup
bash
Copy
Edit
cd backend
npm install
npm run server
.env configuration (create .env file in backend folder)
env
Copy
Edit
MONGODB_URI=
CLOUDINARY_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_SECRET_KEY=
VITE_FRONTEND_URL=
ADMIN_EMAIL=
ADMIN_PASSWORD=
JWT_SECRET=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
CURRENCY=
3. Frontend (Patient/Doctor Panel)
bash
Copy
Edit
cd frontend
npm install
npm run dev
.env configuration (create .env file in frontend folder)
env
Copy
Edit
VITE_BACKEND_URL=
VITE_RAZORPAY_KEY_ID=
4. Admin Panel Setup
bash
Copy
Edit
cd admin-panel
npm install
npm run dev
.env configuration (create .env file in admin-panel folder)
env
Copy
Edit
VITE_RAZORPAY_KEY_ID=
