from story.serializers import StorySerializer
from django.test import TestCase
from rest_framework.test import APIRequestFactory, APITestCase
from django.urls import reverse
from rest_framework import serializers, status
from .models import Story
from user.models import User
import pytest
from rest_framework.parsers import JSONParser

@pytest.mark.django_db
class StoryTests(APITestCase): 

    def create_user(self):
        url = reverse('user:authors')
        data = {"username": "jose", "password": "password", "author": "True", "bio" : "writer of bug", "story_set":[]}
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_story(self):
        self.client.login(username="jose", password="password")
        url = reverse('story:story')
        data = {"story_text": "bug the end", "story_title": "bug"}
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_get_all_story(self):
        self.test_create_story()
        url = reverse('story:story')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Story.objects.all().count(), 1)

    def test_get_specific_story(self):
        self.test_create_story()
        url = reverse('story:detail', args=[1])
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertEqual(response.data["story_title"], "bug")

    def test_create_empty_story(self):
        self.client.login(username='jose', password='password')
        url = reverse('story:story')
        data = {'story_text': '', 'story_title': 'bug'}
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_get_specific_no_story(self):
        url = reverse('story:detail', args=[10])
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)