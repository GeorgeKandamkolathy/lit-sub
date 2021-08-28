from .models import User
from .serializers import UserSerializer
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import serializers, status
from rest_framework.permissions import BasePermission


class MyAccountAuthentication(BasePermission):

    def has_permission(self, request, view):
        if request.method == "POST" or request.method == "GET":
            return request.user.is_authenticated

"""
all_view is the APIView for all users

[get] = full user list
"""

class all_view(APIView):

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

'''
author_view returns a specific users data

[get] = return one user data
'''
class author_view(APIView):

    def get_object(self, author_id):
        try:
            return User.objects.get(id=author_id)
        except User.DoesNotExist:
            raise Http404

    def get(self, request, author_id):
        user = self.get_object(author_id)
        serializer = UserSerializer(user)
        return Response(serializer.data)

class my_account_view(APIView):

    permission_classes = [MyAccountAuthentication]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = UserSerializer(request.user, data={'bio':request.data['bio']}, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 

