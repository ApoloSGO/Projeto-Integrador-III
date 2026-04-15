from rest_framework import serializers

from .models import UserFeedback


class UserFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserFeedback
        fields = [
            "id",
            "project",
            "related_version",
            "user_name",
            "user_email",
            "feedback_type",
            "title",
            "message",
            "status",
            "created_at",
        ]
