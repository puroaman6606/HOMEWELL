# Copilot Instructions for introToMongoose

Welcome to the `introToMongoose` project! This document provides essential guidelines for AI coding agents to be productive in this codebase. Follow these instructions to understand the architecture, workflows, and conventions specific to this project.

## Project Overview

This project is a Node.js application that uses the Mongoose library to interact with MongoDB. It is structured as a Model-View-Controller (MVC) application, with the following key components:

- **Models**: Define the data schema and interact with the MongoDB database. Located in the `models/` directory.
- **Controllers**: Handle the business logic and interact with models. Found in the `controllers/` directory.
- **Routes**: Define the API endpoints and link them to the appropriate controllers. Stored in the `routes/` directory.
- **Views**: Contain EJS templates for rendering the frontend. Organized under the `views/` directory.
- **Public Assets**: Static files like CSS are located in the `public/` directory.

### Data Flow
1. **Frontend**: User interactions trigger requests to the server.
2. **Routes**: Requests are routed to the appropriate controller.
3. **Controllers**: Controllers process the request, interact with models, and prepare data.
4. **Models**: Models fetch or update data in MongoDB.
5. **Views**: Data is passed to EJS templates for rendering.

## Developer Workflows

### Running the Application
- Use `nodemon` for development to automatically restart the server on file changes.
- Start the application with:
  ```bash
  nodemon server.js
  ```

### Testing
- Currently, there are no explicit test scripts. Add tests under a `tests/` directory and use a testing framework like Mocha or Jest.

### Debugging
- Use `console.log` for debugging or integrate a debugger like `node inspect`.

## Project-Specific Conventions

### File Naming
- Controllers are suffixed with `Controller` (e.g., `hostController.js`).
- Routes are suffixed with `Router` (e.g., `hostRouter.js`).
- Views are organized by feature (e.g., `views/host/` for host-related templates).

### Error Handling
- Centralized error handling is implemented in `controllers/errors.js`.
- Use `try-catch` blocks in controllers to handle asynchronous errors.

### Database Integration
- Models use Mongoose schemas to define the structure of MongoDB collections.
- Example: `models/home.js` defines the schema for homes.

### Partial Views
- Shared EJS components (e.g., `header.ejs`, `head.ejs`) are stored in `views/partials/`.
- Include partials in templates using:
  ```ejs
  <%- include('partials/header') %>
  ```

## Key Files and Directories
- `app.js`: Entry point of the application.
- `routes/`: Defines API endpoints.
- `controllers/`: Contains business logic.
- `models/`: Defines Mongoose schemas.
- `views/`: Contains EJS templates for rendering.
- `public/`: Static assets like CSS.

## External Dependencies
- **Mongoose**: For MongoDB integration.
- **Nodemon**: For development server auto-restart.

## Examples

### Adding a New Route
1. Create a new controller in `controllers/`.
2. Define the route in `routes/` and link it to the controller.
3. Example:
   ```javascript
   // In routes/exampleRouter.js
   const express = require('express');
   const { exampleController } = require('../controllers/exampleController');
   const router = express.Router();

   router.get('/example', exampleController);

   module.exports = router;
   ```

### Adding a New Model
1. Define the schema in `models/`.
2. Example:
   ```javascript
   const mongoose = require('mongoose');

   const exampleSchema = new mongoose.Schema({
     name: String,
     createdAt: { type: Date, default: Date.now },
   });

   module.exports = mongoose.model('Example', exampleSchema);
   ```

---

For any unclear or incomplete sections, please provide feedback to improve this document.