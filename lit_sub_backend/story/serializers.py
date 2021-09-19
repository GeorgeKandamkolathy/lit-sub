from rest_framework import serializers
from .models import Story, Comment
from tag.models import Tag

class StorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Story
        fields = ['id', 'story_text', 'story_title', 'synopsis', 'author', 'author_name', 'likes', 'tags']

    def create(self, validated_data):
        if 'tags' in validated_data:
            tags = validated_data.pop('tags')
            story = Story.objects.create(**validated_data)
            for x in tags:
                story.tags.add(x.id)
        else:
            story = Story.objects.create(**validated_data)
        return story

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'comment_text', 'story', 'author', 'author_name', 'likes']