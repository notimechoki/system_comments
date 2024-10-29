from rest_framework import serializers
from .models import Comment
import bleach

class CommentSerializer(serializers.ModelSerializer):
    replies = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ('id', 'username', 'email', 'text', 'image', 'text_file', 'created_at', 'parent', 'replies')

    def get_replies(self, obj):
        replies = obj.replies.all()
        return CommentSerializer(replies, many=True).data

    def create(self, validated_data):
        parent = validated_data.get('parent', None)
        if parent:
            validated_data['parent'] = parent
        validated_data['text'] = bleach.clean(validated_data['text'], tags=['a', 'code', 'i', 'strong'], attributes={'a': ['href', 'title']})
        return super().create(validated_data)