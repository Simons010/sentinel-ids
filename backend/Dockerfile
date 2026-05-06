
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies for mysqlclient
RUN apt-get update && apt-get install -y \
    netcat-openbsd \
    pkg-config \
    default-libmysqlclient-dev \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt
 
COPY backend/ .
COPY ml_engine/ ./ml_engine/

RUN chmod +x wait_for_db.sh

EXPOSE 8000

# Default to daphne for ASGI support (websockets)
CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "backend.asgi:application"]
