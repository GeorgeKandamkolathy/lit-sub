from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    author = models.BooleanField(default= False)
    bio = models.CharField(max_length= 400, default="")    
