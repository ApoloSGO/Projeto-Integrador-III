from django.db import models


class Project(models.Model):
    name = models.CharField(max_length=120, unique=True)
    description = models.TextField(blank=True)
    repository_url = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Version(models.Model):
    STATUS_CHOICES = [
        ("planned", "Planejada"),
        ("in_progress", "Em andamento"),
        ("released", "Publicada"),
        ("archived", "Arquivada"),
    ]

    project = models.ForeignKey(Project, related_name="versions", on_delete=models.CASCADE)
    tag = models.CharField(max_length=20)
    title = models.CharField(max_length=160)
    summary = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="planned")
    release_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("project", "tag")
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.project.name} - {self.tag}"


class ChangelogItem(models.Model):
    KIND_CHOICES = [
        ("feature", "Nova funcionalidade"),
        ("fix", "Correção"),
        ("improvement", "Melhoria"),
        ("breaking", "Mudança quebrando compatibilidade"),
    ]

    version = models.ForeignKey(Version, related_name="changelog", on_delete=models.CASCADE)
    kind = models.CharField(max_length=20, choices=KIND_CHOICES, default="feature")
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)

    class Meta:
        ordering = ["id"]

    def __str__(self):
        return f"{self.version.tag}: {self.title}"
