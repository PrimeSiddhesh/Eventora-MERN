# Eventora – AI-Powered MERN Event Management Platform

Eventora is a full-stack event management platform built using the MERN stack. It allows users to explore events, register, and manage bookings through a modern web interface. Now supercharged with Google Gemini AI integration to provide event description generation and a smart assistant.

---

## 🌟 Features

- **User Authentication**: Secure JWT-based auth scheme.
- **Event Management**: Create, view, and delete detailed events.
- **Booking Infrastructure**: Reserve seats, manage requests, and verify OTPs for payments.
- **Admin Dashboard**: Analytics, ticket approval, and complete control over the platform.

### ✨ AI Features (New!)
- **AI Event Description Generator**: Let Google Gemini automatically write professional, compelling descriptions for your events in one click from the Admin Dashboard.
- **AI Event Chatbot & Recommender**: A responsive floating assistant on the homepage that has direct access to upcoming events. Users can ask questions like "What events are happening this week?" or "Recommend me tech events," and receive smart, context-aware answers.

### 💳 Payment Gateway (New!)
- **Razorpay Test Mode Integration**: Full checkout experience injected natively via Razorpay's Modal UI.
- **Cryptographic Verification**: Enterprise-grade backend verification utilizing Node's `crypto` module to validate HMAC SHA-256 signatures, ensuring mathematically proven transactions before booking tickets.

---

## 📦 Tech Stack

- **Frontend:** React + Vite + TailwindCSS
- **Backend:** Node.js + Express.js + `@google/genai` (Gemini SDK)
- **Database:** MongoDB (Atlas)
- **Authentication:** JSON Web Tokens (JWT)
- **API Calls:** Axios

---

## 🛠 Prerequisites

Make sure the following are installed on your system:
- **Node.js** (v18 or higher recommended)
- **MongoDB Database** (MongoDB Atlas Free Tier recommended)
- **Git**

---

## ⚙️ Environment Variables

Navigate to your server directory to set up the environment variables:
```bash
cd server
```

Create a file named `.env` and add the following variables:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=supersecretjwtkey_eventora
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
PORT=5000
GEMINI_API_KEY=your_google_gemini_api_key
```

> **Note:** For `EMAIL_PASS`, generate a Google App Password from your Google Account settings. Normal passwords will not work if 2FA is enabled. Obtain your free Gemini API Key from Google AI Studio.

---

## 🚀 Running the Project Locally

From the **Eventora root folder** run:

```bash
npm run dev:all
```

This will automatically install dependencies and start both the Node.js backend (`localhost:5000`) and the Vite React frontend (`localhost:5173`) using `concurrently`.

---

## 🌍 Deployment Guide

### 1. Deploying the Backend (Render)
Render is an excellent free platform for hosting Node.js applications.
1. Push your code to a GitHub repository.
2. Create an account on [Render](https://render.com/).
3. Click **New +** and select **Web Service**.
4. Connect your GitHub repository.
5. Setup the following configurations:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
6. Click **Advanced** and add your environment variables (`MONGO_URI`, `JWT_SECRET`, `GEMINI_API_KEY`, etc.) exactly as they appear in your local `.env`.
7. Click **Create Web Service**. Wait for the build to finish. Copy the final URL (e.g., `https://eventora-backend.onrender.com`).

### 2. Deploying the Database (MongoDB Atlas)
1. In your MongoDB Atlas dashboard, go to **Network Access**.
2. Add an IP Address: `0.0.0.0/0` (Allows access from anywhere, so Render can connect to it).
3. Ensure the Cluster URL is correctly inserted into the `MONGO_URI` field on Render.

### 3. Deploying the Frontend (Vercel)
Vercel is the best place to host your Vite React application seamlessly.
1. Go to [Vercel](https://vercel.com/) and sign in with GitHub.
2. Click **Add New Project** and select your repository.
3. In the configuration settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Expand **Environment Variables** and add:
   - Name: `VITE_API_URL`
   - Value: `https://your-backend-url.onrender.com/api` *(replace with the URL from Render!)*
5. Click **Deploy**. Vercel will build and launch your frontend live!

---

## 👨‍💻 Author

**Siddhesh Pawar**
GitHub: [PrimeSiddhesh](https://github.com/PrimeSiddhesh)