from rest_framework import serializers
from story.models import Story

class StorySearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Story
        fields = ['id', 'story_title', 'synopsis', 'author', 'author_name', 'likes']