from django.contrib import admin

from .models import ChangelogItem, Project, Version

admin.site.register(Project)
admin.site.register(Version)
admin.site.register(ChangelogItem)
