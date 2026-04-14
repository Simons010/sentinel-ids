from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("settings_app", "0003_systemsetting_email_and_archive_fields"),
    ]

    operations = [
        migrations.CreateModel(
            name="IntegrationApiKey",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=120)),
                ("key_value", models.CharField(max_length=255, unique=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("revoked_at", models.DateTimeField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name="TeamMember",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=120)),
                ("email", models.EmailField(max_length=254, unique=True)),
                ("role", models.CharField(choices=[("admin", "Admin"), ("analyst", "Analyst"), ("viewer", "Viewer")], default="viewer", max_length=20)),
                ("status", models.CharField(choices=[("active", "Active"), ("pending", "Pending")], default="pending", max_length=20)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
