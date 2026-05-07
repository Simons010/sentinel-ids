from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    ROLE_CHOICES = [
        ("admin",   "Admin"),
        ("analyst", "Analyst"),
        ("viewer",  "Viewer"),
    ]

    user        = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    role        = models.CharField(max_length=20, choices=ROLE_CHOICES, default="viewer")
    is_approved = models.BooleanField(default=False)
    approved_by = models.ForeignKey(
        User, on_delete=models.SET_NULL,
        null=True, blank=True, related_name="approved_users"
    )
    approved_at = models.DateTimeField(null=True, blank=True)
    avatar_initials = models.CharField(max_length=3, blank=True)

    def __str__(self):
        return f"{self.user.username} ({self.role})"