<!-- @format -->

# NestJS CRUD API with Prisma & PostgreSQL

A RESTful API built with NestJS, Prisma ORM, and PostgreSQL database.
Access

Access this URL to use it immediately without installation.

https://code-challenge-7tyc.onrender.com/api/api-docs

## Prerequisites

- Node.js (v18+)
- PostgreSQL
- npm or yarn

## Tech Stack

- NestJS
- Prisma
- PostgreSQL
- Swagger
- TypeScript

## Setup & Installation

1. **Clone the repository**

```bash
cd src/problem5
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/problem5?schema=public"
PORT=3000
```

4. **Initialize Prisma and generate client**

```bash
npx prisma migrate dev
npx prisma generate
```

5. **Start the application**

Development mode:

```bash
npm run start:dev
```

## API Documentation

Once the application is running, you can access the Swagger documentation at:

```
http://localhost:3000/api/api-docs
```
