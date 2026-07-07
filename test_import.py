import os
import sys

# Add backend directory to sys.path
sys.path.append(os.path.abspath('backend'))

# Setup django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()

try:
    from app.api.views import IsAdminUser
    print("Successfully imported IsAdminUser from app.api.views")
except ImportError as e:
    print(f"Import error: {e}")
except Exception as e:
    print(f"Other error: {e}")
