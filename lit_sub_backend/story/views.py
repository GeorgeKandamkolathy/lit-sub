from .models import Comment, Story
from .serializers import StorySerializer, CommentSerializer
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import BasePermission


class TokenAuthentication(BasePermission):

    def has_permission(self, request, view):
        if request.method == "POST":
            return request.user.is_authenticated
        if request.method == "GET":
            return True



class all_view(APIView):
    """
    [get] = full story list
    [post] = new story
    [delete] = delete story?
    
    Implement different order return???
    """
    permission_classes=[TokenAuthentication]

    def get(self, request):
        stories = Story.objects.all()
        serializer = StorySerializer(stories, many=True)
        return Response(serializer.data)    

    def post(self, request):
        data = request.data
        data['author'] = [request.user.id]
        data['author_name'] = request.user.username
        serializer = StorySerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 

class story_view(APIView):
    '''
    [post] = comments

    '''

    permission_classes=[TokenAuthentication]

    def get_object(self, story_id):
        try:
            return Story.objects.get(id=story_id)
        except Story.DoesNotExist:
            raise Http404

    def get(self, request, story_id):
        story = self.get_object(story_id)
        serializer = StorySerializer(story)
        return Response(serializer.data)
    
    def post(self, request, story_id):
        story = self.get_object(story_id)
        data = request.data
        data["story"] = story_id
        serializer = CommentSerializer(data=data)
        if serializer.is_valid():
            serializer.save(author=request.user, author_name=request.user.username)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)         
    
class comment_view(APIView):
    
    def get(self, request, story_id):
        try:
            story = Story.objects.get(id=story_id)
        except Story.DoesNotExist:
            raise Http404
        comments = story.comment_set.all()       
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
