from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import ChangelogItemViewSet, ProjectViewSet, VersionViewSet, dashboard_stats

router = DefaultRouter()
router.register(r"projects", ProjectViewSet, basename="project")
router.register(r"versions", VersionViewSet, basename="version")
router.register(r"changelog-items", ChangelogItemViewSet, basename="changelog-item")

urlpatterns = [
    path("", include(router.urls)),
    path("dashboard/stats/", dashboard_stats, name="dashboard-stats"),
]
