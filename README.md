HRMS Employee Service - Backend
A microservice backend for the Employee Management System built with Node.js, PostgreSQL, and RabbitMQ.

Table of Contents
Prerequisites

Local Development Setup

Environment Configuration

Database Setup

Message Queue Setup

Running the Application

Docker Deployment

API Documentation

Troubleshooting

Prerequisites
Before you begin, ensure you have the following installed:

Node.js (version 20 or higher)

pnpm (package manager)

PostgreSQL (version 14 or higher)

Docker (optional, for containerized deployment)

Git

Local Development Setup
Clone the repository

```
git clone https://github.com/EHRMSBackend/hrms_employee_service.git
cd hrms_employee_service
```

Install dependencies

```
pnpm install
```
Set up environment variables (see next section)

Environment Configuration
Create a .env file in the root directory with the following variables:

Database Configuration
env
# Database URL (PostgreSQL)
DATABASE_URL=postgresql://username:password@host:port/database_name?sslmode=require&connection_limit=2&connect_timeout=300

# Alternative individual database variables (optional)
DB_HOST=your_database_host
DB_PORT=5432
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_SSL=true
Message Queue Configuration
env
# RabbitMQ URL
RABBITMQ_URL=amqps://username:password@host/virtual_host

# Alternative individual RabbitMQ variables (optional)
RABBITMQ_HOST=your_rabbitmq_host
RABBITMQ_PORT=5672
RABBITMQ_USERNAME=your_rabbitmq_username
RABBITMQ_PASSWORD=your_rabbitmq_password
RABBITMQ_VHOST=your_virtual_host
Application Configuration
env
# Server Configuration
NODE_ENV=development
PORT=4000

# JWT Configuration (if applicable)
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=info
Database Setup
Local PostgreSQL Setup
Install PostgreSQL on your local machine

Create a database for the application:

#
CREATE DATABASE hrms_employee_service;
CREATE USER employee_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE hrms_employee_service TO employee_user;
#
Update your .env file with local database credentials:

`
DATABASE_URL=postgresql://employee_user:secure_password@localhost:5432/hrms_employee_service
`
Cloud Database Setup (Render/Heroku/AWS)
Create a PostgreSQL instance on your cloud provider

Get the connection string from your cloud provider's dashboard

Update the .env file with the provided connection string

Message Queue Setup
Local RabbitMQ Setup
Install RabbitMQ locally or use Docker:

```
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:management
Default credentials: guest/guest
```

Update your .env file:

env
`
RABBITMQ_URL=amqp://guest:guest@localhost:5672/
Cloud RabbitMQ Setup (CloudAMQP)
Create a RabbitMQ instance on CloudAMQP or similar service
`

Get the connection URL from the cloud provider's dashboard

Update the .env file with the provided URL

Running the Application
# Install dependencies (if not already done)
Development Mode
```

pnpm install
```
## install prisma and prisma client
```
pnpm install prisma @prisma/client
```

## generate the prisma client
```
npx prisma generate
```
## Make and apply migrations

```
npx prisma migrate
```

## Start in development mode with hot reload
```
pnpm run start:dev
```
Production Mode
## Build the application
```
pnpm run build
```

## Start in production mode
```
pnpm run start:prod
```
Available Scripts
* pnpm run start:dev - Start development server

* pnpm run build - Build the application

* pnpm run start:prod - Start production server


Docker Deployment
Build the Docker Image
```
docker build -t hrms-employee-service .
```
Run the Container
```
docker run -d \
  --name employee-service \
  -p 4000:4000 \
  --env-file .env \
  hrms-employee-service
```