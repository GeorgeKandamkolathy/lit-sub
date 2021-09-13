from rest_framework import pagination
from rest_framework.serializers import Serializer
from .models import Tag
from .serializers import TagSerializer
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import BasePermission
from django.shortcuts import get_object_or_404
from rest_framework.pagination import LimitOffsetPagination

class all_tag_view(APIView):

    def get(self, request):
        tags = Tag.objects.all()

        serializer = TagSerializer(tags, many=True)

        return Response(serializer.data)

    def post(self,request):
        data = request.data

        serializer = TagSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 