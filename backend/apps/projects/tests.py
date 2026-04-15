from rest_framework.test import APITestCase


class VersionTrackApiTests(APITestCase):
    def test_project_version_feedback_flow(self):
        project_resp = self.client.post(
            "/api/projects/",
            {
                "name": "VersionTrack Web",
                "description": "Painel principal",
                "repository_url": "https://github.com/exemplo/versiontrack",
            },
            format="json",
        )
        self.assertEqual(project_resp.status_code, 201)
        project_id = project_resp.data["id"]

        version_resp = self.client.post(
            "/api/versions/",
            {
                "project": project_id,
                "tag": "v1.0.0",
                "title": "Primeira release",
                "summary": "Entrega inicial",
                "status": "released",
            },
            format="json",
        )
        self.assertEqual(version_resp.status_code, 201)
        version_id = version_resp.data["id"]

        changelog_resp = self.client.post(
            "/api/changelog-items/",
            {
                "version": version_id,
                "kind": "feature",
                "title": "Dashboard de versões",
                "description": "Adiciona cards com status das versões",
            },
            format="json",
        )
        self.assertEqual(changelog_resp.status_code, 201)

        stats_resp = self.client.get("/api/dashboard/stats/")
        self.assertEqual(stats_resp.status_code, 200)
        self.assertEqual(stats_resp.data["total_projects"], 1)
        self.assertEqual(stats_resp.data["released_versions"], 1)
