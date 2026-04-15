from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Project",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=120, unique=True)),
                ("description", models.TextField(blank=True)),
                ("repository_url", models.URLField(blank=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name="Version",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("tag", models.CharField(max_length=20)),
                ("title", models.CharField(max_length=160)),
                ("summary", models.TextField(blank=True)),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("planned", "Planejada"),
                            ("in_progress", "Em andamento"),
                            ("released", "Publicada"),
                            ("archived", "Arquivada"),
                        ],
                        default="planned",
                        max_length=20,
                    ),
                ),
                ("release_date", models.DateField(blank=True, null=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                (
                    "project",
                    models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="versions", to="projects.project"),
                ),
            ],
            options={"ordering": ["-created_at"], "unique_together": {("project", "tag")}},
        ),
        migrations.CreateModel(
            name="ChangelogItem",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                (
                    "kind",
                    models.CharField(
                        choices=[
                            ("feature", "Nova funcionalidade"),
                            ("fix", "Correção"),
                            ("improvement", "Melhoria"),
                            ("breaking", "Mudança quebrando compatibilidade"),
                        ],
                        default="feature",
                        max_length=20,
                    ),
                ),
                ("title", models.CharField(max_length=200)),
                ("description", models.TextField(blank=True)),
                (
                    "version",
                    models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="changelog", to="projects.version"),
                ),
            ],
            options={"ordering": ["id"]},
        ),
    ]
