from django.db.models.query import QuerySet
from rest_framework import serializers
from .models import User

"""
UserSerializer extending ModelSerialzer
    Serializes id, username, author, bio, story_set
"""

class UserSerializer(serializers.ModelSerializer):
        
    class Meta:
        model = User
        fields = ['id', 'username', 'author', 'bio', 'story_set']