from rest_framework import serializers
from .models import Story, Comment

class StorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Story
        fields = ['id', 'story_text', 'story_title', 'synopsis', 'author', 'likes']
    
class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'comment_text', 'story', 'author', 'likes']