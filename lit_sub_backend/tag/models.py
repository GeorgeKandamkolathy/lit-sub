from django.db.models.deletion import CASCADE
from django.db import models
from django.db.models.fields import TextField, CharField, IntegerField
from user.models import User

class Tag(models.Model):
    tag_name= CharField(max_length=50)
    