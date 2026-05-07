#!/bin/sh

# Use DATABASE_HOST if provided, otherwise default to 'db'
DB_HOST=${DATABASE_HOST:-db}
DB_PORT=${DATABASE_PORT:-3306}

echo "Waiting for MySQL at $DB_HOST:$DB_PORT..."
while ! nc -z $DB_HOST $DB_PORT; do
  sleep 1
done

echo "MySQL is up!"
python manage.py migrate
python manage.py create_default_admin

# Check if we should run dev server or daphne
if [ "$DEBUG" = "True" ]; then
    echo "Starting Development Server..."
    python manage.py runserver 0.0.0.0:8000
else
    echo "Starting ASGI Server (Daphne)..."
    daphne -b 0.0.0.0 -p 8000 backend.asgi:application
fi
 