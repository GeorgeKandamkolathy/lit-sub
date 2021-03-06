from .models import User
from .serializers import UserSerializer
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import serializers, status
from rest_framework.permissions import BasePermission
from rest_framework.pagination import LimitOffsetPagination


class MyAccountAuthentication(BasePermission):
    """
    Extends BasePermission to authorise POST or GET methods for authenticated
    users in my_account_view
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated

class all_view(APIView):
    """
    all_view is the APIView for all users

    [get] = full user list
    [post] = add new user 
    """

    pagination_class = LimitOffsetPagination

    def get(self, request):
        authors = User.objects.all()

        paginator = self.pagination_class()
        result_page = paginator.paginate_queryset(authors, request)
        serializer = UserSerializer(result_page, many=True, context={'request':request})
        
        return paginator.get_paginated_response(serializer.data)

    # Replace with dj_rest_auth
    def post(self,request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 


class author_view(APIView):
    """
    author_view returns a specific users data

    [get] = return one user's data
    """

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
    """
    my_account_view returns the data of the currently authenticated user and allows changes to bio

    [get] = return current authenticated user's data
    [post] = changes the existing bio to submited bio
    """

    permission_classes = [MyAccountAuthentication]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)
    
    #Change to different method?
    def post(self, request):
        serializer = UserSerializer(request.user, data={'bio':request.data['bio']}, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 

