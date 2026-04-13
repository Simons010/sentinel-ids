from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("reports", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="report",
            name="snapshot",
            field=models.JSONField(blank=True, default=dict),
        ),
    ]
