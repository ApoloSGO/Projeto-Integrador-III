from rest_framework import serializers

from .models import ChangelogItem, Project, Version


class ChangelogItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChangelogItem
        fields = ["id", "version", "kind", "title", "description"]


class VersionSerializer(serializers.ModelSerializer):
    changelog = ChangelogItemSerializer(many=True, read_only=True)

    class Meta:
        model = Version
        fields = [
            "id",
            "project",
            "tag",
            "title",
            "summary",
            "status",
            "release_date",
            "created_at",
            "changelog",
        ]


class ProjectSerializer(serializers.ModelSerializer):
    versions = VersionSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = ["id", "name", "description", "repository_url", "created_at", "versions"]
