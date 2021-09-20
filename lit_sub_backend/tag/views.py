from django.utils import tree
from story.models import Story
from rest_framework import pagination
from rest_framework.serializers import Serializer
from .models import Tag
from .serializers import TagSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import BasePermission
from rest_framework.pagination import LimitOffsetPagination
from story.serializers import StorySerializer

class TokenAuthentication(BasePermission):

    def has_permission(self, request, view):
        if request.method == "POST":
            return request.user.is_authenticated
        if request.method == "PUT":
            return request.user.is_authenticated
        if request.method == "DELETE":
            return request.user.is_authenticated
        if request.method == "GET":
            return True

class all_tag_view(APIView):

    permission_classes=[TokenAuthentication]

    def get(self, request):
        tags = Tag.objects.all()

        serializer = TagSerializer(tags, many=True)

        return Response(serializer.data)

    def post(self,request):
        data = request.data

        serializer = TagSerializer(data=data)

        if serializer.is_valid():
            if not Tag.objects.filter(tag_name=request.data['tag_name']).exists(): 
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else: 
                tag = Tag.objects.get(tag_name=request.data['tag_name'])
                serializer = TagSerializer(tag)
                return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 

class add_tag_view(APIView):
    
    permission_classes=[TokenAuthentication]

    def post(self, request, story_id):
        story = Story.objects.get(id=story_id)

        if request.user != story.author:
            return Response(status=status.HTTP_403_FORBIDDEN)

        data = request.data

        data = story.tags + data['tags']

        serializer = StorySerializer(story, data={'tags': data}, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 
