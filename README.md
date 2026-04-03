# Sentinel-IDS

**Sentinel-IDS** is a full-stack AI-Assisted Intrusion Detection System that analyzes server and network logs in real-time.

## Features

- **Real-time Log Analysis**: Detects suspicious activities in server and network logs.
- **AI-Powered**: Uses Machine Learning (Random Forest, Isolation Forest) and Gemini (LLM) for advanced detection and explanation.
- **Dashboard**: React-based dashboard for real-time monitoring and alerts.
- **Scalable**: Dockerized architecture with Django backend and MySQL database.

## Architecture

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Django REST Framework
- **Database**: MySQL
- **ML Engine**: Scikit-learn, TensorFlow/Keras, Gemini API

## Getting Started

### Prerequisites

- Docker & Docker Compose
- Node.js & npm (optional, for local frontend dev)
- Python 3.10+ (optional, for local backend dev)

### Installation & Running

1. **Clone/Navigate to project**:

   ```bash
   cd sentinel-ids
   ```

2. **Start with Docker Compose**:

   ```bash
   docker-compose up --build
   ```

   This will start:
   - MySQL Database (Port 3306)
   - Django Backend (Port 8000)
   - React Frontend (Port 5173)

3. **Access the Application**:
   - **Dashboard**: [http://localhost:5173](http://localhost:5173)
   - **API Root**: [http://localhost:8000/api/](http://localhost:8000/api/)
   - **Admin Panel**: [http://localhost:8000/admin/](http://localhost:8000/admin/)

## Usage

- **Log Ingestion**: Send POST requests to `/api/ingest/`.
- **Anomalies**: View real-time alerts on the Dashboard.
- **ML Training**: The model is trained on startup or can be retrained using `python3 ml_engine/models/train_initial.py`.

## API Documentation

- `POST /api/ingest/`: Ingest log data (JSON).
- `GET /api/alerts/`: Get list of security alerts.
- `GET /api/dashboard/stats/`: Get aggregated statistics.
