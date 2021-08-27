from .models import Story
from .serializers import StorySerializer
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class all_view(APIView):
    """
    [get] = full story list
    [post] = new story
    [delete] = delete story?
    
    Implement different order return???
    """

    def get(self, request):
        stories = Story.objects.all()
        serializer = StorySerializer(stories, many=True)
        return Response(serializer.data)    

    def post(self,request):
        serializer = StorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class story_view(APIView):
    '''
    [post] = comments

    '''
    def get_object(self, story_id):
        try:
            return Story.objects.get(id=story_id)
        except Story.DoesNotExist:
            raise Http404

    def get(self, request, story_id):
        story = self.get_object(story_id)
        serializer = StorySerializer(story)
        return Response(serializer.data)