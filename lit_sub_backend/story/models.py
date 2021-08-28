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

class Comment(models.Model):
    story = models.ForeignKey(Story, on_delete=CASCADE, default=0)
    author = models.ForeignKey(User, on_delete=CASCADE, default=0)
    comment_text = CharField(max_length=400)
    likes = IntegerField(blank=True, default=0)