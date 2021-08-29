from django.http.response import Http404
from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
from .models import User
from .serializers import UserSerializer
from django.contrib.auth import get_user_model

class UserTests(APITestCase): 
    USER = "Jose"
    PASS = "password"

    def test_create_user(self):
        url = reverse('user:authors')
        data = {"username": self.USER, "password": self.PASS, "author": "True", "bio" : "writer of bug", "story_set":[]}
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().username, self.USER)

    def test_get_all_authors(self):
        self.test_create_user()
        url = reverse('user:authors')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['username'], self.USER)

    def test_get_specific_author(self):
        self.test_create_user()
        url = reverse('user:detail', args=[1])
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], self.USER)

    def test_get_specific_no_author(self):
        url = reverse('user:detail', args=[50])
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_my_account(self):
        get_user_model().objects.create_user(self.USER, '', self.PASS)
        url = reverse('rest_login')
        response = self.client.post(url, {"username":self.USER, "password":self.PASS}, format="json")
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + response.data['key'])

        url = reverse('user:current')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], self.USER)
    
    def test_edit_bio(self):
        get_user_model().objects.create_user(self.USER, '', self.PASS)
        url = reverse('rest_login')
        response = self.client.post(url, {"username":self.USER, "password":self.PASS}, format="json")
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + response.data['key'])
        
        url = reverse('user:current')
        response = self.client.post(url, data={"bio":"i write bug"}, format="json")      

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['username'], self.USER)
        self.assertEqual(response.data['bio'], "i write bug")

