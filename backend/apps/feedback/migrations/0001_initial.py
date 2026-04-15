from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("projects", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="UserFeedback",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("user_name", models.CharField(max_length=120)),
                ("user_email", models.EmailField(blank=True, max_length=254)),
                (
                    "feedback_type",
                    models.CharField(
                        choices=[("bug", "Bug"), ("suggestion", "Sugestão"), ("praise", "Elogio")],
                        default="suggestion",
                        max_length=20,
                    ),
                ),
                ("title", models.CharField(max_length=180)),
                ("message", models.TextField()),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("new", "Novo"),
                            ("triaged", "Triado"),
                            ("planned", "Planejado"),
                            ("resolved", "Resolvido"),
                            ("dismissed", "Descartado"),
                        ],
                        default="new",
                        max_length=20,
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                (
                    "project",
                    models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="feedbacks", to="projects.project"),
                ),
                (
                    "related_version",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="feedbacks",
                        to="projects.version",
                    ),
                ),
            ],
            options={"ordering": ["-created_at"]},
        ),
    ]
