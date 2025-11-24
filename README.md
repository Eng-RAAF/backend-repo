# Class Management System

A full-stack class management system with Node.js/Express backend and React frontend. The backend uses Prisma ORM with PostgreSQL database, and the frontend is built with React, JavaScript, and Tailwind CSS.

## Features

- **Students Management**: Create, read, update, and delete students
- **Classes Management**: Create, read, update, and delete classes
- **Teachers Management**: Create, read, update, and delete teachers
- **Enrollments**: Enroll students in classes and manage enrollments

## Installation

### Backend Setup

1. Install backend dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```
DATABASE_URL="postgresql://user:password@localhost:5432/classmanagement"
```

3. Set up the database:
```bash
# Generate Prisma Client
npm run prisma:generate

# Create database and run migrations
npm run prisma:migrate
```

4. (Optional) Open Prisma Studio to view/edit data:
```bash
npm run prisma:studio
```

5. Start the backend server:
```bash
npm start
```

The backend server will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install frontend dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

### Running Both (Development)

Open two terminal windows:

**Terminal 1 (Backend):**
```bash
npm start
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

## API Endpoints

### Students

- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get student by ID
- `POST /api/students` - Create a new student
- `PUT /api/students/:id` - Update a student
- `DELETE /api/students/:id` - Delete a student

**Create Student Example:**
```json
POST /api/students
{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 20,
  "grade": "A"
}
```

### Classes

- `GET /api/classes` - Get all classes
- `GET /api/classes/:id` - Get class by ID
- `POST /api/classes` - Create a new class
- `PUT /api/classes/:id` - Update a class
- `DELETE /api/classes/:id` - Delete a class

**Create Class Example:**
```json
POST /api/classes
{
  "name": "Mathematics 101",
  "code": "MATH101",
  "description": "Introduction to Mathematics",
  "teacherId": 1,
  "schedule": "Mon, Wed, Fri 10:00 AM",
  "capacity": 30
}
```

### Teachers

- `GET /api/teachers` - Get all teachers
- `GET /api/teachers/:id` - Get teacher by ID
- `POST /api/teachers` - Create a new teacher
- `PUT /api/teachers/:id` - Update a teacher
- `DELETE /api/teachers/:id` - Delete a teacher

**Create Teacher Example:**
```json
POST /api/teachers
{
  "name": "Dr. Jane Smith",
  "email": "jane@example.com",
  "subject": "Mathematics",
  "department": "Science"
}
```

### Enrollments

- `GET /api/enrollments` - Get all enrollments (with student and class details)
- `GET /api/enrollments/:id` - Get enrollment by ID
- `GET /api/enrollments/student/:studentId` - Get all enrollments for a student
- `GET /api/enrollments/class/:classId` - Get all enrollments for a class
- `POST /api/enrollments` - Enroll a student in a class
- `DELETE /api/enrollments/:id` - Delete enrollment by ID
- `DELETE /api/enrollments/student/:studentId/class/:classId` - Unenroll student from class

**Enroll Student Example:**
```json
POST /api/enrollments
{
  "studentId": 1,
  "classId": 1
}
```

## Project Structure

```
class-management-sys/
├── server.js              # Main server file
├── package.json           # Backend dependencies and scripts
├── prisma/
│   └── schema.prisma     # Prisma schema definition
├── lib/
│   └── prisma.js         # Prisma client instance
├── data/
│   └── storage.js        # Database operations using Prisma
├── routes/
│   ├── students.js       # Student routes
│   ├── classes.js        # Class routes
│   ├── teachers.js       # Teacher routes
│   └── enrollments.js    # Enrollment routes
├── frontend/              # React frontend application
│   ├── package.json      # Frontend dependencies
│   ├── vite.config.js   # Vite configuration
│   ├── tailwind.config.js # Tailwind CSS configuration
│   ├── index.html        # HTML entry point
│   └── src/
│       ├── main.jsx      # React entry point
│       ├── App.jsx       # Main App component with routing
│       ├── index.css    # Global styles with Tailwind
│       ├── components/  # Reusable components
│       │   └── Modal.jsx
│       ├── pages/       # Page components
│       │   ├── Dashboard.jsx
│       │   ├── Students.jsx
│       │   ├── Classes.jsx
│       │   ├── Teachers.jsx
│       │   └── Enrollments.jsx
│       └── services/    # API service layer
│           └── api.js
└── README.md             # This file
```

## Database

This system uses **Prisma ORM** with **PostgreSQL** database. Make sure you have PostgreSQL installed and running, then update the `DATABASE_URL` in your `.env` file.

### Database Schema

- **Student**: id, name, email (unique), age, grade, createdAt, updatedAt
- **Teacher**: id, name, email (unique), subject, department, createdAt, updatedAt
- **Class**: id, name, code (unique), description, teacherId, schedule, capacity, createdAt, updatedAt
- **Enrollment**: id, studentId, classId, enrolledAt (unique constraint on studentId + classId)

### Prisma Commands

- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Create and run database migrations
- `npm run prisma:studio` - Open Prisma Studio (database GUI)

## Example Usage

### 1. Create a Teacher
```bash
curl -X POST http://localhost:3000/api/teachers \
  -H "Content-Type: application/json" \
  -d '{"name":"Dr. Jane Smith","email":"jane@example.com","subject":"Mathematics","department":"Science"}'
```

### 2. Create a Class
```bash
curl -X POST http://localhost:3000/api/classes \
  -H "Content-Type: application/json" \
  -d '{"name":"Mathematics 101","code":"MATH101","description":"Introduction to Mathematics","teacherId":1,"schedule":"Mon, Wed, Fri 10:00 AM","capacity":30}'
```

### 3. Create a Student
```bash
curl -X POST http://localhost:3000/api/students \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","age":20,"grade":"A"}'
```

### 4. Enroll Student in Class
```bash
curl -X POST http://localhost:3000/api/enrollments \
  -H "Content-Type: application/json" \
  -d '{"studentId":1,"classId":1}'
```

### 5. Get All Enrollments
```bash
curl http://localhost:3000/api/enrollments
```

## Frontend Features

- **Modern UI**: Built with React and Tailwind CSS for a beautiful, responsive design
- **Dashboard**: Overview with statistics and quick actions
- **Students Management**: Full CRUD operations with modal forms
- **Classes Management**: Create and manage classes with teacher assignments
- **Teachers Management**: Manage teacher information
- **Enrollments**: Enroll students in classes with validation
- **Responsive Design**: Works on desktop and mobile devices

## Notes

- All IDs are auto-generated integers
- Data persists in PostgreSQL database
- Deleting a student or class will automatically remove related enrollments (cascade delete)
- Email addresses must be unique for students and teachers
- Class codes must be unique
- Students cannot be enrolled in the same class twice
- The API returns JSON responses
- CORS is enabled for cross-origin requests
- Both backend and frontend use ES modules
- Frontend uses Vite for fast development and building

