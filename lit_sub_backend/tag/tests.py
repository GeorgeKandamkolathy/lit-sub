from story.serializers import StorySerializer
from django.test import TestCase
from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import serializers, status
from story.models import Story
from tag.models import Tag
import pytest
from django.contrib.auth import get_user_model
from rest_framework.parsers import JSONParser

class TagTests(APITestCase): 

    def create_user(self, user):
        get_user_model().objects.create_user(user, '', self.PASS)

        url = reverse('rest_login')
        response = self.client.post(url, {"username":user, "password":self.PASS}, format="json")
        print(response.data)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + response.data['key'])

        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def create_story_helper(self, user, title):
        self.create_user(user)

        url = reverse('story:submit')
        data = {"story_text": "bug the end", "story_title": title}
        response = self.client.post(url, data, format='json')

    def test_create_tag(self):
        self.create_user('test1')

        url = reverse('tag:create')

        response = self.client.post(url, data={'tag_name':'tag1'})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(Tag.objects.all()), 1)
        self.assertEqual(response.data['tag_name'], 'tag1')

    def test_get_tags(self):
        self.test_create_tag()

        url = reverse('tag:tag')

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['tag_name'], 'tag1')
    
    def test_add_tag(self):
        self.create_story_helper('test1','title1')

        url = reverse('tag:add')

        response = self.client.post(url, data={'tags':'1'})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['story_title'], 'title1')
        self.assertEqual(response.data['tags'], [1])
    


