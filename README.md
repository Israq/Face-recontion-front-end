# Face Recognition App (Frontend)

AI-powered face detection running entirely in the browser. No API keys, no external AI services, no costs. Built with React and face-api.js.

---

## Features

- **In-Browser AI** — Face detection via face-api.js (TensorFlow.js)
- **Multi-Face Detection** — Detects multiple faces with confidence scores
- **JWT Authentication** — Persistent login across sessions
- **Smart Entry Counting** — One count per unique image
- **Demo Mode** — Pre-loaded image for instant testing
- **Error Handling** — Messages for invalid URLs, no faces, failed loads
- **Docker + Nginx** — Production-ready containerized deployment
- **Responsive UI** — Tachyons CSS framework

---

## Tech Stack

| Category  | Technology                  |
| --------- | --------------------------- |
| Framework | React (Class Components)    |
| AI/ML     | face-api.js (TensorFlow.js) |
| Styling   | Tachyons CSS                |
| Auth      | JWT (localStorage)          |
| Server    | nginx (Docker)              |
| Container | Docker + Docker Compose     |

---

## Quick Start

### Docker (Recommended)

```bash
docker-compose up -d
```

Open [http://localhost:3000](http://localhost:3000)

### Manual

```bash
git clone https://github.com/Israq/Face-recontion-front-end.git
cd Face-recontion-front-end
npm install
npm start
```

---

## How It Works

1. **Register/Login** — JWT token stored in browser
2. **Paste Image URL** — Any royalty-free image link
3. **Click Detect** — Models load from CDN, detect faces, draw boxes with confidence
4. **Entry Count** — Increments once per unique image
5. **Try Demo** — Click button to test instantly

---

## Project Structure

```
src/
├── Components/
│   ├── FaceRecognition/   # Face bounding box overlay
│   ├── ImageLinkForm/     # URL input + Detect + Demo buttons
│   ├── Navigation/        # Sign in/out navigation
│   ├── Rank/              # Entry count display
│   ├── Register/          # Registration form
│   ├── SignIn/            # Login form
│   └── Logo/              # App logo
├── App.js                 # Main component (face detection logic)
└── App.css                # Custom styles
```

---

## Face Detection Models

Models load automatically from CDN on first use:

- **Tiny Face Detector** — Fast, lightweight
- **Face Landmark 68** — Accurate bounding boxes

---

## Deployment (Render)

| Config            | Value           |
| ----------------- | --------------- |
| Type              | Static Site     |
| Build Command     | `npm run build` |
| Publish Directory | `build`         |
| Node Version      | 22              |

---

## Troubleshooting

| Issue                 | Solution                                           |
| --------------------- | -------------------------------------------------- |
| No face detected      | Try a different image; check console for errors    |
| CORS errors           | Backend proxy handles external image URLs          |
| Token expired         | Auto-redirects to login on next refresh            |
| Models not loading    | CDN may be slow; loads from jsdelivr automatically |
| Blank page on refresh | Shows loading screen while verifying JWT           |
| Invalid URL error     | App shows red error message with guidance          |

---

## Author

**Syed Ragib Israq**

- [GitHub](https://github.com/Israq)
- [LinkedIn](https://www.linkedin.com/in/syed-ragib-israq-profile/)
- [Portfolio](https://israq-portfolio.onrender.com/)
