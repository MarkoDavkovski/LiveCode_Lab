# LiveCode_Lab

- Real-Time Collaborative Code Playground

## Table of Contents

- [LiveCode_Lab](#livecode_lab)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Tech Stack](#tech-stack)
  - [Prerequisites](#prerequisites)
  - [WebSocket Events](#websocket-events)

## Features

- **Real-Time Collaboration**: Multiple users can edit code simultaneously.
- **Session Management**: Create, join, and manage coding sessions with unique tokens.
- **User Authentication**: Secure login and registration for users.
- **Code Execution**: Execute code and view results in real-time.

## Tech Stack

- **Frontend**: NextJs, TypeScript
- **Backend**: Node.js, TypeScript, Express
- **Database**: PostgreSQL
- **WebSocket**: Socket.IO for real-time communication
- **ORM**: TypeORM for database interactions

## Prerequisites

- Node.js
- PostgreSQL

## WebSocket Events

- The application supports the following WebSocket events:

- **USER_JOIN_EVENT**: Triggered when a new user joins the session.
- **CODE_CHANGE_EVENT**: Triggered when the code is changed in the editor (listening on keyboard input).
- **CODE_SUBMIT_EVENT**: Triggered when code is the save code button is clicked.
- **EXECUTE_CODE_EVENT**:Triggered when code is submitted for execution.
- **KICK_USER_EVENT**: Triggered to kick a user from the session.
- **LOCK_SESSION_EVENT**: Triggered to lock or unlock the session
