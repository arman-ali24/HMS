<div align="center">
  <h1>MediCare - Smart Hospital Solution🏥</h1>
</div>

# Description
A scalable healthcare management platform that streamlines appointments, patient workflows, healthcare services, and digital payments within a unified system. Built with role-based access control and modern architecture, it enables efficient healthcare operations through secure and intuitive user experiences.

# Features
## A. Admin Can👨‍💼:
1. **Manage Doctors**: Add, update, view, and remove doctor profiles, including specialties, experience, consultation fees, and availability schedules.
2. **Manage Healthcare Services**: Create, edit, organize, and remove medical services while maintaining service details, pricing, and booking availability.
3. **Appointment & Patient Management**: Monitor all patient appointments, track appointment statuses, manage patient records, and oversee booking activities across the platform.
4. **Doctor Availability Management**: Configure doctor schedules and consultation slots to ensure accurate appointment allocation and resource utilization.
5. **Payment & Billing Monitoring**: Track appointment and service payments, monitor transaction records, and oversee billing-related operations.
6. **Analytics & Dashboard Insights**: Access real-time statistics and operational insights, including appointment trends, doctor performance, service usage, and revenue metrics.

## B. Patient Can🧑‍🤝‍🧑:
1. **Secure Account Management**: Register, log in, and manage personal profile information through a secure authentication system.
2. **Doctor & Service Discovery**: Browse doctors by specialty, view detailed profiles, and explore available healthcare services before booking.
3. **Online Appointment Booking**: Schedule doctor consultations seamlessly by selecting preferred doctors, dates, and available time slots.
4. **Healthcare Service Booking**: Book diagnostic tests, medical services, and healthcare packages directly through the platform.
5. **Secure Online Payments**: Make appointment and service payments securely using Stripe with real-time payment confirmation.
6. **Booking History & Tracking**: Access complete appointment and service booking history while tracking booking statuses in real time.
7. **Appointment Management**: Receive booking confirmations and updates, and reschedule or cancel appointments based on availability and platform policies.

## C. Doctor Can👨‍⚕️:
1. **Secure Authentication & Profile Management**: Access a dedicated doctor portal with secure authentication and manage professional profile information.
2. **Appointment Management**: View assigned appointments, manage schedules, and accept, confirm, reschedule, or cancel patient bookings.
3. **Availability & Slot Configuration**: Configure consultation availability and manage appointment slots to optimize scheduling efficiency.
4. **Patient Information Access**: Review patient details, appointment information, and medical history before consultations.
5. **Appointment Status Updates**: Update appointment progress by marking consultations as completed, canceled, or rescheduled.
6. **Service Booking Management**: Monitor and manage service-related bookings associated with healthcare consultations.
7. **Consultation History Tracking**: Access previous appointment records and consultation history for improved patient care and follow-up management.

# 📸 ScreenShots

**Admin Portal**

AdminHome
<img src="screenshots/Admin Panel.png"/>
DashboardPage
<img src="screenshots/Admin Dashboard.png"/>
DoctorPage
<img src="screenshots/Admin DoctorPage.png"/>
ServicePage
<img src="screenshots/Admin ServicePage.png"/>

**Patient Portal**

PatientHome
<img src="screenshots/Patient Home.png"/>
DoctorProfile
<img src="screenshots/Patient DocProfile.png"/>
AppointmentBooking
<img src="screenshots/Patient BookAppt.png"/>
DoctorLoginPage
<img src="screenshots/Doctor LoginPage.png"/>
DoctorDashboard
<img src="screenshots/Doctor Dashboard.png"/>

# 🛠 Tech Stack

## Frontend
- React.js
- Tailwind CSS
- Axios
- React Router DOM

## Backend
- Node.js
- Express.js

## Database
- MongoDB
- Mongoose

## Authentication & Security
Clerk

---

# 📂 Folder Structure

```bash
MediCare/
│
├── frontend/              # React Frontend
├── backend/               # Node.js + Express Backend
│
├── models/                # Database Models
├── routes/                # API Routes
├── controllers/           # Business Logic
├── middleware/            # Custom Middleware
├── config/                # Configuration Files
├── utils/                 # Utility Functions
│
└── README.md
```

---

# ⚙️ Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/arman-ali24/MediCare.git
```

## 2️⃣ Navigate to Project

```bash
cd MediCare
```

---

# 📦 Install Dependencies

## Frontend Setup

```bash
cd frontend
npm install
```

## Backend Setup

```bash
cd backend
npm install
```

---

# 🔑 Environment Variables

Create a `.env` file inside the backend folder and add:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

NODE_ENV=development
```

---

# ▶️ Run Project

## Start Backend Server

```bash
cd backend
npm run dev
```

## Start Frontend

```bash
cd frontend
npm start
```

---

# 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register User |
| POST | `/api/auth/login` | Login User |
| GET | `/api/doctors` | Get All Doctors |
| GET | `/api/doctors/:id` | Get Single Doctor |
| POST | `/api/appointments` | Book Appointment |
| GET | `/api/appointments` | Get User Appointments |

---

# 📸 Screenshots

## Homepage

```md
![Homepage](./screenshots/home.png)
```

## Dashboard

```md
![Dashboard](./screenshots/dashboard.png)
```

---

# 🚀 Future Enhancements

- 🎥 Video Consultation
- 🤖 AI-Based Health Suggestions
- 📧 Email Notifications
- 📊 Admin Analytics Dashboard
- 💊 Prescription Management
- 📱 Mobile App Support

---

# 🔒 Security Features

- Password Hashing using Bcrypt
- JWT Authentication
- Protected Routes
- Secure API Handling
- Environment Variable Protection

---

# 🤝 Contributing

Contributions are welcome!

## Steps to Contribute

1. Fork the repository

2. Create a new branch

```bash
git checkout -b feature-name
```

3. Commit your changes

```bash
git commit -m "Added new feature"
```

4. Push to GitHub

```bash
git push origin feature-name
```

5. Open a Pull Request

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

## Arman Ali

### Connect With Me

- GitHub: https://github.com/arman-ali24
- LinkedIn: https://linkedin.com/in/your-linkedin

---

# ⭐ Show Your Support

If you like this project, give it a ⭐ on GitHub!

## Repository Link

https://github.com/arman-ali24/MediCare
