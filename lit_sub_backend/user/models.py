from django.db import models
from django.contrib.auth.models import AbstractUser

"""
User Model extending AbstractUser 
    username: CharField - Stores username
    email: CharField - Stores registered username
    password: CharField - Stores encrypted password
    author: BooleanField - Stores whether user is an author
    bio: CharField - Stores biography for user
"""

class User(AbstractUser):
    author = models.BooleanField(default= False)
    bio = models.CharField(max_length= 400, default="")    
