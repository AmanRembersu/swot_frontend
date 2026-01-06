# SWOT Analysis Frontend

## Setup Instructions

1. **Install dependencies:**
```bash
cd frontend
pnpm install
```

2. **Start the development server:**
```bash
pnpm dev
```

3. **Make sure the backend is running:**
```bash
cd ../backend
pnpm dev
```

## Features

### Authentication
- **Register**: Create account with name, email, password, and age
- **Login**: Sign in with email and password
- **Auto-login**: Remembers user session in localStorage

### SWOT Analysis
- **Create/Update**: Add or modify your SWOT analysis
- **View**: See your existing SWOT data
- **Delete**: Remove your SWOT analysis
- **Real-time**: All changes are saved to the backend API

## API Integration

The frontend connects to the backend API at `http://localhost:4000/api`:

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /swot` - Create/update SWOT analysis
- `GET /swot` - Get user's SWOT analysis
- `PATCH /swot/:field` - Update specific SWOT field
- `DELETE /swot` - Delete SWOT analysis

## CORS Configuration

The backend already includes CORS middleware, so no additional configuration is needed.

## Usage

1. **Register/Login**: Start by creating an account or logging in
2. **Fill SWOT**: Enter your strengths, weaknesses, opportunities, and threats (one per line)
3. **Save**: Click "Save SWOT Analysis" to store your data
4. **Manage**: Use refresh, delete, or logout as needed

## Tech Stack

- React 19 + TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- shadcn/ui components
- Lucide React icons