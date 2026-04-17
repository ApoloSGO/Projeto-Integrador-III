from django.db.models import Count, Q
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import ChangelogItem, Project, Version
from .serializers import ChangelogItemSerializer, ProjectSerializer, VersionSerializer


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.prefetch_related("versions__changelog").all().order_by("-created_at")
    serializer_class = ProjectSerializer


class VersionViewSet(viewsets.ModelViewSet):
    queryset = Version.objects.select_related("project").all()
    serializer_class = VersionSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        project_id = self.request.query_params.get("project")
        status_filter = self.request.query_params.get("status")
        if project_id:
            queryset = queryset.filter(project_id=project_id)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        return queryset


class ChangelogItemViewSet(viewsets.ModelViewSet):
    queryset = ChangelogItem.objects.select_related("version").all()
    serializer_class = ChangelogItemSerializer


@api_view(["GET"])
def dashboard_stats(_request):
    from apps.feedback.models import UserFeedback

    totals = Version.objects.aggregate(
        total_versions=Count("id"),
        released_versions=Count("id", filter=Q(status="released")),
    )
    total_versions = totals["total_versions"] or 0
    released_versions = totals["released_versions"] or 0

    return Response(
        {
            "total_projects": Project.objects.count(),
            "total_versions": total_versions,
            "released_versions": released_versions,
            "pending_versions": total_versions - released_versions,
            "total_feedbacks": UserFeedback.objects.count(),
        }
    )
