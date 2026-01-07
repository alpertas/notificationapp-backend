# Notification Center API

![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Firebase](https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase)
![SQLite](https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white)
![Swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white)

## Introduction

**Notification Center API** is a robust backend service designed to manage and deliver push notifications with high reliability. Built using **NestJS** and following strictly typed **Clean Architecture** principles, this API serves as the secure bridge between your client applications and **Firebase Cloud Messaging (FCM)**.

It ensures seamless user synchronization, secure authentication, and real-time message delivery, solving common consistency challenges in distributed systems.

## Key Features

-   **🛡️ Secure Endpoints:** Engineered with a custom `AuthGuard` that validates strictly typed Firebase ID Tokens. Unauthenticated access is rejected at the door.
-   **🔄 Defensive User Sync:** Implements a "fail-safe" synchronization strategy. If a notification is requested for a user who hasn't completed the initial handshake, the system automatically creates a placeholder user record, preventing Foreign Key (`P2003`) violations and ensuring the notification flow never breaks.
-   **🚀 FCM Push Notifications:** Integrated directly with the Firebase Admin SDK to provide low-latency, real-time push notifications to iOS and Android devices.
-   **📑 Interactive Documentation:** Fully documented with **OpenAPI (Swagger)**. Developers can explore schemas, DTOs, and test all endpoints directly from the browser without needing external tools like Postman.

## Tech Stack

-   **Framework:** [NestJS](https://nestjs.com/) (Node.js) - *Efficiency & Scalability*
-   **Language:** TypeScript - *Type Safety*
-   **Database:** SQLite3 - *Lightweight & Fast*
-   **ORM:** [Prisma Client](https://www.prisma.io/) - *Type-safe Database Access*
-   **Cloud Services:** Firebase Admin SDK - *Auth & Cloud Messaging*
-   **Documentation:** Swagger UI (`@nestjs/swagger`)

## Project Structure

The project follows a modular structure where each domain is encapsulated in its own module:

```bash
src/
├── app.module.ts              # Root application module
├── main.ts                    # Entry point & Global ValidationPipe
├── auth/                      # Authentication Domain
│   ├── dto/                   # Data Transfer Objects (SyncTokenDto)
│   ├── auth.guard.ts          # Firebase Bearer Token Guard
│   ├── auth.controller.ts     # User Sync Endpoints
│   └── auth.service.ts        # Business Logic
├── notification/              # Notification Domain
│   ├── dto/                   # CreateNotificationDto
│   ├── notification.controller.ts # API Endpoints (Send/Create)
│   └── notification.service.ts    # Logic & FCM Integration
├── firebase/                  # Shared Firebase Module
│   └── firebase.module.ts     # Admin SDK Configuration
└── prisma/                    # Database Module
    └── prisma.service.ts      # Connection Management
```

## Installation & Setup

Follow these steps to get the server running locally.

### 1. Clone the repository
```bash
git clone https://github.com/your-username/notification-center-api.git
cd notification-center-api
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory and configure the following variables:

```env
# Database connection string for SQLite
DATABASE_URL="file:./dev.db"

# Path to your Firebase Service Account JSON
GOOGLE_APPLICATION_CREDENTIALS="./service-account.json"

# Server Port
PORT=3000
```

> **Note:** You must download your `service-account.json` from the [Firebase Console](https://console.firebase.google.com/) (Project Settings > Service Accounts) and place it in the project root.

### 4. Database Migration
Initialize the SQLite database and generate the Prisma Client types:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Running the Application

**Development Mode:**
```bash
npm run start:dev
```

**Production Mode:**
```bash
npm run build
npm run start:prod
```

## API Documentation

Once the server is running, you can access the interactive Swagger documentation at:

👉 **http://localhost:3000/api**

### Available Endpoints

-   **POST** `/auth/sync-token`: Sync FCM token for a user.
-   **POST** `/notifications`: Create a notification in the database (Status: PENDING).
-   **POST** `/notifications/send`: Create and immediately trigger a Push Notification via FCM (Status: SENT).
-   **GET** `/notifications`: Retrieve notification history for the logged-in user.

---
*Designed with modularity and developer experience in mind.*
