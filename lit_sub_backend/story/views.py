from rest_framework import pagination
from .models import Comment, Story, Like
from tag.models import Tag
from .serializers import StorySerializer, CommentSerializer
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import BasePermission
from django.shortcuts import get_object_or_404
from rest_framework.pagination import LimitOffsetPagination

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

class all_view(APIView):
    """
    [get] = full story list
    [post] = new story
    Implement different order return???
    """
    permission_classes=[TokenAuthentication]
    pagination_class = LimitOffsetPagination

    def get(self, request, order):
        paginator = self.pagination_class()

        if order == "all":
            stories = Story.objects.all()       
        elif order == "top":
            
            stories = Story.objects.order_by('-likes')
            
        result_page = paginator.paginate_queryset(stories, request)
        serializer = StorySerializer(result_page, many=True, context={'request':request})
        
        return paginator.get_paginated_response(serializer.data)

class submit_view(APIView):

    permission_classes=[TokenAuthentication]

    def post(self, request):
        data = request.data
        serializer = StorySerializer(data=data)
        if serializer.is_valid():
            serializer.save(author=request.user, author_name=request.user.username)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 

class story_view(APIView):
    """
    [get] = Get single story
    [post] = Post comment to story
    [delete] = delete story
    """

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
        data = request.data
        data["story"] = story_id
        serializer = CommentSerializer(data=data)
        if serializer.is_valid():
            serializer.save(author=request.user, author_name=request.user.username)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)      
        
    def delete(self, request, story_id):
        story = self.get_object(story_id)
        if request.user == story.author:
            #delete comments
            for comment in story.comment_set.all():
                comment.like_set.all().delete()
            story.comment_set.all().delete()
            #delete likes
            story.like_set.all().delete()
            #delete story
            story.delete()
            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_403_FORBIDDEN)
    

class comment_view(APIView):
    """
    comment_view returns all comments of a story and has the delete method

    [get] = return the comments of a given story
    [delete] = deletes a comment from a story
    *** FIX ***
    Two urls for get and delete

    """
    
    def get(self, request, story_id, comment_id):
        story = get_object_or_404(Story, id=story_id)

        comments = story.comment_set.all()       
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def delete(self, request, story_id, comment_id):
        comment = get_object_or_404(Comment, id=comment_id)
        if comment.author == request.user:
            comment.like_set.all().delete()
            comment.delete()
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)

class like_view(APIView):
    """
    like_view either creates a like object for a comment or post
    otherwise deletes the object

    [put] = create or destroy like object for story or comment
    """

    permission_classes=[TokenAuthentication]

    def put(self, request, obj, obj_id):
        if obj == "story":
            story = get_object_or_404(Story, id=obj_id)
            if Like.objects.filter(story=story, author=request.user).exists():
                Like.objects.filter(story=story).delete()
                story.likes = story.likes - 1
            else:
                like = Like(author=request.user, story=story)
                like.save()
                story.likes = story.likes + 1 
            
            story.save()
            serializer = StorySerializer(story)
            return Response(serializer.data, status=status.HTTP_200_OK)

        elif obj == "comment":
            comment = get_object_or_404(Comment, id=obj_id)
            if Like.objects.filter(comment=comment).exists():
                Like.objects.filter(comment=comment).delete()
                comment.likes = comment.likes - 1
            else:
                like = Like(author=request.user, comment=comment)
                like.save()
                comment.likes = comment.likes + 1
            
            comment.save() 
            serializer = CommentSerializer(comment)
            return Response(serializer.data, status=status.HTTP_200_OK)

class group_return(APIView):

    pagination_class = LimitOffsetPagination

    def post(self, request, obj):
        if obj == "story":
            id_string = request.data['ids']
            id_set = [int(id) for id in id_string.split(',')]
            stories = Story.objects.filter(id__in=id_set)
            
            paginator = self.pagination_class()
            result_page = paginator.paginate_queryset(stories, request)
            serializer = StorySerializer(result_page, many=True, context={'request':request})
            
            return paginator.get_paginated_response(serializer.data)    

        elif obj == "comment":
            id_string = request.data['ids']
            id_set = [int(id) for id in id_string.split(',')]
            comments = Comment.objects.filter(id__in=id_set)
            
            paginator = self.pagination_class()
            result_page = paginator.paginate_queryset(comments, request)
            serializer = CommentSerializer(result_page, many=True, context={'request':request})
            
            return paginator.get_paginated_response(serializer.data)    

class tag_return_view(APIView):

    pagination_class = LimitOffsetPagination

    def get(self, request, tag):
        tag = Tag.objects.get(tag_name=tag)

        stories = tag.story_set.all()
        paginator = self.pagination_class()
        result_page = paginator.paginate_queryset(stories, request)
        
        serializer = StorySerializer(result_page, many=True, context={'request':request})

        return paginator.get_paginated_response(serializer.data) 