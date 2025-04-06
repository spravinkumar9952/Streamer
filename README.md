# Streaming Room

A real-time collaborative video streaming platform where users can watch videos together in synchronized rooms. Users can create rooms, invite friends, and enjoy synchronized video playback with real-time chat and interaction.

## Features

### Video Synchronization

-   Create and join streaming rooms
-   Real-time video synchronization across all users in a room
-   Play/pause synchronization
-   Seek position synchronization
-   Progress tracking
-   YouTube video support

### User Management

-   User authentication and authorization
-   Profile management
-   Friend system with friend requests
-   User search functionality
-   Online/offline status tracking

### Room Management

-   Create new streaming rooms
-   Join existing rooms
-   Leave rooms
-   Room information display
-   Viewer count tracking
-   Room duration tracking

## Tech Stack

### Frontend

-   React with TypeScript
-   Socket.IO Client for real-time communication
-   React Player for video playback
-   Context API for state management
-   Tailwind CSS for styling
-   Modern UI components with animations

### Backend

-   Node.js with Express
-   Socket.IO for real-time communication
-   MongoDB with Mongoose
-   TypeScript
-   Nodemon for development
-   Split server architecture (HTTP and Socket)

## Prerequisites

-   Node.js (v14 or higher)
-   MongoDB
-   npm or yarn

## Setup

1. Clone the repository

```bash
git clone <repository-url>
cd streaming-room
```

2. Install dependencies

```bash
# Install all dependencies (frontend, backend, and root)
npm run install:all
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
# Start all servers with a single command
npm start

# Or for development mode with hot reloading
npm run dev
```

The above command will start:

-   HTTP Server (port 9998)
-   Socket Server (port 9998)
-   Frontend Development Server (port 3000)

## Project Structure

```
streaming-room/
├── server/
│   ├── src/
│   │   ├── db/           # Database models and operations
│   │   │   ├── users.ts  # User management
│   │   │   └── rooms.ts  # Room management
│   │   ├── socket/       # Socket.IO server implementation
│   │   ├── http/         # HTTP server implementation
│   │   └── routes/       # API routes
│   └── package.json
└── ui/
    ├── src/
    │   ├── components/   # Reusable components
    │   │   ├── NavBar.tsx
    │   │   └── StreamingRoomListItem.tsx
    │   ├── contexts/     # React contexts
    │   │   └── Auth.tsx
    │   ├── pages/        # Page components
    │   │   ├── Home.tsx
    │   │   ├── Profile.tsx
    │   │   └── StreamingRoom.tsx
    │   └── api/          # API integration
    └── package.json
```

## Socket Events

### Client to Server

-   `joinRoom`: Join a streaming room
    ```typescript
    socket.emit("joinRoom", roomId: string, email: string)
    ```
-   `leaveRoom`: Leave a streaming room
    ```typescript
    socket.emit("leaveRoom", roomId: string, email: string)
    ```
-   `play`: Start video playback
    ```typescript
    socket.emit("play", roomId: string, email: string)
    ```
-   `pause`: Pause video playback
    ```typescript
    socket.emit("pause", roomId: string, email: string)
    ```
-   `seek`: Seek to a specific time
    ```typescript
    socket.emit("seek", roomId: string, email: string, time: number)
    ```
-   `onProgress`: Update video progress
    ```typescript
    socket.emit("onProgress", roomId: string, email: string, time: number)
    ```

### Server to Client

-   `play`: Trigger video playback
-   `pause`: Trigger video pause
-   `seek`: Update video position
-   `onProgress`: Sync video progress

## User Features

### Authentication

-   User registration
-   User login
-   Session management
-   Protected routes

### Profile Management

-   View and edit profile information
-   Update YouTube URL
-   Profile picture support
-   Online status indicator

### Friend System

-   Send friend requests
-   Accept/reject friend requests
-   View friends list
-   Search for users
-   Friend status indicators

## Development

The backend is split into two servers:

1. HTTP Server: Handles REST API requests
    - User authentication
    - Profile management
    - Friend system
    - Room management
2. Socket Server: Manages real-time video synchronization
    - Video playback control
    - Progress synchronization
    - Room state management

Both servers need to be running simultaneously for the application to work properly.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
