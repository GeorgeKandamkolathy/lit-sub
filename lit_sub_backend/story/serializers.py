from rest_framework import serializers
from rest_framework.fields import SerializerMethodField
from .models import Story, Comment
from tag.models import Tag
from tag.serializers import TagSerializer

class StorySerializer(serializers.ModelSerializer):
    tags_obj = SerializerMethodField()

    class Meta:
        model = Story
        fields = ['id', 'story_text', 'story_title', 'synopsis', 'author', 'author_name', 'likes', 'tags', 'tags_obj', 'view_count']

    def get_tags_obj(self,obj):
        serializer = TagSerializer(obj.tags, many=True)
        tags = []
        for tag in serializer.data:
            tags.append(tag["tag_name"])

        return tags

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