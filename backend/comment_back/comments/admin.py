from django.contrib import admin
from .models import Comment

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'text', 'created_at', 'parent')
    search_fields = ('username', 'email', 'text')