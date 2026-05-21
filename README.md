# Sentinel-IDS: AI-Powered Intrusion Detection System

**Sentinel-IDS** is a comprehensive, full-stack security monitoring platform designed to detect, analyze, and visualize network threats in real-time. By combining rule-based signatures, machine learning anomaly detection, and Gemini AI semantic analysis, it provides a multi-layered defense for modern infrastructure.

## Key Features

- **3-Layer Detection Pipeline**:
  - **Rules Engine**: Instant signature-based detection for known attack patterns.
  - **ML Detector**: Random Forest model trained on UNSW-NB15 to catch statistical anomalies.
  - **AI Analyzer**: Gemini LLM performs semantic analysis on logs to provide natural language explanations.
- **Real-Time Dashboard**: High-performance React dashboard with live WebSocket feeds for instant threat visibility.
- **Advanced Visualizations**: Geographical attack maps, threat level indicators, and detailed network traffic charts.
- **Intelligent Log Ingestion**: Support for diverse log formats (JSON/CSV) with automatic normalization and enrichment.
- **Role-Based Access Control**: Secure Admin, Analyst, and Viewer roles with an automated approval workflow.
- **Automated Reporting**: Generate detailed threat summaries and performance reports in PDF/CSV formats.

## Architecture

- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Lucide Icons
- **Backend**: Django REST Framework, Django Channels (WebSockets)
- **Real-time**: Redis (Channel Layer for live broadcasts)
- **Database**: MySQL 8.0
- **AI/ML Engine**: Scikit-learn (Random Forest), Google Gemini Pro API
- **Infrastructure**: Docker & Docker Compose

## Getting Started

### Prerequisites

- Docker & Docker Compose
- Google Gemini API Key (for AI semantic analysis features)

### Installation & Setup

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/Simons010/sentinel-ids.git
   cd sentinel-ids
   ```

2. **Configure Environment**:
   Copy the example environment file and add your keys:

   ```bash
   cp .env.example .env
   # Edit .env to add your GEMINI_API_KEY and custom credentials
   ```

3. **Launch the System**:

   ```bash
   docker-compose up --build -d
   ```

   This orchestrates the full stack:
   - **MySQL**: Persistent storage for logs and alerts.
   - **Redis**: Real-time event bus for WebSockets.
   - **Backend**: Django API & ML Engine (Port 8000).
   - **Frontend**: React application (Port 5173).

### Access Points

- **Home Page**: [http://localhost:5173](http://localhost:5173)
- **Security Dashboard**: [http://localhost:5173/dashboard](http://localhost:5173/dashboard)
- **API Documentation**: [http://localhost:8000/api/](http://localhost:8000/api/)
- **Django Admin**: [http://localhost:8000/admin/](http://localhost:8000/admin/)

## Usage

### Default Credentials

If not overridden in your `.env`, the system initializes with:

- **Username**: `d3fau1t`
- **Password**: `d3fau1t_Password!2026`

### Log Ingestion

Send structured network logs to the ingestion endpoint:
Example:

```bash
POST /api/ingest/
Content-Type: application/json
{
    "src_ip": "192.168.1.50",
    "dst_ip": "10.0.0.1",
    "protocol": "tcp",
    "message": "Potential SQL injection attempt detected in URI parameter"
}
```

### Mobile Support

Sentinel-IDS is fully responsive and features a dedicated mobile navigation bar and drawer for security monitoring on the go.

## Development

### Retraining the ML Model

To retrain the Random Forest model on the latest dataset:

```bash
docker-compose exec backend python ml_engine/models/train_initial.py
```

### Running Tests

```bash
docker-compose exec backend pytest
```

## License

This project is licensed under the MIT License
