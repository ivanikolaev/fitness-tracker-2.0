# Fitness Tracker Application

A web application for planning and tracking fitness workouts with WCAG 2.1 AA compliance.

## Tech Stack

### Frontend
- Vite + React 18, TypeScript 5+
- State management: Redux Toolkit + RTK Query
- UI Kit: Gravity UI with fitness theme customization
- Forms: react-hook-form
- Accessibility: react-aria
- Routing: React Router 6
- Validation: Zod

### Backend
- Node.js 20+, Express.js 5, TypeScript 5+
- ORM: TypeORM 0.3+ with active records
- Database: PostgreSQL 15+
- Authentication: OAuth 2.0, JWT + refresh tokens
- Validation: Zod

## Setup Instructions

### Option 1: Using Docker (Recommended)

The easiest way to run the application is using Docker, which will set up the entire stack including PostgreSQL, backend, and frontend:

1. Make sure Docker and Docker Compose are installed on your system
2. Run the following command from the project root:
   ```
   docker-compose up -d
   ```
3. The application will be available at:
   - Frontend: http://localhost (port 80)
   - Backend API: http://localhost:3001
   - PostgreSQL: localhost:5432

The database will be automatically initialized with the schema and sample data.

### Option 2: Manual Setup

#### Database Setup

1. Install PostgreSQL 15+ on your system
2. Create a new database named `fitness_tracker`
3. Create a PostgreSQL user that matches the one in your backend/.env file
4. Run the SQL script to create tables and sample data:
   ```
   psql -U your_username -d fitness_tracker -f backend/db/schema.sql
   ```

#### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Update the database connection settings in `.env` file to match your PostgreSQL setup

4. Start the backend server:
   ```
   npm run dev
   ```

The backend server will run on http://localhost:3001

#### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the frontend development server:
   ```
   npm run dev
   ```

The frontend application will run on http://localhost:5173

## Authentication

The database is pre-populated with a test user:
- Email: john@example.com
- Password: password

## Features

1. User-friendly interface:
   - Intuitive drag-n-drop calendar for workout planning
   - Progress visualization with charts (weight, reps, sets)
   - Personalized recommendations based on history

2. WCAG compliance:
   - Full keyboard navigation
   - Semantic HTML markup
   - ARIA roles and attributes
   - High contrast (4.5:1+)
   - Screen reader support
   - Alternative text for media

3. Security:
   - Role-based access control (user/trainer/admin)
   - Protection against XSS/SQL injection
   - Rate limiting
   - HTTPS only

4. Containerization with Docker and docker-compose
