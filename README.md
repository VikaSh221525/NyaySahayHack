# 🏛️ NyaySahay - Justice for All

<div align="center">

![NyaySahay Banner](https://via.placeholder.com/1200x300/1e40af/ffffff?text=NyaySahay+-+Empowering+Citizens,+Ensuring+Justice)

**A comprehensive legal assistance platform connecting citizens with legal advocates and authorities**

[![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-Real--time-010101?style=for-the-badge&logo=socket.io)](https://socket.io/)

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Usage](#-usage) • [Screenshots](#-screenshots)

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 About

**NyaySahay** is a revolutionary legal assistance platform designed to bridge the gap between citizens seeking legal help and qualified advocates. The platform also enables citizens to report incidents directly to authorities with comprehensive evidence management and email notifications.

### Key Objectives

- 🤝 Connect clients with qualified legal advocates
- 📢 Enable easy incident reporting to authorities
- 💬 Facilitate real-time communication via chat and video calls
- 🤖 Provide AI-powered legal assistance
- 📊 Track case progress and consultation requests
- 🔒 Ensure secure and confidential interactions

---

## ✨ Features

### For Clients

- ✅ **User Authentication** - Secure signup/login with JWT
- 👤 **Profile Management** - Complete profile with personal details and ID proof
- 🔍 **Find Advocates** - Browse and connect with qualified legal professionals
- 📝 **Report Incidents** - Submit detailed incident reports with evidence (images, videos, documents)
- 📧 **Email Notifications** - Automatic email alerts to authorities and confirmation to reporter
- 💬 **Real-time Chat** - Instant messaging with connected advocates
- 📞 **Video Calls** - High-quality video consultations using Stream SDK
- 🤖 **AI Legal Assistant** - Get instant legal guidance powered by Google Gemini AI
- 📊 **Track Incidents** - Monitor status of reported incidents
- 🔔 **Dashboard** - Overview of consultations, advocates, and incidents

### For Advocates

- ✅ **Professional Registration** - Signup with bar council credentials
- 👨‍⚖️ **Profile Management** - Showcase expertise, specialization, and experience
- 📋 **Client Management** - View and manage consultation requests
- ✅ **Accept/Reject Requests** - Control your client list
- 💬 **Real-time Chat** - Communicate with clients instantly
- 📞 **Video Consultations** - Conduct professional video meetings
- 📊 **Dashboard** - Track active clients and pending requests

### Technical Features

- 🔐 **Secure Authentication** - JWT-based auth with HTTP-only cookies
- 🚀 **Real-time Communication** - Socket.io for instant updates
- 📁 **File Upload** - ImageKit integration for evidence storage
- 🎥 **Video Calling** - Stream Video SDK integration
- 💾 **Vector Database** - Pinecone for AI-powered search
- 📧 **Email Service** - Nodemailer for incident notifications
- 🎨 **Modern UI** - Tailwind CSS with responsive design
- ⚡ **Fast Performance** - Vite for lightning-fast development

---

## 🛠️ Tech Stack

### Frontend

- **Framework:** React 19.1.1
- **Build Tool:** Vite 7.1.2
- **Styling:** Tailwind CSS 4.1.13
- **State Management:** Zustand 5.0.8
- **Data Fetching:** TanStack Query (React Query) 5.87.4
- **Routing:** React Router DOM 7.8.2
- **Forms:** React Hook Form 7.62.0
- **Real-time Chat:** Stream Chat React 13.6.4
- **Video Calls:** Stream Video React SDK 1.21.1
- **Notifications:** React Hot Toast 2.6.0
- **Icons:** Lucide React 0.543.0
- **Animations:** GSAP React 2.1.2
- **HTTP Client:** Axios 1.11.0
- **WebSocket:** Socket.io Client 4.8.1

### Backend

- **Runtime:** Node.js
- **Framework:** Express 5.1.0
- **Database:** MongoDB (Mongoose 8.18.1)
- **Authentication:** JWT (jsonwebtoken 9.0.2) + bcryptjs 3.0.2
- **File Upload:** Multer 2.0.2
- **File Storage:** ImageKit 6.0.0
- **Real-time:** Socket.io 4.8.1
- **Chat Service:** Stream Chat 9.19.0
- **Email:** Nodemailer 7.0.6
- **AI:** Google Generative AI 1.19.0
- **Vector DB:** Pinecone 6.1.2
- **Security:** CORS 2.8.5, Cookie Parser 1.4.7

---

## 🏗️ Architecture

```
NyaySahay/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   │   ├── Authentication/
│   │   │   ├── Client/
│   │   │   ├── Advocate/
│   │   │   └── Onboarding/
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API service layer
│   │   ├── routes/          # Route configuration
│   │   └── common/          # Shared components
│   └── public/              # Static assets
│
└── backend/                 # Node.js backend application
    ├── src/
    │   ├── controllers/     # Request handlers
    │   ├── models/          # MongoDB schemas
    │   ├── routes/          # API routes
    │   ├── middlewares/     # Auth, upload, etc.
    │   ├── services/        # Business logic
    │   │   ├── ai.service.js
    │   │   ├── email.service.js
    │   │   ├── storage.service.js
    │   │   └── vector.service.js
    │   ├── db/              # Database configuration
    │   └── sockets/         # WebSocket handlers
    └── server.js            # Entry point
```

---

## 🚀 Installation

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn
- ImageKit account
- Stream account
- Google Gemini API key
- Pinecone account
- Gmail account (for email notifications)

### Clone Repository

```bash
git clone https://github.com/yourusername/nyaysahay.git
cd nyaysahay
```

### Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in backend directory:

```env
PORT=3000
FRONTEND_URL=http://localhost:5173
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url
STEAM_API_KEY=your_stream_api_key
STEAM_API_SECRET=your_stream_api_secret
PINECONE_API_KEY=your_pinecone_api_key
GEMINI_API_KEY=your_gemini_api_key
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
```

Start backend server:

```bash
npm run server
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file in frontend directory:

```env
VITE_STREAM_API_KEY=your_stream_api_key
VITE_API_BASE_URL=http://localhost:3000/api
```

Start frontend development server:

```bash
npm run dev
```

The application will be available at:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

---

## 🔐 Environment Variables

### Backend Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port number | Yes |
| `FRONTEND_URL` | Frontend application URL | Yes |
| `MONGODB_URL` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `IMAGEKIT_PUBLIC_KEY` | ImageKit public key | Yes |
| `IMAGEKIT_PRIVATE_KEY` | ImageKit private key | Yes |
| `IMAGEKIT_URL_ENDPOINT` | ImageKit URL endpoint | Yes |
| `STEAM_API_KEY` | Stream API key | Yes |
| `STEAM_API_SECRET` | Stream API secret | Yes |
| `PINECONE_API_KEY` | Pinecone API key | Yes |
| `GEMINI_API_KEY` | Google Gemini API key | Yes |
| `EMAIL_USER` | Gmail address for notifications | Optional* |
| `EMAIL_PASS` | Gmail app password | Optional* |

*If email credentials are not provided, emails will be logged to console instead of being sent.

### Frontend Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_STREAM_API_KEY` | Stream API key (must match backend) | Yes |
| `VITE_API_BASE_URL` | Backend API base URL | Yes |

---

## 📖 Usage

### For Clients

1. **Sign Up**
   - Visit the application and select "Client"
   - Fill in your details (name, email, phone, password)
   - Complete onboarding with state and optional profile picture

2. **Find Advocates**
   - Browse recommended advocates based on your needs
   - View advocate profiles, specializations, and experience
   - Send consultation requests

3. **Report Incidents**
   - Navigate to "Report Incident"
   - Fill in incident details (title, type, location, urgency)
   - Upload evidence files (images, videos, documents)
   - Submit - authorities will be notified via email

4. **Chat & Video Call**
   - Once connected with an advocate, start chatting
   - Schedule video consultations for detailed discussions

5. **AI Assistant**
   - Access NyaySahay AI for instant legal guidance
   - Ask questions about legal procedures and rights

### For Advocates

1. **Sign Up**
   - Select "Advocate" during registration
   - Provide professional details (bar council number, specialization)
   - Upload bar certificate for verification
   - Complete onboarding

2. **Manage Clients**
   - View consultation requests in "Your Clients"
   - Accept or reject requests based on your availability
   - Track active clients

3. **Provide Consultation**
   - Chat with clients in real-time
   - Conduct video consultations
   - Provide legal advice and guidance

---

## 📡 API Documentation

### Authentication Endpoints

#### Client Authentication
```
POST /api/auth/signup/client       - Register new client
POST /api/auth/login/client        - Client login
POST /api/auth/logout/client       - Client logout
PUT  /api/auth/onboarding/client   - Complete client onboarding
GET  /api/auth/me/client           - Get client profile
PUT  /api/auth/profile/client      - Update client profile
```

#### Advocate Authentication
```
POST /api/auth/signup/advocate     - Register new advocate
POST /api/auth/login/advocate      - Advocate login
POST /api/auth/logout/advocate     - Advocate logout
PUT  /api/auth/onboarding/advocate - Complete advocate onboarding
GET  /api/auth/me/advocate         - Get advocate profile
PUT  /api/auth/profile/advocate    - Update advocate profile
```

### Incident Endpoints
```
POST /api/incidents/report         - Report new incident
GET  /api/incidents/my-incidents   - Get user's incidents
GET  /api/incidents/:id            - Get incident details
```

### Connection Endpoints
```
POST /api/connections/request      - Send consultation request
GET  /api/connections/my-advocates - Get client's advocates
GET  /api/connections/your-clients - Get advocate's clients
PUT  /api/connections/:id/accept   - Accept consultation request
PUT  /api/connections/:id/reject   - Reject consultation request
```

### Chat Endpoints
```
POST /api/chat/token               - Get Stream chat token
POST /api/chat/create-channel      - Create chat channel
GET  /api/chat/channels            - Get user's channels
```

---

## 📸 Screenshots

### Landing Page
![Landing Page](https://via.placeholder.com/800x450/1e40af/ffffff?text=Landing+Page+-+Select+User+Type)

### Client Dashboard
![Client Dashboard](https://via.placeholder.com/800x450/3b82f6/ffffff?text=Client+Dashboard)

### Advocate Dashboard
![Advocate Dashboard](https://via.placeholder.com/800x450/8b5cf6/ffffff?text=Advocate+Dashboard)

### Report Incident
![Report Incident](https://via.placeholder.com/800x450/ef4444/ffffff?text=Report+Incident+Form)

### Chat Interface
![Chat Interface](https://via.placeholder.com/800x450/10b981/ffffff?text=Real-time+Chat)

### Video Call
![Video Call](https://via.placeholder.com/800x450/f59e0b/ffffff?text=Video+Consultation)

### AI Assistant
![AI Assistant](https://via.placeholder.com/800x450/6366f1/ffffff?text=NyaySahay+AI+Assistant)

---

## 🎨 Key Features Showcase

### 🔒 Secure Authentication Flow
- JWT-based authentication with HTTP-only cookies
- Role-based access control (Client/Advocate)
- Protected routes with automatic redirects
- Session management with React Query

### 📧 Incident Reporting System
- Multi-file upload support (images, videos, documents)
- Automatic email notifications to authorities
- Confirmation emails to reporters
- Status tracking (Submitted, Under Review, Forwarded, Resolved)
- Evidence management with ImageKit CDN

### 💬 Real-time Communication
- Instant messaging powered by Stream Chat
- Video consultations with Stream Video SDK
- Socket.io for real-time updates
- Typing indicators and read receipts

### 🤖 AI-Powered Legal Assistant
- Google Gemini AI integration
- Context-aware legal guidance
- Vector database for intelligent search
- Natural language processing

---

## 🔧 Development

### Run in Development Mode

```bash
# Backend
cd backend
npm run server

# Frontend
cd frontend
npm run dev
```

### Build for Production

```bash
# Frontend
cd frontend
npm run build

# Preview production build
npm run preview
```

### Linting

```bash
cd frontend
npm run lint
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the ISC License.

---

## 👥 Team

- **Developer:** Your Name
- **Project:** NyaySahay - Justice for All

---

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI Framework
- [Express](https://expressjs.com/) - Backend Framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Stream](https://getstream.io/) - Chat & Video SDK
- [ImageKit](https://imagekit.io/) - Media Storage
- [Google Gemini](https://ai.google.dev/) - AI Integration
- [Pinecone](https://www.pinecone.io/) - Vector Database
- [Tailwind CSS](https://tailwindcss.com/) - Styling

---

## 📞 Support

For support, email support@nyaysahay.com or open an issue in the repository.

---

<div align="center">

**Made with ❤️ for Justice and Equality**

⭐ Star this repository if you find it helpful!

</div>
