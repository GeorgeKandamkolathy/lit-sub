from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
from .models import User
from .serializers import UserSerializer

class UserTests(APITestCase): 

    def test_create_user(self):
        url = reverse('user:authors')
        data = {"username": "Jose", "password": "password", "author": "True", "bio" : "writer of bug", "story_set":[]}
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_csode, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().username, 'Jose')

    def test_get_all_authors(self):
        self.test_create_user()
        url = reverse('user:authors')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['username'], 'Jose')

    def test_get_specific_author(self):
        self.test_create_user()
        url = reverse('user:detail', args=[1])
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertEqual(response.data['username'], 'Jose')

    def test_get_specific_no_story(self):
        url = reverse('user:detail', args=[50])
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)