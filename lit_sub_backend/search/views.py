from user.serializers import UserSerializer
from rest_framework import pagination
from story.models import Story
from user.models import User
from story.serializers import StorySerializer
from user.serializers import UserSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.pagination import LimitOffsetPagination
    
class search_view(APIView):

    pagination_class = LimitOffsetPagination

    def get(self, request, search_str):
        stories= Story.objects.filter(story_title__icontains=search_str)
        users = User.objects.filter(username__icontains=search_str)
        story_serializer = StorySerializer(stories, many=True)
        user_serializer = UserSerializer(users, many=True)
        
        return Response({
            'stories': story_serializer.data,
            'users': user_serializer.data,
        })
        