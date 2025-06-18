# 📸 Instagram Clone

A full-featured social media app inspired by Instagram, built with the MERN stack. Users can sign up, share posts with images, follow others, comment, like posts, and manage their profiles—all in a smooth and responsive interface.

---

## 🚀 Live Demo

- 🚀 Frontend(Netlify): [https://instaclone202.netlify.app](https://instaclone202.netlify.app)
- 🛠️ Backend(Railway): [https://instaclone-backend-production-0f80.up.railway.app](https://instaclone-backend-production-0f80.up.railway.app)

---

## 📁 Project Structure

Instagram-Clone/
│
├── client/             # React frontend
│   └── ...
│
├── insta-backend/      # Node.js + Express backend
    └── ...

---

## 🚀 Features

### 👤 User Authentication

- Register and login
- JWT-protected routes
- Logout functionality

### 🏡 Home Feed

- View all posts from all users
- Like/Unlike posts (toggle)
- Comment on any post and delete your own
- Click usernames to visit their profile

### 🧑‍🤝‍🧑 Profiles

- View any user’s profile
- Follow or unfollow users
- View and edit your own profile picture
- View followers and following lists
- Navigate to other users via follower/following lists

### ➕ Create Post

- Upload image with title and caption
- Stored securely using Cloudinary

### 🧭 Following Posts Page

- See only the posts of people you follow
- Full interaction: like, comment, visit profiles

---

## 🧰 Tech Stack

| Category         | Technologies Used                        |
| ---------------- | ---------------------------------------- |
| **Frontend**     | React, React Router DOM, Materialize CSS |
| **Backend**      | Node.js, Express.js                      |
| **Database**     | MongoDB Atlas, Mongoose                  |
| **Auth**         | JSON Web Tokens (JWT), Bcrypt.js         |
| **Media Upload** | Cloudinary                               |
| **Deployment**   | Netlify (Frontend), Railway (Backend)    |

---

## 🛠️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/astha-gh/Instagram-Clone.git
cd Instagram-Clone
```

### 2. Install Frontend Dependencies

```bash
cd client
npm install
npm start
```

### 3. Install Backend Dependencies

```bash
cd insta-backend
npm install
npm run dev
```

---

## 📌 To-Do & Future Enhancements

- 💬 Real-time chat (with Socket.io)
- 🔔 In-app notifications
- 📥 Save/Bookmark posts
- 📊 Post analytics (likes/comments over time)
- 🌙 Dark mode toggle
- 🔍 Advanced search and filtering

---

## 📸 Screenshots

- Home Page: [https://res.cloudinary.com/dislhmbst/image/upload/v1750252359/Screenshot_2025-06-18_184053_orwuag.png](https://res.cloudinary.com/dislhmbst/image/upload/v1750252359/Screenshot_2025-06-18_184053_orwuag.png)
- Login Page: https://res.cloudinary.com/dislhmbst/image/upload/v1750252337/Screenshot_2025-06-18_184007_sxbkbo.png[](https://res.cloudinary.com/dislhmbst/image/upload/v1750252337/Screenshot_2025-06-18_184007_sxbkbo.png)
- Signup Page: [https://res.cloudinary.com/dislhmbst/image/upload/v1750252349/Screenshot_2025-06-18_184021_vfzfbc.png](https://res.cloudinary.com/dislhmbst/image/upload/v1750252349/Screenshot_2025-06-18_184021_vfzfbc.png)
- Profile Page: [https://res.cloudinary.com/dislhmbst/image/upload/v1750252376/Screenshot_2025-06-18_184125_fzhm6l.png](https://res.cloudinary.com/dislhmbst/image/upload/v1750252376/Screenshot_2025-06-18_184125_fzhm6l.png)
- Create Post Page: [https://res.cloudinary.com/dislhmbst/image/upload/v1750252368/Screenshot_2025-06-18_184111_q1il0p.png](https://res.cloudinary.com/dislhmbst/image/upload/v1750252368/Screenshot_2025-06-18_184111_q1il0p.png)
