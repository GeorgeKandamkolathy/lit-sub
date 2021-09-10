from django.test import TestCase
from rest_framework.test import APITestCase
from story.models import Story
from user.models import User
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status


class SearchTests(APITestCase):

    PASS = 'password'

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
    
    def test_search(self):
        self.create_user("user1")
        self.create_story_helper("test1", "title1")
        self.create_story_helper("test2", "title2")
        
        url = reverse('search:search', args=['test'])
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['users'][0]['username'], 'test1')
        self.assertEqual(len(response.data['stories']), 0)

    def test_search_no_result(self):
        
        url = reverse('search:search', args=['test'])
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['users']), 0)
        self.assertEqual(len(response.data['stories']), 0)
