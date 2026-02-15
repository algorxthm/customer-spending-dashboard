# Customer Spending Insights Dashboard

Production-grade financial analytics dashboard built with React (Vite), Tailwind CSS, Recharts, and React Query. Includes filtering, pagination, interactive charts, and a mock Express API backend.

## Tech Stack
### Frontend
- React + Vite
- Tailwind CSS
- Recharts
- React Query
- Express (Mock API)
- TanStack React Query

### Backend
- Node.js
- Express (Mock API)

### Dev Tooling
- Concurrently
- Nodemon
- Docker

## API Endpoints (Mock)
- GET /api/customers/:customerId/profile
- GET /api/customers/:customerId/spending/summary
- GET /api/customers/:customerId/spending/categories
- GET /api/customers/:customerId/spending/trends
- GET /api/customers/:customerId/transactions
- GET /api/customers/:customerId/goals

## Run Locally

### Install
npm install
cd server && npm install

### Run
npm run dev

## Run with Docker

docker build -t customer-spending-dashboard .
docker run -p 8080:4000 customer-spending-dashboard

## Production Notes
- Single Docker container serves:
- Express API
- Static built frontend
- Vite proxy used in development
- React Query handles caching & refetch logic
- Code structured by feature domain for scalability


 