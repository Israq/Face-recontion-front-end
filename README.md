# Face Recognition App

Full-stack AI-powered face detection application. Detects multiple faces with confidence scores, all running in the browser with zero API costs. Features JWT authentication, guest mode, smart entry tracking, and Docker containerization.

---

## Features

- **In-Browser AI** — Face detection via face-api.js (TensorFlow.js), no external APIs
- **Multi-Face Detection** — Detects multiple faces with confidence percentages
- **JWT Authentication** — Persistent login across sessions and page refreshes
- **Guest Mode** — One-click demo access for recruiters, no registration needed
- **Smart Entry Counting** — One count per unique image, no duplicates
- **Try Demo** — Pre-loaded demo image for instant testing
- **Error Handling** — Clear messages for invalid URLs, wrong passwords, no faces detected
- **Mobile Optimized** — Heavy animations disabled on mobile for smooth performance
- **Docker + Nginx** — Production-ready containerized deployment
- **Responsive UI** — Tachyons CSS framework

---

## Tech Stack

| Layer        | Technologies                               |
| ------------ | ------------------------------------------ |
| **Frontend** | React, Tachyons CSS, face-api.js           |
| **Backend**  | Node.js, Express, JWT, bcrypt              |
| **Database** | Supabase (PostgreSQL)                      |
| **AI/ML**    | face-api.js (TensorFlow.js, browser-based) |
| **DevOps**   | Docker, Docker Compose, nginx              |
| **Cloud**    | Render (deployment)                        |

---

## Why face-api.js?

|                | Clarifai (old)       | face-api.js (new)     |
| -------------- | -------------------- | --------------------- |
| **Cost**       | Paid after credits   | Free forever          |
| **API Key**    | Required             | None                  |
| **Limits**     | Credit-based         | Unlimited             |
| **Processing** | Server-side          | Client-side (browser) |
| **Privacy**    | Image sent to server | Image stays local     |

---

## Quick Start

### Docker (One Command)

```bash
docker-compose up -d
```

Open [http://localhost:3000](http://localhost:3000)

### Manual Setup

**Backend:**

```bash
git clone https://github.com/Israq/Face-recognition-backend.git
cd Face-recognition-backend
npm install
# Create .env with DATABASE_URL and PORT=3001
node server.js
```

**Frontend:**

```bash
git clone https://github.com/Israq/Face-recontion-front-end.git
cd Face-recontion-front-end
npm install
npm start
```

---

## Environment Variables

```
DATABASE_URL=postgresql://user:password@host:5432/dbname
PORT=3001
```

---

## API Endpoints

| Method | Endpoint            | Description                        |
| ------ | ------------------- | ---------------------------------- |
| POST   | `/signin`           | Authenticate user, returns JWT     |
| POST   | `/register`         | Create new account                 |
| GET    | `/verify-token`     | Validate JWT, return user          |
| GET    | `/profile/:id`      | Get user profile                   |
| PUT    | `/image`            | Increment entry count              |
| GET    | `/proxy-image?url=` | Fetch external image (CORS bypass) |
| GET    | `/setup`            | Create database tables             |
| GET    | `/add-entries`      | Add entries column                 |

---

## How It Works

1. **Register, Login, or Guest** — JWT token stored in browser. Click "Try as Guest" for instant demo access without registration.
2. **Paste Image URL** — Any royalty-free image link from the web
3. **Click Detect** — face-api.js models load from CDN, detect faces, draw bounding boxes with confidence scores
4. **Entry Count** — Increments once per unique image URL
5. **Try Demo** — Click "Try Demo Image" to test with a pre-loaded image instantly

---

## Project Structure

```
├── Face-recognition-backend/
│   ├── controllers/
│   │   ├── signin.js        # JWT auth
│   │   ├── register.js      # User registration
│   │   ├── image.js         # Entry count update
│   │   ├── profile.js       # User profile
│   │   └── setup.js         # Database setup
│   ├── server.js            # Express server
│   ├── Dockerfile
│   └── .node-version
├── Face-recontion-front-end/
│   ├── src/
│   │   ├── Components/
│   │   │   ├── FaceRecognition/   # Face box overlay
│   │   │   ├── ImageLinkForm/     # URL input + buttons
│   │   │   ├── Navigation/        # Sign in/out nav
│   │   │   ├── Rank/              # Entry count display
│   │   │   ├── Register/          # Registration form
│   │   │   ├── SignIn/            # Login form (with guest mode)
│   │   │   └── Logo/              # App logo
│   │   └── App.js                 # Face detection logic
│   ├── Dockerfile
│   └── .node-version
└── docker-compose.yml
```

---

## Docker Commands

```bash
docker-compose up -d          # Start services
docker-compose down           # Stop services
docker-compose up --build -d  # Rebuild and start
```

---

## Deployment

Deployed on **Render** with auto-deploy from GitHub:

| Service  | URL                                                   |
| -------- | ----------------------------------------------------- |
| Frontend | `https://face-recognition-frontend-cio2.onrender.com` |
| Backend  | `https://face-recognition-backend-r8nm.onrender.com`  |

---

## Troubleshooting

| Issue                     | Solution                                                   |
| ------------------------- | ---------------------------------------------------------- |
| Register fails            | Database may be asleep; try again in 30 seconds            |
| Wrong password            | Red alert appears with error message                       |
| Guest login fails         | Ensure guest account exists on backend                     |
| CORS errors               | Backend image proxy (`/proxy-image`) handles external URLs |
| No face detected          | Try a different image; check browser console for errors    |
| Token expired             | Auto-redirects to login on next refresh                    |
| Models not loading        | CDN may be slow; loads from jsdelivr automatically         |
| Port conflict             | Backend uses 3001, frontend uses 3000; Docker maps 80→3000 |
| Database connection error | Supabase free tier has no expiry; check DATABASE_URL       |

---

## Author

**Syed Ragib Israq**

- [GitHub](https://github.com/Israq)
- [LinkedIn](https://www.linkedin.com/in/syed-ragib-israq-profile/)
- [Portfolio](https://israq-portfolio.onrender.com/)
