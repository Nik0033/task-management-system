# Task Management System

A modern, full-stack Task Management application built with **Angular**, **Node.js**, **Express**, and **MySQL**. It features a sleek "Aura" UI with dark mode, glassmorphism, and responsive design.

## Features

- **User Authentication**: Secure Login and Registration with JWT.
- **Task Management**: Create, Read, Update, and Delete tasks.
- **Dashboard**: Real-time summary statistics and task filtering.
- **Modern UI**: Dark theme, smooth animations, and responsive layout.

## Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [MySQL](https://www.mysql.com/)

---

## 1. Database Setup

1.  Open your MySQL Client (Workbench, Command Line, etc.).
2.  Create a database named `task_management_db`.
3.  Run the following SQL script to create the tables:

```sql
CREATE DATABASE IF NOT EXISTS task_management_db;
USE task_management_db;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tasks Table
CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('Pending', 'In Progress', 'Completed') DEFAULT 'Pending',
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## 2. Backend Setup

1.  Navigate to the `backend` folder:
    ```bash
    cd backend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**:
    Create a file named `.env` in the `backend` directory and add your configuration:

    ```env
    PORT=3000
    
    # Database Configuration
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=your_mysql_password
    DB_NAME=task_management_db
    DB_CONNECTION_LIMIT=10
    
    # Security
    JWT_SECRET=your_super_secret_jwt_key
    ```

4.  Start the server:
    ```bash
    npm start
    ```
    The backend will run on `http://localhost:3000`.

---

## 3. Frontend Setup

1.  Navigate to the `frontend` folder:
    ```bash
    cd frontend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the Angular application:
    ```bash
    npm start
    ```
    The application will open at `http://localhost:4200`.

---

## Tech Stack

-   **Frontend**: Angular 19+ (Standalone Components), Angular Material (Aura Theme).
-   **Backend**: Node.js, Express.js.
-   **Database**: MySQL.
-   **Authentication**: JSON Web Tokens (JWT).
-   **Styling**: CSS Variables, Glassmorphism, Responsive Grid.