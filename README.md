# Streaming Room

A real-time collaborative video streaming platform where users can watch videos together in synchronized rooms.

## Features

- Create and join streaming rooms
- Real-time video synchronization across all users in a room
- Play/pause synchronization
- Seek position synchronization
- Progress tracking
- User authentication
- Room management (create, join, leave)

## Tech Stack

### Frontend
- React with TypeScript
- Socket.IO Client
- React Player for video playback
- Context API for state management

### Backend
- Node.js with Express
- Socket.IO for real-time communication
- MongoDB with Mongoose
- TypeScript
- Nodemon for development

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Setup

1. Clone the repository
```bash
git clone <repository-url>
cd streaming-room
```

2. Install dependencies
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../ui
npm install
```

3. Environment Setup
Create `.env` files in both server and ui directories:

Server (.env):
```
PORT=9998
MONGODB_URI=your_mongodb_uri
```

UI (.env):
```
REACT_APP_API_URL=http://localhost:9998
```

4. Start the application
```bash
# Start backend servers (in separate terminals)
cd server
# Start HTTP server
npm run start:http
# Start Socket server
npm run start:socket

# Start frontend (in a new terminal)
cd ui
npm start
```

## Project Structure

```
streaming-room/
├── server/
│   ├── src/
│   │   ├── db/           # Database models and operations
│   │   ├── socket/       # Socket.IO server implementation
│   │   ├── http/         # HTTP server implementation
│   │   └── routes/       # API routes
│   └── package.json
└── ui/
    ├── src/
    │   ├── components/   # Reusable components
    │   ├── contexts/     # React contexts
    │   ├── pages/        # Page components
    │   └── api/          # API integration
    └── package.json
```

## Socket Events

### Client to Server
- `joinRoom`: Join a streaming room
- `leaveRoom`: Leave a streaming room
- `play`: Start video playback
- `pause`: Pause video playback
- `seek`: Seek to a specific time
- `onProgress`: Update video progress

### Server to Client
- `play`: Trigger video playback
- `pause`: Trigger video pause
- `seek`: Update video position
- `onProgress`: Sync video progress

## Development

The backend is split into two servers:
1. HTTP Server: Handles REST API requests
2. Socket Server: Manages real-time video synchronization

Both servers need to be running simultaneously for the application to work properly.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

