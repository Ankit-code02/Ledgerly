# Ledgerly

<p align="center">
  <strong>A modern full-stack personal finance management platform</strong>
</p>

<p align="center">
  Track income, manage expenses, organize transactions, and understand your financial activity from one clean dashboard.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Java-21-orange?style=flat-square" alt="Java 21"/>
  <img src="https://img.shields.io/badge/Spring%20Boot-4.x-brightgreen?style=flat-square" alt="Spring Boot"/>
  <img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square" alt="Next.js"/>
  <img src="https://img.shields.io/badge/TypeScript-blue?style=flat-square" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/PostgreSQL-17-blue?style=flat-square" alt="PostgreSQL"/>
  <img src="https://img.shields.io/badge/JWT-Authentication-purple?style=flat-square" alt="JWT"/>
</p>

---

## Overview

**Ledgerly** is a full-stack personal finance management application designed to make everyday financial tracking simple, structured, and intuitive.

The application provides authenticated users with a centralized place to record income and expenses, organize transactions by category, review financial summaries, and monitor spending activity.

The project demonstrates end-to-end application development using a **Java/Spring Boot backend**, **PostgreSQL database**, and **Next.js/TypeScript frontend**, with JWT-based authentication and protected REST APIs.

---

## Key Features

### Authentication & Security

- User registration and login
- JWT-based authentication
- Protected REST APIs
- User-specific data access
- Password hashing with Spring Security
- Authentication-aware frontend routes

### Financial Dashboard

- Current balance
- Total income
- Total expenses
- Savings rate
- Spending breakdown by category
- Recent transaction activity
- Quick transaction actions

### Transaction Management

- Create income and expense transactions
- Edit existing transactions
- Delete transactions
- Categorize transactions
- Transaction date tracking
- Filter transactions by:
    - Income / Expense
    - Date range

### Category Management

- Create personal transaction categories
- View categories belonging to the authenticated user
- Associate transactions with categories

### Frontend Experience

- Responsive design
- Desktop and mobile navigation
- Clean financial dashboard
- Loading and empty states
- Form validation and error handling
- Consistent premium visual system
- Editorial-inspired interface instead of a generic dashboard aesthetic

---

## Technology Stack

| Layer | Technology |
|---|---|
| Language | Java 21 |
| Backend | Spring Boot |
| API | REST |
| Security | Spring Security + JWT |
| Persistence | Spring Data JPA / Hibernate |
| Database | PostgreSQL |
| Build Tool | Maven |
| Frontend | Next.js 16 |
| UI | React + TypeScript |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Version Control | Git + GitHub |
| Development | IntelliJ IDEA |
| Containerization | Docker-ready |

---

## Architecture

```text
                    ┌─────────────────────┐
                    │     Next.js App     │
                    │ React + TypeScript  │
                    └──────────┬──────────┘
                               │
                          REST / JSON
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Spring Boot API   │
                    │                     │
                    │ Controllers         │
                    │       ↓             │
                    │ Services            │
                    │       ↓             │
                    │ Repositories        │
                    │       ↓             │
                    │ JPA / Hibernate     │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │     PostgreSQL      │
                    │                     │
                    │ Users               │
                    │ Categories          │
                    │ Transactions        │
                    └─────────────────────┘
```

---

## Backend Architecture

The backend follows a layered Spring Boot architecture:

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
PostgreSQL
```

### Controllers

Responsible for handling HTTP requests and returning API responses.

### Services

Contain application and business logic.

### Repositories

Use Spring Data JPA for database access.

### Security

Spring Security and JWT are used to authenticate requests and protect application resources.

---

## Authentication Flow

```text
┌──────────┐
│   User   │
└────┬─────┘
     │ Login
     ▼
┌──────────────────┐
│ Spring Boot API  │
└────┬─────────────┘
     │ Validate credentials
     ▼
┌──────────────────┐
│    JWT Token     │
└────┬─────────────┘
     │ Bearer Token
     ▼
┌──────────────────┐
│ Protected APIs   │
└────┬─────────────┘
     │
     ▼
Authenticated User
```

Protected requests send:

```http
Authorization: Bearer <JWT_TOKEN>
```

The backend resolves the authenticated user's identity and restricts financial records to that user.

---

## Database Model

The core domain consists of three main entities:

```text
User
 │
 ├───────────────┐
 │               │
 ▼               ▼
Category      Transaction
                  │
                  ▼
               Category
```

### User

Stores authenticated user information.

### Category

Stores categories owned by a user.

### Transaction

Stores:

- Amount
- Transaction type
- Description
- Transaction date
- User
- Category
- Timestamps

---

## REST API

### Authentication

| Method | Endpoint | Access |
|---|---|---|
| `POST` | `/api/users` | Public |
| `POST` | `/api/users/login` | Public |
| `GET` | `/api/users/me` | Authenticated |

### Categories

| Method | Endpoint | Access |
|---|---|---|
| `POST` | `/api/categories` | Authenticated |
| `GET` | `/api/categories` | Authenticated |

### Transactions

| Method | Endpoint | Access |
|---|---|---|
| `POST` | `/api/transactions` | Authenticated |
| `GET` | `/api/transactions` | Authenticated |
| `GET` | `/api/transactions/{id}` | Authenticated |
| `PUT` | `/api/transactions/{id}` | Authenticated |
| `DELETE` | `/api/transactions/{id}` | Authenticated |

Transaction listing supports optional filtering by transaction type and date range.

### Dashboard

| Method | Endpoint | Access |
|---|---|---|
| `GET` | `/api/dashboard` | Authenticated |

---

## Project Structure

```text
Ledgerly/
│
├── ledgerly-backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/com/ledgerly/backend/
│   │       │   ├── config/
│   │       │   ├── controller/
│   │       │   ├── dto/
│   │       │   ├── entity/
│   │       │   ├── exception/
│   │       │   ├── repository/
│   │       │   ├── security/
│   │       │   └── service/
│   │       └── resources/
│   │           └── application.properties
│   └── pom.xml
│
├── ledgerly-frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   └── lib/
│   ├── public/
│   ├── package.json
│   └── tsconfig.json
│
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites

Install the following before running Ledgerly locally:

- Java 21+
- Maven 3.9+
- Node.js
- npm
- PostgreSQL 17+
- Git

---

### 1. Clone the Repository

```bash
git clone https://github.com/Ankit-code02/Ledgerly.git
cd Ledgerly
```

---

### 2. Create the PostgreSQL Database

Create a local database named:

```sql
CREATE DATABASE ledgerly;
```

Configure your own PostgreSQL username and password in:

```text
ledgerly-backend/src/main/resources/application.properties
```

**Never commit real database passwords, JWT secrets, API keys, or other credentials.**

---

### 3. Start the Backend

```bash
cd ledgerly-backend
mvn spring-boot:run
```

The backend starts on:

```text
http://localhost:8080
```

---

### 4. Configure the Frontend

Create:

```text
ledgerly-frontend/.env.local
```

Add:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

---

### 5. Install Frontend Dependencies

```bash
cd ledgerly-frontend
npm install
```

---

### 6. Start the Frontend

```bash
npm run dev
```

The frontend starts on:

```text
http://localhost:3000
```

---

## Build & Verification

### Backend

```bash
cd ledgerly-backend
mvn clean package
```

### Frontend Lint

```bash
cd ledgerly-frontend
npm run lint
```

### Frontend Production Build

```bash
npm run build
```

---

## Environment Configuration

### Frontend

Local development:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

For production, replace the value with the deployed backend URL.

### Backend

Database and security configuration should be supplied through environment variables or secure hosting configuration in production.

Do not commit:

```text
.env
.env.local
database passwords
JWT secrets
API keys
```

---

## Design Direction

Ledgerly uses a deliberately restrained visual language.

### Visual System

- Warm ivory / parchment backgrounds
- Graphite typography
- Muted terracotta accents
- Warm stone neutrals
- Strong typographic hierarchy
- Minimal borders
- Editorial-inspired layouts
- Responsive components
- Subtle interactions

The goal is to create a financial application that feels **calm, focused, professional, and distinctive** rather than looking like another generic SaaS dashboard.

---

## Engineering Highlights

This project demonstrates practical full-stack engineering across:

- REST API design
- JWT authentication
- Spring Security
- Layered backend architecture
- JPA entity relationships
- PostgreSQL persistence
- Request validation
- User-specific authorization
- Transaction filtering
- Dashboard aggregation queries
- Next.js App Router
- TypeScript component architecture
- Responsive UI development
- Frontend/backend API integration
- Production-oriented project structure
- Git-based version control

---

## Future Roadmap

Potential future enhancements include:

- Monthly budgets
- Recurring transactions
- Financial reports
- CSV/PDF export
- Advanced analytics
- Monthly spending trends
- Budget alerts
- Notification system
- Automated test coverage
- CI/CD pipeline
- Cloud deployment
- AI-powered financial insights

---

## Author

### Ankit Maurya

**Java Backend / Full-Stack Developer**

Interested in building reliable backend systems, full-stack applications, and production-oriented software using Java, Spring Boot, modern frontend technologies, cloud platforms, and AI.

**GitHub:**  
https://github.com/Ankit-code02

**LinkedIn:**  
https://www.linkedin.com/in/ankit0209/

**Portfolio:**  
https://ankit-portfolio-two-brown.vercel.app

---

## License

This project is currently maintained as a personal portfolio and learning project.
