from django.db import models

from apps.projects.models import Project, Version


class UserFeedback(models.Model):
    TYPE_CHOICES = [
        ("bug", "Bug"),
        ("suggestion", "Sugestão"),
        ("praise", "Elogio"),
    ]
    STATUS_CHOICES = [
        ("new", "Novo"),
        ("triaged", "Triado"),
        ("planned", "Planejado"),
        ("resolved", "Resolvido"),
        ("dismissed", "Descartado"),
    ]

    project = models.ForeignKey(Project, related_name="feedbacks", on_delete=models.CASCADE)
    related_version = models.ForeignKey(
        Version, related_name="feedbacks", on_delete=models.SET_NULL, null=True, blank=True
    )
    user_name = models.CharField(max_length=120)
    user_email = models.EmailField(blank=True)
    feedback_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default="suggestion")
    title = models.CharField(max_length=180)
    message = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="new")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.project.name}: {self.title}"
