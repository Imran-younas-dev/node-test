# Node Test Application

This repository contains a Node.js project for handling authentication, conversations, and messages. The project includes API endpoints for user authentication, managing conversations, and message operations.

## Getting Started

### Prerequisites

Ensure you have Node.js and npm (Node Package Manager) installed on your system. You can download and install them from [Node.js official website](https://nodejs.org/).

### Installation

Clone the repository and install the dependencies:

```bash
git clone https://yourrepositoryurl.git
cd node-test
npm install
```

### Environment Setup

Copy the `.env.example` file to create a `.env` file and update it with your local settings:

```bash
cp NODE_ENV=local
PORT=3001
MYSQL_DB_HOST=localhost
MYSQL_DB_USERNAME=root
MYSQL_DB_PASSWORD=
MYSQL_DB_NAME=
TOKEN_EXPIRATION_TIME=30
TOKEN_EXPIRATION_TIME_REMEMBER_ME=300
```


### Database Migrations

To set up your database schema, run the migrations:

```bash
npm run migrate
```

### Seeders

To populate your database with initial data, run the seeders:

```bash
npm run seed
```

### Running the Application

Start the server with:

```bash
npm run dev
```

## API Endpoints

The application supports various operations through its API endpoints grouped into categories:

### Authentication (`/api/auth`)

- **POST `/api/auth/login`** - Authenticate a user:
  ```json
  {
    "email": "robert@example.com",
    "password": "testing1234!"
  }
  ```

- **POST `/api/auth/logout`** - Log out the current user.
  - Requires token authentication.

- **POST `/api/auth/verify-code`** - Verify a user's authentication code:
  ```json
  {
    "email": "robert@example.com",
    "verificationCode": "563256"
  }
  ```

### Conversation (`/api/conversation`)

- **GET `/api/conversation/`** - Retrieve all conversations.
  - Query parameters: `keyword` (optional), requires token.

- **POST `/api/conversation/`** - Create a new conversation:
  ```json
  {
    "userId": 2
  }
  ```
  - Requires token authentication.

### Message (`/api/message`)

- **GET `/api/message/`** - Retrieve messages for a conversation.
  - Query parameters: `conversationId`, requires token.

- **POST `/api/message/`** - Post a new message:
  ```json
  {
    "conversationId": 1,
    "content": "i am deleting this messsage"
  }
  ```
  - Requires token authentication.

- **DELETE `/api/message/:id`** - Delete a message:
  - Query parameter: `deleteWith` (options: "everyone" or "me").
  - Requires token authentication.

## Tools and Libraries

This project uses the following tools and libraries:

- **Express**: Web application framework for Node.js.
- **Sequelize**: ORM for Node.js.
- **Sentry**: Error tracking and monitoring.
- **Socket.IO**: For real-time bidirectional event-based communication.
- **express-rate-limit**: Middleware for rate-limiting incoming requests.