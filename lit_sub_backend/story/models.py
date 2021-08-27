from django.db.models.deletion import CASCADE
from django.db import models
from django.db.models.fields import TextField, CharField, IntegerField
from user.models import User

class Story(models.Model):
    story_text = TextField()
    story_title = CharField(max_length=100)
    synopsis = CharField(max_length=500, default="")
    author = models.ManyToManyField(User, default=None)
    likes = IntegerField(default=0)
