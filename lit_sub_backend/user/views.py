from .models import User
from .serializers import UserSerializer
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
        authors = User.objects.all()
        serializer = UserSerializer(authors, many=True)
        return Response(serializer.data)    

    def post(self,request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 
    
class author_view(APIView):
    '''
    [post] = comments

    '''
    def get_object(self, author_id):
        try:
            return User.objects.get(id=author_id)
        except User.DoesNotExist:
            raise Http404

    def get(self, request, author_id):
        user = self.get_object(author_id)
        serializer = UserSerializer(user)
        return Response(serializer.data)