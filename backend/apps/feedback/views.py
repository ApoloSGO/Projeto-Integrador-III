from rest_framework import viewsets

from .models import UserFeedback
from .serializers import UserFeedbackSerializer


class UserFeedbackViewSet(viewsets.ModelViewSet):
    queryset = UserFeedback.objects.select_related("project", "related_version").all()
    serializer_class = UserFeedbackSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        project_id = self.request.query_params.get("project")
        related_version_id = self.request.query_params.get("related_version")
        status_filter = self.request.query_params.get("status")
        if project_id:
            queryset = queryset.filter(project_id=project_id)
        if related_version_id:
            queryset = queryset.filter(related_version_id=related_version_id)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        return queryset
