import os
from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth.models import User
from app.users.models import UserProfile
from django.utils import timezone

class Command(BaseCommand):
    help = 'Creates a default superuser if it does not exist, using environment variables'

    def handle(self, *args, **options):
        username = os.environ.get('DJANGO_SUPERUSER_USERNAME')
        email = os.environ.get('DJANGO_SUPERUSER_EMAIL')
        password = os.environ.get('DJANGO_SUPERUSER_PASSWORD')

        if not username or not email or not password:
            raise CommandError(
                'You must set DJANGO_SUPERUSER_USERNAME, DJANGO_SUPERUSER_EMAIL, '
                'and DJANGO_SUPERUSER_PASSWORD environment variables.'
            )

        user = User.objects.filter(username=username).first()
        if not user:
            self.stdout.write(f'Creating default superuser {username}...')
            user = User.objects.create_superuser(
                username=username,
                email=email,
                password=password,
                first_name='Default',
                last_name='Admin'
            )
            self.stdout.write(self.style.SUCCESS(f'Successfully created default superuser {username}'))
        else:
            self.stdout.write(f'Superuser {username} already exists. Updating password and status...')
            user.set_password(password)
            user.is_superuser = True
            user.is_staff = True
            user.is_active = True
            user.save()
            self.stdout.write(self.style.SUCCESS(f'Successfully updated {username}'))
            
        # Ensure UserProfile exists for this user
        UserProfile.objects.update_or_create(
            user=user,
            defaults={
                'role': 'admin',
                'is_approved': True,
                'approved_at': timezone.now()
            }
        )
