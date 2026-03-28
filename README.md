# Eventora – MERN Event Management Platform

Eventora is a full-stack event management platform built using the MERN stack.
It allows users to explore events, register, and manage bookings through a modern web interface.

---

# 🛠 Prerequisites

Make sure the following are installed on your system:

* **Node.js** (v18 or higher recommended)
* **MongoDB Database** (MongoDB Atlas Free Tier recommended)
* **Git**

---

# ⚙️ Environment Variables

Navigate to:

```
server/.env
```

Add the following environment variables:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=supersecretjwtkey_eventora
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
PORT=5000
```

⚠️ Note:

For `EMAIL_PASS`, generate a **Google App Password** from your Google Account settings.
Normal Gmail passwords will not work if **2-Factor Authentication (2FA)** is enabled.

---

# 🚀 Running the Project

## Option 1 – Run Everything from Root Folder (Recommended)

From the **Eventora root folder** run:

```
npm install
npm run install:all
npm run dev
```

This will:

* Install backend dependencies
* Install frontend dependencies
* Start both **server and client together** using `concurrently`

Commands available:

```
npm run dev        # start backend + frontend together
npm run dev:all    # install dependencies + start both
npm run start      # run backend + frontend preview
```

---

# 🖥 Manual Setup (Two Terminals)

If you prefer running services separately.

### Backend Setup

```
cd server
npm install --legacy-peer-deps
npm run dev
```

Backend will run at:

```
http://localhost:5000
```

---

### Frontend Setup

```
cd client
npm install
npm run dev
```

Frontend will run at:

```
http://localhost:5173
```

---

# 📦 Tech Stack

* **Frontend:** React + Vite + TailwindCSS
* **Backend:** Node.js + Express.js
* **Database:** MongoDB
* **Authentication:** JWT
* **API Calls:** Axios

---

## 👨‍💻 Author

Siddhesh Pawar  
GitHub: https://github.com/PrimeSiddhesh