# TeleConsultation Platform

A real-time teleconsultation system enabling secure audio/video communication between doctors and patients using WebRTC with TURN/STUN support.

---

## Project Overview

This project is a full-stack real-time communication platform designed to solve NAT traversal and peer-to-peer connectivity issues in WebRTC using a TURN server (coturn).

It enables secure doctor-patient video/audio consultations using a signaling backend and is designed with scalability in mind using Redis and RabbitMQ (future-ready architecture).

---

## System Architecture

Client (Frontend - WebRTC)
        |
        |  WebSocket / HTTP (Signaling)
        |
Backend Server (Node.js / Express)
        |
        |  Session + ICE Candidate Exchange
        |
Redis (Session Cache Layer - Planned)
        |
RabbitMQ (Event Queue Layer - Planned)
        |
TURN/STUN Server (coturn)
        |
        |  Media Relay (fallback when P2P fails)
        |
Peer-to-Peer Connection (Doctor ↔ Patient)

---

## Tech Stack

### Frontend
- HTML / CSS / JavaScript (or React if extended)
- WebRTC APIs
- WebSocket / HTTP API

### Backend
- Node.js
- Express.js
- WebSocket (Signaling server)
- Session management

### Infrastructure
- coturn (TURN/STUN server)
- Redis (planned integration)
- RabbitMQ (planned integration)
- Linux (Ubuntu)
- systemd service management
- Networking (NAT traversal, ICE candidates)

---

## Features

- Real-time audio/video communication
- WebRTC peer-to-peer connection
- TURN server fallback for NAT/firewall traversal
- ICE candidate exchange via signaling server
- Session-based consultation flow
- Scalable backend-ready architecture

---

## Redis Usage (Planned / Design Level Integration)

Redis is intended for **real-time in-memory state management**:

### In this project architecture:
- Active room/session tracking (doctor-patient mapping)
- Online/offline user presence tracking
- Temporary storage of signaling data (ICE candidates, SDP offers/answers)
- Session timeout handling (auto cleanup for inactive calls)

### Example:
roomId → {
  doctorSocketId,
  patientSocketId,
  status: "active"
}

---

## RabbitMQ Usage (Planned / Event-Driven Architecture)

RabbitMQ is intended for **asynchronous event handling and scaling**:

### In this project architecture:
- WebRTC signaling message queue (offer/answer/candidate events)
- Appointment scheduling workflow processing
- Decoupling signaling server from processing logic
- Handling load in multi-server deployment
- Reliable message delivery in distributed systems

### Example Events:
- "CALL_INITIATED"
- "OFFER_CREATED"
- "ANSWER_RECEIVED"
- "ICE_CANDIDATE_EXCHANGED"

---

## TURN Server Configuration

External IP mapping:

external-ip=PUBLIC_IP/PRIVATE_IP

Example:

external-ip=152.56.255.126/10.152.113.85

Port:
- 3478 (UDP/TCP)

---

## Backend Setup

Install dependencies:
npm install

Run development server:
npx nodemon server.js

Run production server:
node server.js

---

## Frontend Setup

Option 1:
Open index.html directly in browser

Option 2:
Run local server:
npx live-server

---

## TURN Server Management

Check status:
sudo systemctl status coturn

Start:
sudo systemctl start coturn

Restart:
sudo systemctl restart coturn

Stop:
sudo systemctl stop coturn

Check port usage:
sudo ss -ulnp | grep 3478

Test TURN server:
turnutils_uclient -v -p 3478 -u testuser -w testpass -e 1.1.1.1 PUBLIC_IP

---

## Common Issues

### 1. Port already in use (3478)
Fix:
sudo pkill turnserver
sudo systemctl restart coturn

---

### 2. Interface binding error
Check network interfaces:
ip a

Ensure correct interface is configured in coturn.

---

### 3. ICE connection failure
Check:
- TURN credentials
- Firewall ports (3478 UDP/TCP)
- Public IP configuration
- WebRTC ICE server config

---

## Project Status

- Backend signaling server completed
- TURN server configured and running
- WebRTC peer connection working
- Redis integration designed (not implemented yet)
- RabbitMQ integration designed (not implemented yet)
- Frontend integration in progress

---

## Future Improvements

- React-based frontend UI
- JWT authentication system
- Appointment scheduling system
- Chat and file sharing support
- Redis integration for session management
- RabbitMQ for event-driven architecture
- Docker + Kubernetes deployment
- Load balancing and horizontal scaling

---

## Run on Any Machine

### System dependencies
sudo apt update
sudo apt install -y nodejs npm git curl

### Backend
cd backend
npm install
npx nodemon server.js

### Frontend
cd frontend
npx live-server

### TURN Server
sudo systemctl start coturn