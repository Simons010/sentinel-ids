from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("settings_app", "0002_rename_systemsettings_systemsetting"),
    ]

    operations = [
        migrations.AddField(
            model_name="systemsetting",
            name="archive_location",
            field=models.CharField(default="/var/log/sentinel-ids/archives", max_length=255),
        ),
        migrations.AddField(
            model_name="systemsetting",
            name="smtp_password",
            field=models.CharField(blank=True, default="", max_length=255),
        ),
        migrations.AddField(
            model_name="systemsetting",
            name="smtp_port",
            field=models.IntegerField(default=587),
        ),
        migrations.AddField(
            model_name="systemsetting",
            name="smtp_server",
            field=models.CharField(blank=True, default="", max_length=255),
        ),
        migrations.AddField(
            model_name="systemsetting",
            name="smtp_username",
            field=models.CharField(blank=True, default="", max_length=255),
        ),
    ]
