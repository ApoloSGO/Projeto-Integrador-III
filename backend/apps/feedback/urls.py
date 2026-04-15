from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import UserFeedbackViewSet

router = DefaultRouter()
router.register(r"feedbacks", UserFeedbackViewSet, basename="feedback")

urlpatterns = [path("", include(router.urls))]
