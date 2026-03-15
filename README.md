# Buckeye Marketplace

A full-stack e-commerce application for browsing and purchasing products.

## Tech Stack

| Layer    | Technology                                   |
| -------- | -------------------------------------------- |
| Frontend | React 19, TypeScript, Vite 8, React Router 7 |
| Backend  | ASP.NET Core (.NET 10), C# 14                |
| ORM      | Entity Framework Core (SQLite)               |
| API Docs | Swagger / OpenAPI                            |

## Project Structure

```
sp-26-cartworkshop/
├── frontend/          # React + TypeScript SPA
│   └── src/
│       ├── api/           # API service functions
│       ├── components/    # Reusable UI components (CSS Modules)
│       ├── context/       # React Context providers (CartContext)
│       ├── pages/         # Route-level page components
│       ├── reducers/      # useReducer state logic
│       └── types/         # TypeScript interfaces and types
├── backend/           # .NET Web API
│   ├── Controllers/       # API controllers (attribute routing)
│   ├── Data/              # EF Core DbContext and seed data
│   ├── DTOs/              # Request/response records
│   ├── Middleware/         # Global exception handling
│   └── Models/            # EF Core entity classes
└── docs/              # API specs and documentation
```

## Frontend

The frontend is a React single-page application scaffolded with Vite.

**Key features:**

- Product catalog with category filtering and price range controls
- Product detail pages via dynamic routing (`/products/:id`)
- Shopping cart with context-based state management (`useReducer` + Context API)
- CSS Modules for component-scoped styling
- API proxy configured in Vite — all `/api` requests forward to the backend

**Routes:**

| Path            | Page           |
| --------------- | -------------- |
| `/`             | Product list   |
| `/products/:id` | Product detail |

### Running the Frontend

```bash
cd frontend
npm install
npm run dev
```

The dev server starts at **http://localhost:5173**. API calls are proxied to the backend at `http://localhost:5228`.

### Available Scripts

| Command           | Description                  |
| ----------------- | ---------------------------- |
| `npm run dev`     | Start the dev server         |
| `npm run build`   | Type-check and build         |
| `npm run lint`    | Run ESLint                   |
| `npm run preview` | Preview the production build |

## Backend

The backend is an ASP.NET Core Web API using controller-based routing.

**Key features:**

- RESTful product endpoints with filtering by category and price range
- Entity Framework Core with SQLite database (`marketplace.db`)
- Seed data auto-created on startup via `EnsureCreated()`
- Global exception handling with ProblemDetails responses
- CORS configured to allow the React dev server
- Swagger UI available in development mode

### API Endpoints

| Method | Route               | Description                                                                |
| ------ | ------------------- | -------------------------------------------------------------------------- |
| GET    | `/api/products`     | List products (optional query filters: `category`, `minPrice`, `maxPrice`) |
| GET    | `/api/products/:id` | Get a single product by ID                                                 |

### Running the Backend

```bash
cd backend
dotnet run
```

The API starts at **http://localhost:5228**. Swagger UI is available at `http://localhost:5228/swagger` in development mode.

## Running the Full Application

1. Start the backend:

   ```bash
   cd backend
   dotnet run
   ```

2. In a separate terminal, start the frontend:

   ```bash
   cd frontend
   npm install   # first time only
   npm run dev
   ```

3. Open **http://localhost:5173** in your browser.

## Git Workflow: Pulling Latest Changes and Rebasing

When working on a feature branch, regularly pull the latest changes from `main` and rebase your work on top to keep a clean history.

### 1. Fetch the latest changes from the remote

```bash
git fetch origin
```

### 2. Switch to your feature branch (if not already on it)

```bash
git checkout your-feature-branch
```

### 3. Rebase your feature branch onto the latest main

```bash
git rebase origin/main
```

This replays your feature branch commits on top of the latest `main`.

### 4. Resolve conflicts (if any)

If Git reports conflicts during the rebase:

1. Open the conflicting files and resolve the merge markers (`<<<<<<<`, `=======`, `>>>>>>>`)
2. Stage the resolved files:
   ```bash
   git add <resolved-file>
   ```
3. Continue the rebase:
   ```bash
   git rebase --continue
   ```
4. If you need to abort and start over:
   ```bash
   git rebase --abort
   ```

### 5. Push your updated branch

Since rebase rewrites commit history, you need to force-push:

```bash
git push --force-with-lease
```

> **Note:** Use `--force-with-lease` instead of `--force` — it prevents overwriting commits pushed by someone else.

### Quick Reference (all-in-one)

```bash
git fetch origin
git checkout your-feature-branch
git rebase origin/main
# resolve any conflicts, then:
git push --force-with-lease
```
