# E Commerce

An e-commerce platform where users can sign up or log in to easily add, edit, and manage their products.<br>
Get started here: https://e-commerce-app-frontend-ten.vercel.app/.

## Table of Contents

- [About the Project](#about-the-project)
- [Folder Structure](#folder-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
  - [Running the Frontend](#running-the-frontend)
  - [Running the Backend](#running-the-backend)

## About the Project

An intuitive e-commerce platform that allows users to manage their product listings effortlessly. After signing up or logging in, users can easily add new products, edit existing ones, and update details like price, description, and images. The platform ensures a smooth user experience, making it easy to keep your online store up-to-date and organized.

## Folder Structure

- `frontend/`: Contains the next.js files (client-side code).
- `backend/`: Contains the Node.js/Express server (server-side code).

## Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- npm (Node Package Manager)
- [Git](https://git-scm.com/)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/AayushJaiswal01/E-commerce-app.git
   cd E-commerce-app
   ```

2. **Install dependencies for the frontend:**

   ```bash
   cd frontend
   npm install
   ```

3. **Install dependencies for the backend:**
   ```bash
   cd ../backend
   npm install
   ```

## Usage

### Running the Frontend

1. Navigate to the `frontend` directory:

   ```bash
   cd ../frontend
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

### Running the Backend

1. Navigate to the `backend` directory:

   ```bash
   cd ../backend
   ```

2.⁠ ⁠Generate Prisma Client

    ```bash
    npx prisma generate dev
    ```

3. Start the server:
   ```bash
   node server.js
   ```

Backend program is deployed on render, and the frontend is deployed on vercel

## Environment Variables

These environment variables are used in backend

DATABASE_URL="postgresql://neondb_owner:Jg5TcpkIKb9R@ep-polished-sun-a8rl04o4.eastus2.azure.neon.tech/neondb?sslmode=require"

JWT_SECRET="12345678"

CLOUDINARY_CLOUD_NAME="djh4kobdl"

CLOUDINARY_API_KEY="841658719764277"

CLOUDINARY_API_SECRET="wzUjki8FzzY58g0_ZdvJCkVXAt0"

### Hosting

Frontend - Hosted on vercel --link(https://e-commerce-app-frontend-ten.vercel.app)

Backend -Hosted on render --link(https://e-commerce-app-g2yu.onrender.com/)

<img width="1440" alt="Screenshot 2024-10-26 at 6 51 03 PM" src="https://github.com/user-attachments/assets/548e2340-6a6c-4341-8b9c-5c0e30c245ea">
<img width="1440" alt="Screenshot 2024-10-26 at 6 51 11 PM" src="https://github.com/user-attachments/assets/329ef653-2025-4679-85a0-d19d9c96b9ed">
![Uploading Screenshot 2024-10-26 at 6.51.13 PM.png…]()
