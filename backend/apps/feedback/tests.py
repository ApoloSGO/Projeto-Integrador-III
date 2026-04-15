from backend.apps.projects.models import Project
from rest_framework.test import APITestCase


class FeedbackApiTests(APITestCase):
    def test_create_feedback(self):
        project = Project.objects.create(name="Mobile App")
        response = self.client.post(
            "/api/feedbacks/",
            {
                "project": project.id,
                "user_name": "João",
                "user_email": "joao@email.com",
                "feedback_type": "suggestion",
                "title": "Melhorar filtro",
                "message": "Seria bom filtrar por tipo de mudança.",
                "status": "new",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["feedback_type"], "suggestion")
