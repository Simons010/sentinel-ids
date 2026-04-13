# Sentinel-IDS Frontend

This is the frontend for Sentinel-IDS, a modern intrusion detection system. The frontend is built with React (Vite) and communicates with the Django REST backend.

## Features

- Real-time alerts and threat intelligence dashboard
- Paginated, searchable alerts table
- AI/ML-powered threat analysis and summaries
- Visualizations: threat levels, top vectors, charts
- Responsive, dark-themed UI

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm (v9+ recommended)

### Install dependencies

```bash
cd frontend
npm install
```

### Start the development server

```bash
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173) by default.

### Build for production

```bash
npm run build
```

### Lint and format

```bash
npm run lint
```

## Project Structure

- `src/app/components/` — React UI components (tables, charts, panels)
- `src/app/pages/` — Main pages (Dashboard, Threats, Analytics, etc.)
- `src/app/hooks/` — Custom React hooks for API/data
- `src/api/` — Axios API wrappers
- `src/styles/` — Tailwind and custom CSS

## API Integration

- The frontend expects the backend API to be available at `/api/` (proxy is set in Vite config for dev)
- Alerts and stats are fetched from endpoints like `/api/alerts/`, `/api/threats/`
- Pagination and page size are dynamically fetched from the backend

## Environment Variables

- See `.env.example` for available options (API base URL, etc.)

## Development Tips

- Edit UI in `src/app/components/` and `src/app/pages/`
- Update API logic in `src/api/` and hooks in `src/app/hooks/`
- For backend changes, see the main project README

## License

MIT
