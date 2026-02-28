# techzuSocial

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=black)
![React Native](https://img.shields.io/badge/React%20Native-61DAFB?style=flat&logo=react&logoColor=black)
![Expo](https://img.shields.io/badge/Expo-000020?style=flat&logo=expo&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=flat&logo=render&logoColor=white)

A lightweight social media application where users — built with a Node.js/Express backend and a React Native (Expo) mobile client.

**Live API:** [`https://techzusocial.onrender.com`](https://techzusocial.onrender.com)

---

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Backend** | Node.js · Express 5 · MongoDB (Mongoose 9) · Firebase Admin SDK (FCM) · JWT · bcryptjs |
| **Mobile** | React Native 0.81 · Expo SDK 54 · Expo Router v6 · Zustand + Immer · React Native Reanimated · Bottom Sheet · Firebase Messaging · date-fns |
| **Deployment** | Render |

---

## Preview

<!-- Add your screenshots here -->



https://github.com/user-attachments/assets/a7d76cea-9c89-4909-abe1-51ed522b6906



---

## Project Structure

```
techzuSocial/
├── backend/
│   └── src/
│       ├── config/          # DB & Firebase setup
│       ├── controllers/     # Auth, Post, Like, Comment handlers
│       ├── middleware/       # JWT auth middleware
│       ├── models/          # User, Post, Comment, Notification schemas
│       ├── routes/          # Auth & Post route definitions
│       ├── utils/           # Auth helpers, FCM push sender
│       ├── workers/         # Background notification worker
│       ├── app.js           # Express app setup
│       └── server.js        # Entry point
│
├── mobile/
│   └── src/
│       ├── @types/          # TypeScript type definitions
│       ├── api/             # API client & endpoint functions
│       ├── app/             # Expo Router screens
│       │   ├── (auth)/      # Login, Register
│       │   └── (tabs)/      # Feed, Create Post, Profile
│       ├── components/      # Reusable UI components
│       ├── constants/       # API URL, colors, config
│       ├── helper/          # App logger
│       ├── hooks/           # useDebounce, useNotifications
│       ├── store/           # Zustand slices (auth, posts)
│       └── utils/           # Validation, date, push, avatar helpers
│
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- MongoDB Atlas cluster
- Firebase project with Cloud Messaging enabled

### Backend

```bash
cd backend
yarn install
```

Create a `.env` file from the example:

```env
PORT=3000
ATLAS_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/<db>
JWT_SECRET=<your_secret>
ENABLE_WORKER=true
FIREBASE_SERVICE_ACCOUNT=<service_account_json>
```

```bash
yarn dev        # starts with nodemon
```

### Mobile

```bash
cd mobile
yarn install
```

Set the API URL in your environment:

```env
EXPO_PUBLIC_API_URL=https://techzusocial.onrender.com
```

```bash
yarn start      # runs expo start
```

---

## Optimizations

### 1. Background Notification Worker (Backend)

Push notifications are **not sent inline** during API requests. Instead, controllers queue a `Notification` document with `status: "pending"`, and a **background worker** picks them up:

- **Batch processing** — claims up to **10** pending notifications per cycle using a `claimId` to prevent duplicate processing.
- **Polling interval** — runs every **10 seconds** on long-running servers (Render).
- **Expose** — exposes `POST /api/workers/run` for triggered execution in serverless environments.
- **Fault tolerance** — failed notifications are marked with `status: "failed"` and a `failReason`; they don't block the batch.

> See `backend/src/workers/notification.worker.js`

### 2. Debounced Likes (Mobile)

Rapid like/unlike taps are debounced to **prevent excessive API calls**:

```ts
const handleLike = useDebounce(
    useCallback((postId) => { toggleLike(postId); }, [toggleLike]),
    400,   // 400ms delay
);
```

The custom `useDebounce` hook clears and resets a timeout on each call, so only the **last tap within 400ms** triggers the network request.

> See `mobile/src/hooks/useDebounce.ts` and `mobile/src/app/(tabs)/index.tsx`

### 3. Paginated FlatList (Mobile + Backend)

Feed and profile screens use **cursor-based pagination** for smooth infinite scroll:

- **Backend** — `getPosts` and `getMyPosts` accept `page` & `limit` query params (default: 10 per page) and use MongoDB `skip` + `limit`.
- **Mobile store** — `fetchPosts()` loads page 1 (pull-to-refresh); `loadMorePosts()` appends the next page. Loading guards prevent duplicate requests.
- **FlatList** — `onEndReached` fires at **40% threshold** (`onEndReachedThreshold={0.4}`), triggering `loadMorePosts`. A footer spinner shows while loading; pagination stops when a page returns fewer than 10 items.

> See `backend/src/controllers/post.controller.js` and `mobile/src/store/posts.slice.ts`

---

## API Endpoints

All routes except register/login require `Authorization: Bearer <token>`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Create a new account |
| `POST` | `/api/auth/login` | Log in & receive JWT |
| `GET` | `/api/auth/me` | Get current user profile |
| `PUT` | `/api/auth/token` | Save FCM push token |
| `DELETE` | `/api/auth/token` | Remove FCM push token |
| `POST` | `/api/posts` | Create a new post |
| `GET` | `/api/posts?page=1&limit=10` | Get paginated feed |
| `GET` | `/api/posts/me?page=1&limit=10` | Get current user's posts |
| `POST` | `/api/posts/:postId/like` | Toggle like on a post |
| `POST` | `/api/posts/:postId/comments` | Add a comment |
| `GET` | `/api/posts/:postId/comments` | Get comments for a post |

---

## Deployment

The backend is deployed on **[Render](https://render.com)** as a Web Service.

| | |
|---|---|
| **Platform** | Render |
| **Live URL** | [`https://techzusocial.onrender.com`](https://techzusocial.onrender.com) |
| **Build Command** | `yarn install` |
| **Start Command** | `yarn start` |
| **Environment** | Node.js |

> **Note:** Render free-tier instances spin down after inactivity. The first request after idle may take ~30s to cold-start.
